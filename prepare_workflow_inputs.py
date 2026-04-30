import argparse
import json
import os
import re
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from langchain_ollama import ChatOllama

load_dotenv()

DEFAULT_MODEL = os.getenv("MODEL_NAME", "qwen3-coder:480b-cloud")
PLANNER_ENDPOINT = os.getenv("PLANNER_ENDPOINT", os.getenv("LANGGRAPH_ENDPOINT", "http://localhost:11435"))
REVIEWER_ENDPOINT = os.getenv("REVIEWER_ENDPOINT", os.getenv("LANGGRAPH_ENDPOINT", "http://localhost:11435"))
PLANNER_MODEL = os.getenv("PLANNER_MODEL", DEFAULT_MODEL)
REVIEWER_MODEL = os.getenv("REVIEWER_MODEL", DEFAULT_MODEL)
LLM_RETRY_ATTEMPTS = int(os.getenv("LLM_RETRY_ATTEMPTS", "3"))
LLM_RETRY_DELAY_SECONDS = int(os.getenv("LLM_RETRY_DELAY_SECONDS", "10"))

REQUIRED_INPUT_FILES = {
    "task.md",
    "demo_scope.md",
    "generation_contract.md",
    "workflow_config.json",
}

REQUIRED_CONFIG_KEYS = {
    "project_name",
    "project_dir",
    "validation_command",
    "validation_output",
    "review_output",
    "worker_a",
    "worker_b",
    "final_docs",
    "deployment_docs",
}


def _is_non_retryable_llm_error(error: Exception) -> bool:
    message = str(error).lower()
    return "status code: 403" in message or "subscription is required" in message


def _invoke_llm(llm: ChatOllama, prompt: str, role: str) -> str:
    attempts = max(1, LLM_RETRY_ATTEMPTS)
    for attempt in range(1, attempts + 1):
        try:
            return str(llm.invoke(prompt).content)
        except Exception as error:
            if _is_non_retryable_llm_error(error):
                raise RuntimeError(
                    f"{role} model call failed because the configured model is not currently available.\n"
                    f"Endpoint/model: {getattr(llm, 'base_url', 'unknown')} / {getattr(llm, 'model', 'unknown')}\n"
                    "The provider returned 403/subscription/high-volume. Use a local model, change the role model in .env, or try again later.\n"
                    f"Original error: {error}"
                ) from error
            if attempt == attempts:
                raise RuntimeError(
                    f"{role} model call failed after {attempts} attempts.\n"
                    f"Original error: {error}"
                ) from error
            print(
                f"      {role} model call failed ({attempt}/{attempts}); "
                f"retrying in {LLM_RETRY_DELAY_SECONDS}s..."
            )
            time.sleep(LLM_RETRY_DELAY_SECONDS)

    raise RuntimeError(f"{role} model call failed unexpectedly.")


def _extract_json_object(text: str) -> dict[str, Any]:
    fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, flags=re.DOTALL)
    raw = fenced.group(1) if fenced else text

    if not raw.strip().startswith("{"):
        start = raw.find("{")
        end = raw.rfind("}")
        if start != -1 and end != -1 and end > start:
            raw = raw[start : end + 1]

    data = json.loads(raw)
    if not isinstance(data, dict):
        raise ValueError("Expected a JSON object.")
    return data


def _record_invalid_planner_json(response: str, error: Exception) -> Path:
    debug_dir = Path(os.getenv("PREP_DEBUG_DIR", "generated_inputs/_debug"))
    debug_dir.mkdir(parents=True, exist_ok=True)
    debug_file = debug_dir / f"planner_invalid_json_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    debug_file.write_text(
        "Planner returned invalid JSON while generating workflow input files.\n\n"
        f"Error: {error}\n\n"
        "Raw response excerpt:\n"
        f"{str(response)[:12000]}\n",
        encoding="utf-8",
    )
    return debug_file


def _slugify(value: str) -> str:
    slug = re.sub(r"[^a-zA-Z0-9_-]+", "-", value.strip().lower()).strip("-")
    return slug or f"generated-task-{datetime.now().strftime('%Y%m%d-%H%M%S')}"


def _safe_write_input_files(output_dir: Path, files: dict[str, str]) -> list[str]:
    output_dir.mkdir(parents=True, exist_ok=True)
    root = output_dir.resolve()
    written: list[str] = []

    for relative_path, content in files.items():
        normalized = relative_path.replace("\\", "/").lstrip("/")
        while normalized.startswith("./"):
            normalized = normalized[2:]
        if normalized not in REQUIRED_INPUT_FILES and normalized != "input_review.md":
            raise ValueError(f"Unexpected generated input file: {relative_path}")
        target = (output_dir / normalized).resolve()
        if target.parent != root:
            raise ValueError(f"Refusing unsafe generated input path: {relative_path}")
        target.write_text(str(content).rstrip() + "\n", encoding="utf-8")
        written.append(normalized)

    return written


def _validate_generated_inputs(files: dict[str, str]) -> tuple[bool, list[str], dict[str, Any]]:
    issues: list[str] = []
    missing = REQUIRED_INPUT_FILES - set(files)
    if missing:
        issues.append(f"Missing required input files: {', '.join(sorted(missing))}")

    unexpected = set(files) - REQUIRED_INPUT_FILES
    if unexpected:
        issues.append(f"Unexpected files: {', '.join(sorted(unexpected))}")

    config: dict[str, Any] = {}
    if "workflow_config.json" in files:
        try:
            config = json.loads(files["workflow_config.json"])
        except json.JSONDecodeError as error:
            issues.append(f"workflow_config.json is invalid JSON: {error}")

    for key in REQUIRED_CONFIG_KEYS:
        if key not in config:
            issues.append(f"workflow_config.json is missing key: {key}")

    if config and not isinstance(config.get("validation_command"), list):
        issues.append("workflow_config.json validation_command must be a list.")
    elif config:
        project_prefix = f"{str(config.get('project_dir', '')).strip().rstrip('/')}/"
        for part in config.get("validation_command", [])[1:]:
            normalized_part = str(part).replace("\\", "/").lstrip("./")
            if project_prefix and normalized_part.startswith(project_prefix):
                issues.append(
                    "workflow_config.json validation_command runs inside project_dir, "
                    f"so command arguments must not repeat project_dir '{project_prefix}': {part}"
                )

    if config and not _is_simple_relative_file_name(config.get("validation_output")):
        issues.append("workflow_config.json validation_output must be a simple relative file name, for example validation_output.txt.")

    if config and not _is_simple_relative_file_name(config.get("review_output")):
        issues.append("workflow_config.json review_output must be a simple relative file name, for example workflow_review.md.")

    if config and not isinstance(config.get("final_docs"), list):
        issues.append("workflow_config.json final_docs must be a list of relative file paths.")

    if config and not isinstance(config.get("deployment_docs"), list):
        issues.append("workflow_config.json deployment_docs must be a list of relative file paths.")

    for docs_key in ("final_docs", "deployment_docs"):
        if isinstance(config.get(docs_key), list):
            for path in config[docs_key]:
                if not _is_safe_relative_path(path):
                    issues.append(f"workflow_config.json {docs_key} contains an unsafe or invalid path: {path}")
                elif _looks_like_project_asset(path):
                    issues.append(
                        f"workflow_config.json {docs_key} must contain documentation paths, not project asset paths: {path}"
                    )

    if isinstance(config.get("final_docs"), list):
        if not any(_looks_like_markdown_doc(path) for path in config["final_docs"]):
            issues.append("workflow_config.json final_docs must include at least one markdown documentation file, for example README.md or docs/runbook.md.")

    if isinstance(config.get("deployment_docs"), list):
        if not any(_looks_like_markdown_doc(path) for path in config["deployment_docs"]):
            issues.append("workflow_config.json deployment_docs must include at least one markdown documentation file, for example docs/deployment_checklist.md.")

    for worker_key in ("worker_a", "worker_b"):
        worker = config.get(worker_key)
        if not isinstance(worker, dict):
            issues.append(f"workflow_config.json {worker_key} must be an object.")
            continue
        if not isinstance(worker.get("role"), str) or not worker.get("role", "").strip():
            issues.append(f"workflow_config.json {worker_key}.role must be a non-empty string.")
        if not isinstance(worker.get("required_files"), list) or not worker.get("required_files"):
            issues.append(f"workflow_config.json {worker_key}.required_files must be a non-empty list.")
        elif config.get("project_dir"):
            project_prefix = f"{str(config['project_dir']).strip().rstrip('/')}/"
            for path in worker["required_files"]:
                if not _is_safe_relative_path(path):
                    issues.append(f"workflow_config.json {worker_key}.required_files contains an unsafe or invalid path: {path}")
                elif not str(path).replace("\\", "/").startswith(project_prefix):
                    issues.append(f"workflow_config.json {worker_key}.required_files path must start with project_dir '{project_prefix}': {path}")
                elif _looks_like_binary_or_directory_asset(path):
                    issues.append(
                        f"workflow_config.json {worker_key}.required_files must be source/doc files, not binary assets or directories: {path}"
                    )
        if not isinstance(worker.get("constraints"), list) or not worker.get("constraints"):
            issues.append(f"workflow_config.json {worker_key}.constraints must be a non-empty list.")

    if config:
        worker_a_files = set(config.get("worker_a", {}).get("required_files", [])) if isinstance(config.get("worker_a"), dict) else set()
        worker_b_files = set(config.get("worker_b", {}).get("required_files", [])) if isinstance(config.get("worker_b"), dict) else set()
        overlap = worker_a_files & worker_b_files
        if overlap:
            issues.append(f"worker_a and worker_b required_files must be disjoint. Overlap: {', '.join(sorted(overlap))}")

    return not issues, issues, config


def _is_safe_relative_path(value: Any) -> bool:
    if not isinstance(value, str) or not value.strip():
        return False
    normalized = value.replace("\\", "/").strip().lstrip("/")
    if normalized.startswith("../") or "/../" in normalized or normalized == "..":
        return False
    return True


def _is_simple_relative_file_name(value: Any) -> bool:
    if not _is_safe_relative_path(value):
        return False
    normalized = str(value).replace("\\", "/").strip().lstrip("/")
    if "/" in normalized:
        return False
    if any(char in normalized for char in [":", "*", "?", "\"", "<", ">", "|"]):
        return False
    return "." in normalized and len(normalized) <= 80


def _looks_like_project_asset(value: Any) -> bool:
    if not isinstance(value, str):
        return False
    normalized = value.lower().replace("\\", "/").strip()
    return normalized.endswith((".html", ".css", ".js", ".ts", ".java", ".py", ".json"))


def _looks_like_binary_or_directory_asset(value: Any) -> bool:
    if not isinstance(value, str):
        return False
    normalized = value.lower().replace("\\", "/").strip()
    return normalized.endswith("/") or normalized.endswith(
        (".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".mp3", ".wav", ".mp4", ".zip")
    )


def _looks_like_markdown_doc(value: Any) -> bool:
    if not isinstance(value, str):
        return False
    normalized = value.lower().replace("\\", "/").strip()
    return (
        normalized == "readme.md"
        or normalized.startswith("docs/") and normalized.endswith(".md")
        or "/docs/" in normalized and normalized.endswith(".md")
        or normalized.endswith("/readme.md")
    )


def _generate_inputs(request_text: str, feedback: str = "") -> dict[str, str]:
    planner = ChatOllama(model=PLANNER_MODEL, base_url=PLANNER_ENDPOINT, temperature=0)
    feedback_section = ""
    if feedback.strip():
        feedback_section = f"""
Previous attempt feedback:
{feedback}

Regenerate the complete input set with these issues fixed.
"""
    prompt = f"""
You are an input designer for a configurable LangGraph software-generation workflow.

The user will provide a plain-language project request. Convert it into exactly these four input files:

- task.md
- demo_scope.md
- generation_contract.md
- workflow_config.json

Return only a JSON object mapping file path to file content. Do not return markdown outside the JSON.

workflow_config.json must contain:
- project_name
- project_dir
- validation_command as an array of command parts
- validation_output
- review_output
- worker_a with role, required_files, constraints
- worker_b with role, required_files, constraints
- final_docs
- deployment_docs

Rules:
- Make the project small enough for a local demo.
- Prefer validation commands that can run locally without external services.
- If the request is a static website, prefer vanilla HTML/CSS/JavaScript and Node validation with a generated validate_site.js.
- For generated web demos, do not require binary image/audio/video assets such as .png, .jpg, .webp, .mp3, or asset directories.
- If visuals are requested, implement them with CSS, emoji, inline SVG strings, canvas drawing, gradients, or text-based placeholders that can be generated as source code.
- required_files must list concrete source/documentation files only, not folders or binary assets.
- Validation must check behaviorally meaningful acceptance criteria, not only file existence or syntax.
- For UI projects, validation should check that required markup, selectors, scripts, styles, and interactive containers are wired together consistently.
- For CLI, API, or library projects, validation should include runnable checks for the core user-facing behavior described in the task.
- The main workflow runs validation_command with cwd set to project_dir.
- Any validation scripts must use paths relative to project_dir and must not prefix file paths with project_dir again.
- If dependencies are needed, make them explicit in generation_contract.md.
- Make Worker A and Worker B own disjoint file sets.
- All required_files must include the project_dir prefix.
- validation_output must be a simple file name such as site_validation_output.txt, not a sentence.
- review_output must be a simple file name such as workflow_review.md, not a sentence.
- final_docs and deployment_docs must be arrays of documentation file paths such as README.md, docs/runbook.md, and docs/deployment_checklist.md.
- final_docs and deployment_docs must not include project assets such as index.html, styles.css, app.js, or game source files.
- worker_a.constraints and worker_b.constraints must be arrays of short constraint strings.
- validation_command runs from inside project_dir. For a project_dir named browser-games, use ["node", "validate_site.js"], not ["node", "browser-games/validate_site.js"].

User request:
{request_text}

{feedback_section}
"""
    generated: dict[str, str] = {}
    planner_response = _invoke_llm(planner, prompt, "Planner")
    try:
        parsed_response = _extract_json_object(planner_response)
    except (json.JSONDecodeError, ValueError) as error:
        debug_file = _record_invalid_planner_json(planner_response, error)
        raise RuntimeError(
            "Planner returned invalid JSON while generating workflow input files.\n"
            f"Raw response excerpt was written to: {debug_file}\n"
            "This can happen if the model response is interrupted, truncated, or includes non-JSON text."
        ) from error
    for path, content in parsed_response.items():
        normalized = str(path).replace("\\", "/").lstrip("/")
        while normalized.startswith("./"):
            normalized = normalized[2:]
        if normalized == "workflow_config.json" and isinstance(content, (dict, list)):
            generated[normalized] = json.dumps(content, indent=2)
        else:
            generated[normalized] = str(content)
    return generated


def _generate_questions(request_text: str) -> str:
    planner = ChatOllama(model=PLANNER_MODEL, base_url=PLANNER_ENDPOINT, temperature=0)
    prompt = f"""
You are preparing clarifying questions before generating workflow input files.

The eventual files are:
- task.md
- demo_scope.md
- generation_contract.md
- workflow_config.json

Ask only questions that would materially improve those files.
Focus on ambiguity in:
- project type and tech stack
- required features and non-goals
- validation command and acceptance criteria
- file/project structure
- worker split
- docs/deployment expectations

Rules:
- Ask at most 5 questions.
- Do not ask about details already answered by the request.
- Prefer concrete multiple-choice or short-answer questions.
- If the request is already specific enough, return exactly: NO_QUESTIONS_NEEDED
- Return markdown only.

User request:
{request_text}
"""
    return _invoke_llm(planner, prompt, "Question planner").strip()


def _review_inputs(request_text: str, files: dict[str, str], validation_issues: list[str]) -> tuple[str, str]:
    reviewer = ChatOllama(model=REVIEWER_MODEL, base_url=REVIEWER_ENDPOINT, temperature=0)
    prompt = f"""
You are reviewing generated workflow input files before a code-generation workflow is allowed to run.

Original user request:
{request_text}

Generated input files:
{json.dumps(files, indent=2)}

Deterministic validation issues:
{json.dumps(validation_issues, indent=2)}

Review whether these inputs are specific, safe, runnable, and likely to produce a small demo project.

Return a concise markdown review.
End with exactly one of:
VERDICT: good_enough
VERDICT: needs_changes
"""
    review = _invoke_llm(reviewer, prompt, "Input reviewer")
    verdict = "needs_changes"
    for line in review.splitlines():
        if line.strip().lower() == "verdict: good_enough":
            verdict = "good_enough"
        if line.strip().lower() == "verdict: needs_changes":
            verdict = "needs_changes"
    if validation_issues:
        verdict = "needs_changes"
    return review, verdict


def _run_generation_workflow(input_dir: Path, run_id: str) -> int:
    env = os.environ.copy()
    env["WORKFLOW_INPUT_DIR"] = str(input_dir)
    env["RUN_ID"] = run_id
    return subprocess.run(
        [sys.executable, "langgraph_workflow.py"],
        env=env,
        check=False,
    ).returncode


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate workflow input files from a plain-language request.")
    parser.add_argument(
        "--request",
        default=os.getenv("PREP_REQUEST_FILE"),
        help="Path to the plain-language project request.",
    )
    parser.add_argument(
        "--request-dir",
        default=os.getenv("PREP_REQUEST_DIR"),
        help="Directory containing request.md, optional questions.md, and optional answers.md.",
    )
    parser.add_argument(
        "--output-root",
        default=os.getenv("PREP_OUTPUT_ROOT", "generated_inputs"),
        help="Directory where generated input sets are written.",
    )
    parser.add_argument("--slug", default=os.getenv("PREP_SLUG"), help="Optional name for the generated input folder.")
    parser.add_argument("--run-id", default=os.getenv("RUN_ID"), help="Optional run id for the generation workflow.")
    parser.add_argument("--questions", action="store_true", help="Generate clarifying questions for a request directory and stop.")
    parser.add_argument(
        "--max-input-fix-iterations",
        type=int,
        default=int(os.getenv("MAX_INPUT_FIX_ITERATIONS", "3")),
        help="Maximum number of input generation attempts before giving up.",
    )
    parser.add_argument("--no-run", action="store_true", help="Generate and review inputs, but do not run the workflow.")
    args = parser.parse_args()

    request_dir = Path(args.request_dir) if args.request_dir else None
    request_path = request_dir / "request.md" if request_dir else Path(args.request or "input_requests/new_project_request.md")
    if not request_path.exists():
        print(f"Request file not found: {request_path}")
        print("Create it first, then run this script again.")
        return 1

    request_text = request_path.read_text(encoding="utf-8").strip()
    if not request_text:
        print(f"Request file is empty: {request_path}")
        return 1

    questions_path = request_dir / "questions.md" if request_dir else None
    answers_path = request_dir / "answers.md" if request_dir else None

    if args.questions:
        if not request_dir:
            print("--questions requires --request-dir so questions are tied to a specific task.")
            return 1
        if questions_path.exists() and answers_path.exists():
            print(f"Questions already answered for this request: {request_dir}")
            print(f"Questions: {questions_path}")
            print(f"Answers  : {answers_path}")
            return 0
        if questions_path.exists():
            print(f"Questions already exist: {questions_path}")
            print(f"Create answers here: {answers_path}")
            return 0

        questions = _generate_questions(request_text)
        request_dir.mkdir(parents=True, exist_ok=True)
        questions_path.write_text(questions.rstrip() + "\n", encoding="utf-8")
        print(f"Clarifying questions written to: {questions_path}")
        if questions.strip() == "NO_QUESTIONS_NEEDED":
            print("Planner judged that no clarifying questions are needed.")
        else:
            print(f"Answer them in: {answers_path}")
        return 0

    if request_dir and answers_path.exists():
        answers_text = answers_path.read_text(encoding="utf-8").strip()
        if answers_text:
            request_text = (
                f"{request_text}\n\n"
                "# Clarifying Answers\n\n"
                f"{answers_text}"
            )
            print(f"Using clarifying answers: {answers_path}")
    elif request_dir and questions_path and questions_path.exists():
        print(f"Clarifying questions exist but answers are missing: {questions_path}")
        print(f"Continuing without answers. To use them, create: {answers_path}")
    elif request_dir:
        print(f"No clarifying questions found for request dir: {request_dir}")
        print("Optional: run questions first, for example:")
        print(f"  prepare_workflow_inputs.py --request-dir {request_dir} --questions")

    print("\n==============================")
    print("  Workflow Input Preparation")
    print("==============================")
    print(f"  Planner endpoint : {PLANNER_ENDPOINT}")
    print(f"  Planner model    : {PLANNER_MODEL}")
    print(f"  Reviewer endpoint: {REVIEWER_ENDPOINT}")
    print(f"  Reviewer model   : {REVIEWER_MODEL}")
    print(f"  Request file     : {request_path}")
    if request_dir:
        print(f"  Request dir      : {request_dir}")
    print("==============================\n")

    max_attempts = max(1, args.max_input_fix_iterations)
    files: dict[str, str] = {}
    validation_issues: list[str] = []
    config: dict[str, Any] = {}
    review = ""
    verdict = "needs_changes"
    feedback = ""

    for attempt in range(1, max_attempts + 1):
        print(f"[1/3] Generating workflow input files... ({attempt}/{max_attempts})")
        files = _generate_inputs(request_text, feedback)
        valid, validation_issues, config = _validate_generated_inputs(files)

        print(f"[2/3] Reviewing generated input files... ({attempt}/{max_attempts})")
        review, verdict = _review_inputs(request_text, files, validation_issues)

        print(f"      Input verdict: {verdict}")
        if validation_issues:
            print("      Deterministic validation issues:")
            for issue in validation_issues:
                print(f"      - {issue}")

        if valid and verdict == "good_enough":
            break

        feedback = (
            "The previous generated input set was rejected.\n\n"
            f"Deterministic validation issues:\n{json.dumps(validation_issues, indent=2)}\n\n"
            f"Reviewer feedback:\n{review}"
        )
        if attempt < max_attempts:
            print("      Regenerating inputs with rejection feedback...")

    slug = args.slug or _slugify(str(config.get("project_name", request_path.stem)))
    input_dir = Path(args.output_root) / slug
    files_with_review = {**files, "input_review.md": review}
    written = _safe_write_input_files(input_dir, files_with_review)

    print(f"      Input directory: {input_dir}")
    print("      Files written:")
    for path in written:
        print(f"      - {path}")

    if args.no_run:
        print("\n[3/3] Skipping generation workflow because --no-run was provided.")
        return 0 if verdict == "good_enough" and not validation_issues else 1

    if verdict != "good_enough":
        print("\n[3/3] Not running generation workflow because input review needs changes.")
        print(f"      Review file: {input_dir / 'input_review.md'}")
        return 1

    run_id = args.run_id or f"{slug}-{datetime.now().strftime('%Y%m%d-%H%M%S')}"
    print("\n[3/3] Starting configurable LangGraph workflow...")
    print(f"      WORKFLOW_INPUT_DIR={input_dir}")
    print(f"      RUN_ID={run_id}")
    return _run_generation_workflow(input_dir, run_id)


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except RuntimeError as error:
        print("\nERROR:")
        print(str(error))
        raise SystemExit(1)
