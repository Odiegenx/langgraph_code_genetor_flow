import json
import os
import re
import shutil
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path
from typing import Literal, TypedDict

from dotenv import load_dotenv
from langchain_ollama import ChatOllama
from langgraph.graph import END, START, StateGraph

load_dotenv()

DEFAULT_MODEL = os.getenv("MODEL_NAME", "qwen3-coder:480b-cloud")
ARCHITECT_ENDPOINT = os.getenv("PLANNER_ENDPOINT", os.getenv("LANGGRAPH_ENDPOINT", "http://localhost:11435"))
CODER_ENDPOINT = os.getenv("CODER_ENDPOINT", os.getenv("LANGGRAPH_ENDPOINT", "http://localhost:11435"))
QA_ENDPOINT = os.getenv("QA_ENDPOINT", os.getenv("LANGGRAPH_ENDPOINT", "http://localhost:11435"))
DOCS_ENDPOINT = os.getenv("DOCS_ENDPOINT", os.getenv("LANGGRAPH_ENDPOINT", "http://localhost:11435"))
DEPLOY_ENDPOINT = os.getenv("DEPLOY_ENDPOINT", os.getenv("LANGGRAPH_ENDPOINT", "http://localhost:11435"))
REVIEWER_ENDPOINT = os.getenv("REVIEWER_ENDPOINT", os.getenv("LANGGRAPH_ENDPOINT", "http://localhost:11435"))
ARCHITECT_MODEL = os.getenv("PLANNER_MODEL", DEFAULT_MODEL)
CODER_MODEL = os.getenv("CODER_MODEL", DEFAULT_MODEL)
QA_MODEL = os.getenv("QA_MODEL", DEFAULT_MODEL)
DOCS_MODEL = os.getenv("DOCS_MODEL", DEFAULT_MODEL)
DEPLOY_MODEL = os.getenv("DEPLOY_MODEL", DEFAULT_MODEL)
REVIEWER_MODEL = os.getenv("REVIEWER_MODEL", DEFAULT_MODEL)

INPUT_ROOT = Path(os.getenv("WORKFLOW_INPUT_DIR", "inputs"))
RUN_ID = os.getenv("RUN_ID", datetime.now().strftime("%Y%m%d_%H%M%S"))
OUTPUT_ROOT = Path(os.getenv("RUN_ROOT", f"results/runs/{RUN_ID}"))
ARTIFACT_LOG = OUTPUT_ROOT / "artifact_progress.md"
MAX_REVIEW_FIX_ITERATIONS = int(os.getenv("MAX_REVIEW_FIX_ITERATIONS", "2"))
LLM_RETRY_ATTEMPTS = int(os.getenv("LLM_RETRY_ATTEMPTS", "3"))
LLM_RETRY_DELAY_SECONDS = int(os.getenv("LLM_RETRY_DELAY_SECONDS", "10"))

architect_llm = ChatOllama(model=ARCHITECT_MODEL, base_url=ARCHITECT_ENDPOINT, temperature=0)
coder_llm = ChatOllama(model=CODER_MODEL, base_url=CODER_ENDPOINT, temperature=0)
qa_llm = ChatOllama(model=QA_MODEL, base_url=QA_ENDPOINT, temperature=0)
docs_llm = ChatOllama(model=DOCS_MODEL, base_url=DOCS_ENDPOINT, temperature=0)
deploy_llm = ChatOllama(model=DEPLOY_MODEL, base_url=DEPLOY_ENDPOINT, temperature=0)
reviewer_llm = ChatOllama(model=REVIEWER_MODEL, base_url=REVIEWER_ENDPOINT, temperature=0)


def _invoke_llm(llm: ChatOllama, prompt: str, role: str) -> str:
    last_error: Exception | None = None
    for attempt in range(1, max(1, LLM_RETRY_ATTEMPTS) + 1):
        try:
            return str(llm.invoke(prompt).content)
        except Exception as error:
            last_error = error
            if attempt >= max(1, LLM_RETRY_ATTEMPTS):
                break
            print(
                f"      {role} LLM call failed ({attempt}/{LLM_RETRY_ATTEMPTS}): {error}. "
                f"Retrying in {LLM_RETRY_DELAY_SECONDS}s..."
            )
            time.sleep(max(0, LLM_RETRY_DELAY_SECONDS))
    raise RuntimeError(f"{role} LLM call failed after {LLM_RETRY_ATTEMPTS} attempts: {last_error}") from last_error


class State(TypedDict):
    task: str
    input_context: str
    config: dict
    architecture: str
    tickets: str
    files: dict[str, str]
    test_output: str
    validation_passed: bool
    fix_iterations: int
    max_fix_iterations: int
    qa_report: str
    docs_files: dict[str, str]
    deploy_files: dict[str, str]
    review: str
    verdict: str
    review_fix_iterations: int
    max_review_fix_iterations: int


def _extract_json_object(text: str) -> dict[str, str]:
    fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", text, flags=re.DOTALL)
    raw = fenced.group(1) if fenced else text

    if not raw.strip().startswith("{"):
        start = raw.find("{")
        end = raw.rfind("}")
        if start != -1 and end != -1 and end > start:
            raw = raw[start : end + 1]

    data = json.loads(raw)
    if not isinstance(data, dict):
        raise ValueError("Expected a JSON object mapping file paths to content.")
    return {str(path): str(content) for path, content in data.items()}


def _record_invalid_json_response(role: str, response: str, error: Exception) -> None:
    safe_role = re.sub(r"[^a-zA-Z0-9_-]+", "_", role.strip().lower()).strip("_") or "llm"
    note_path = f"{safe_role}_invalid_json_response.txt"
    error_note = (
        f"{role} returned invalid JSON, so no project files were updated.\n\n"
        f"Error: {error}\n\n"
        "Raw response excerpt:\n"
        f"{str(response)[:12000]}"
    )
    written = _safe_write_files({note_path: error_note})
    _append_progress(
        f"{role} failed",
        written,
        "The model response could not be parsed as JSON. Re-run with the same input or use a stronger/smaller-scope coder model.",
    )


def _extract_single_file_content(text: str, target_file: str) -> str:
    path_match = re.search(r"^PATH:\s*(.+?)\s*$", text, flags=re.MULTILINE)
    if path_match and path_match.group(1).strip() != target_file:
        raise ValueError(f"Expected PATH {target_file}, got {path_match.group(1).strip()}")

    fenced_blocks = re.findall(r"```(?:[a-zA-Z0-9_.+-]+)?\s*\n(.*?)\n```", text, flags=re.DOTALL)
    if fenced_blocks:
        return fenced_blocks[-1].rstrip() + "\n"

    if "CONTENT:" in text:
        return text.split("CONTENT:", 1)[1].strip() + "\n"

    raise ValueError("Expected a fenced code block or CONTENT section.")


def _generate_worker_file(
    role_name: str,
    worker_role: str,
    target_file: str,
    constraints: str,
    context: str,
    files: dict[str, str],
) -> dict[str, str]:
    existing_file_list = "\n".join(f"- {path}" for path in sorted(files)) or "- none"
    prompt = f"""
You are {role_name}. {worker_role}

Generate exactly one file for the project.

Target file:
{target_file}

Existing files already generated:
{existing_file_list}

Relevant workflow context:
{context}

Constraints:
{constraints}

Return ONLY this format:

PATH: {target_file}
```text
complete file content
```

Rules:
- The PATH value must be exactly "{target_file}".
- Return complete file content for that file only.
- Keep the implementation compact and focused.
- Do not add explanation before or after the fenced content.
"""
    response = _invoke_llm(coder_llm, prompt, role_name)
    try:
        content = _extract_single_file_content(response, target_file)
    except (json.JSONDecodeError, ValueError) as error:
        _record_invalid_json_response(f"{role_name} {target_file}", response, error)
        raise RuntimeError(
            f"{role_name} returned an invalid single-file response while generating {target_file}. "
            "See the generated invalid_json_response file in the run folder."
        ) from error

    return {target_file: content}


def _read_input_file(path: Path, fallback: str = "") -> str:
    if path.exists():
        return path.read_text(encoding="utf-8")
    return fallback


def _load_workflow_inputs() -> tuple[str, str, dict]:
    task = _read_input_file(
        INPUT_ROOT / "task.md",
        (
            "Generate a small single-page Snake web application and the required "
            "workflow artifacts for a local multi-LLM coding workflow evaluation."
        ),
    )
    context_parts = []
    for file_name in ("demo_scope.md", "generation_contract.md"):
        path = INPUT_ROOT / file_name
        if path.exists():
            context_parts.append(f"# {file_name}\n\n{path.read_text(encoding='utf-8')}")
    config_path = INPUT_ROOT / "workflow_config.json"
    if config_path.exists():
        config = json.loads(config_path.read_text(encoding="utf-8"))
    else:
        config = {
            "project_name": "Generated project",
            "project_dir": "demo_project",
            "validation_command": ["mvn", "test"],
            "validation_output": "validation_output.txt",
            "review_output": "review.md",
            "worker_a": {"role": "Worker A", "required_files": [], "constraints": []},
            "worker_b": {"role": "Worker B", "required_files": [], "constraints": []},
            "final_docs": ["README.md", "docs/runbook.md"],
            "deployment_docs": ["docs/deployment_checklist.md"],
        }
    context_parts.append(f"# workflow_config.json\n\n```json\n{json.dumps(config, indent=2)}\n```")
    return task, "\n\n".join(context_parts), config


def _safe_write_files(files: dict[str, str]) -> list[str]:
    written: list[str] = []
    root = OUTPUT_ROOT.resolve()

    for relative_path, content in files.items():
        normalized = relative_path.replace("\\", "/").lstrip("/")
        if normalized.startswith("../") or "/../" in normalized or normalized == "..":
            raise ValueError(f"Refusing unsafe path: {relative_path}")

        target = (OUTPUT_ROOT / normalized).resolve()
        if root not in target.parents and target != root / normalized:
            raise ValueError(f"Refusing unsafe path: {relative_path}")

        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(content.rstrip() + "\n", encoding="utf-8")
        written.append(normalized)
        print(f"      [write] {normalized}")

    return written


def _append_progress(step: str, written: list[str] | None = None, note: str = "") -> None:
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    lines = [f"## {step}"]
    if note:
        lines.append("")
        lines.append(note)
    if written:
        lines.append("")
        lines.append("Files written:")
        lines.extend(f"- `{path}`" for path in written)
    lines.append("")
    with ARTIFACT_LOG.open("a", encoding="utf-8") as file:
        file.write("\n".join(lines) + "\n")


def _file_preview(files: dict[str, str], max_chars_per_file: int = 2500) -> str:
    previews: dict[str, str] = {}
    for path in sorted(files):
        content = files[path]
        if len(content) > max_chars_per_file:
            previews[path] = (
                content[:max_chars_per_file]
                + "\n\n[CONTENT PREVIEW TRUNCATED FOR REVIEW. THE ACTUAL FILE MAY CONTINUE.]"
            )
        else:
            previews[path] = content
    return json.dumps(previews, indent=2)


def _find_maven_command() -> list[str] | None:
    configured = os.getenv("MAVEN_CMD")
    if configured:
        return [configured]

    discovered = shutil.which("mvn") or shutil.which("mvn.cmd")
    if discovered:
        return [discovered]

    jetbrains_roots = [
        Path(r"C:\Program Files\JetBrains"),
        Path(os.getenv("LOCALAPPDATA", "")) / "JetBrains",
    ]
    for root in jetbrains_roots:
        if not root.exists():
            continue
        matches = list(root.rglob("mvn.cmd"))
        if matches:
            return [str(matches[0])]

    return None


def _resolve_validation_command(command: list[str]) -> list[str] | None:
    if not command:
        return None
    if command[0].lower() in {"python", "python3", "py"}:
        return [sys.executable, *command[1:]]
    if command[0].lower() in {"mvn", "mvn.cmd"}:
        maven_command = _find_maven_command()
        if not maven_command:
            return None
        return [*maven_command, *command[1:]]
    executable = shutil.which(command[0])
    if executable:
        return [executable, *command[1:]]
    return command


def _run_validation(config: dict) -> tuple[bool, str]:
    command = _resolve_validation_command(config.get("validation_command", []))
    if not command:
        return False, "Validation command was not found or could not be resolved."

    project_dir = OUTPUT_ROOT / config.get("project_dir", "demo_project")
    if not project_dir.exists():
        return False, f"Project directory was not generated: {project_dir}"

    try:
        completed = subprocess.run(
            command,
            cwd=project_dir,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=120,
            check=False,
        )
        return completed.returncode == 0, completed.stdout or ""
    except FileNotFoundError as error:
        return False, f"Validation command could not be started: {error}"
    except subprocess.TimeoutExpired as error:
        return False, f"Validation command timed out after {error.timeout} seconds."


def architect_node(state: State) -> dict:
    print("\n[1/10] Architect generating architecture artifacts...")
    prompt = f"""
You are the architect in a local multi-LLM coding workflow.

Task: {state["task"]}

External workflow input context:
{state["input_context"]}

Write concise but complete architecture output for the project described by the task and external context.
Include component decomposition, responsibilities, dataflow, and constraints.
Return markdown only.
"""
    architecture = _invoke_llm(architect_llm, prompt, "Architect")
    written = _safe_write_files({"docs/architecture.md": architecture})
    _append_progress("Architect complete", written)
    return {"architecture": architecture}


def tech_lead_node(state: State) -> dict:
    print("\n[2/10] Tech Lead generating tickets...")
    prompt = f"""
You are the tech lead.

Architecture:
{state["architecture"]}

External workflow input context:
{state["input_context"]}

Create a ticket backlog for the project described by the task, architecture, and external context.
Each ticket must include scope boundaries, acceptance criteria, definition of done, and dependencies.
Return markdown only.
"""
    tickets = _invoke_llm(architect_llm, prompt, "Tech Lead")
    written = _safe_write_files({"docs/tickets.md": tickets})
    _append_progress("Tech Lead complete", written)
    return {"tickets": tickets}


def worker_a_node(state: State) -> dict:
    print("\n[3/10] Worker A generating model and service files...")
    worker = state["config"].get("worker_a", {})
    constraints = "\n".join(f"- {constraint}" for constraint in worker.get("constraints", []))
    files = dict(state["files"])
    worker_files: dict[str, str] = {}
    context = f"""
Tickets:
{state["tickets"]}

External workflow input context:
{state["input_context"]}
"""
    for target_file in worker.get("required_files", []):
        print(f"      Worker A file: {target_file}")
        generated_file = _generate_worker_file(
            "Worker A",
            worker.get("role", ""),
            target_file,
            constraints,
            context,
            files,
        )
        files.update(generated_file)
        worker_files.update(generated_file)
        _safe_write_files(generated_file)
    written = sorted(worker_files)
    _append_progress("Worker A complete", written)
    return {"files": files}


def worker_b_node(state: State) -> dict:
    print("\n[4/10] Worker B generating assigned files...")
    worker = state["config"].get("worker_b", {})
    constraints = "\n".join(f"- {constraint}" for constraint in worker.get("constraints", []))
    files = dict(state["files"])
    worker_files: dict[str, str] = {}
    context = f"""
Architecture:
{state["architecture"]}

Tickets:
{state["tickets"]}

External workflow input context:
{state["input_context"]}
"""
    for target_file in worker.get("required_files", []):
        print(f"      Worker B file: {target_file}")
        generated_file = _generate_worker_file(
            "Worker B",
            worker.get("role", ""),
            target_file,
            constraints,
            context,
            files,
        )
        files.update(generated_file)
        worker_files.update(generated_file)
        _safe_write_files(generated_file)
    written = sorted(worker_files)
    _append_progress("Worker B complete", written)
    return {"files": files}


def write_project_node(state: State) -> dict:
    print("\n[5/10] Verifying generated project files are on disk...")
    project_dir = state["config"].get("project_dir", "demo_project").rstrip("/") + "/"
    project_files = {path: content for path, content in state["files"].items() if path.startswith(project_dir)}
    written = _safe_write_files(project_files)
    print(f"      Verified/wrote {len(written)} project files.")
    _append_progress("Project file write checkpoint", written)
    return {}


def validate_node(state: State) -> dict:
    print("\n[6/10] Running validation command...")
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
    passed, output = _run_validation(state["config"])
    validation_output = OUTPUT_ROOT / state["config"].get("validation_output", "validation_output.txt")
    validation_output.write_text(output, encoding="utf-8")
    print("      Validation result:", "pass" if passed else "fail")
    _append_progress(
        "Validation complete",
        [validation_output.name],
        f"Validation result: {'pass' if passed else 'fail'}",
    )
    return {"validation_passed": passed, "test_output": output}


def fix_node(state: State) -> dict:
    iteration = state["fix_iterations"] + 1
    print(f"\n[7/10] Fixer updating project files from validation output... ({iteration}/{state['max_fix_iterations']})")
    prompt = f"""
You are a build fixer for the project described by the external context.

The generated project failed validation.

Current files:
{json.dumps(state["files"], indent=2)}

External workflow input context:
{state["input_context"]}

Validation output:
{state["test_output"][-12000:]}

Return ONLY a JSON object mapping file paths to complete corrected file contents.
Regenerate a consistent complete project and include ALL required files from the external workflow config.

Hard requirements:
- Fix the exact compiler/test/validation errors shown above.
- Follow the external generation contract exactly.
- Only include generated project files, not logs.
No markdown outside the JSON.
"""
    files = dict(state["files"])
    fixer_response = _invoke_llm(coder_llm, prompt, "Validation Fixer")
    try:
        fixed_files = _extract_json_object(fixer_response)
    except (json.JSONDecodeError, ValueError) as error:
        note_path = f"fixer_iteration_{iteration}_parse_error.txt"
        error_note = (
            f"Fixer iteration {iteration} returned invalid JSON and no files were updated.\n\n"
            f"Error: {error}\n\n"
            "Raw response excerpt:\n"
            f"{str(fixer_response)[:8000]}"
        )
        written = _safe_write_files({note_path: error_note})
        _append_progress(
            f"Fix iteration {iteration} failed",
            written,
            "Fixer returned invalid JSON. The workflow will continue to the next bounded validation/fix attempt.",
        )
        return {"files": files, "fix_iterations": iteration}
    files.update(fixed_files)
    written = _safe_write_files(fixed_files)
    _append_progress(f"Fix iteration {iteration} complete", written)
    return {"files": files, "fix_iterations": iteration}


def review_fix_node(state: State) -> dict:
    iteration = state["review_fix_iterations"] + 1
    print(
        f"\n[review-fix] Fixer updating project files from reviewer feedback... "
        f"({iteration}/{state['max_review_fix_iterations']})"
    )
    prompt = f"""
You are a reviewer-feedback fixer for the generated project.

Validation has already run. The final reviewer still requested changes.

Reviewer feedback:
{state["review"][-12000:]}

Validation passed: {state["validation_passed"]}

Validation output:
{state["test_output"][-12000:]}

Current files:
{json.dumps(state["files"], indent=2)}

External workflow input context:
{state["input_context"]}

Return ONLY a JSON object mapping file paths to complete corrected file contents.
Only include generated project files that need changes.

Hard requirements:
- Fix concrete reviewer findings that are supported by the actual file contents.
- Do not rewrite docs, logs, or review files.
- Preserve the external generation contract.
- Validation runs with cwd set to project_dir, so validation scripts must use paths relative to project_dir.
- No markdown outside the JSON.
"""
    files = dict(state["files"])
    fixer_response = _invoke_llm(coder_llm, prompt, "Review Fixer")
    try:
        fixed_files = _extract_json_object(fixer_response)
    except (json.JSONDecodeError, ValueError) as error:
        note_path = f"review_fix_iteration_{iteration}_parse_error.txt"
        error_note = (
            f"Review fix iteration {iteration} returned invalid JSON and no files were updated.\n\n"
            f"Error: {error}\n\n"
            "Raw response excerpt:\n"
            f"{str(fixer_response)[:8000]}"
        )
        written = _safe_write_files({note_path: error_note})
        _append_progress(
            f"Review fix iteration {iteration} failed",
            written,
            "Reviewer-fixer returned invalid JSON. The workflow will continue within the bounded review-fix loop.",
        )
        return {"files": files, "review_fix_iterations": iteration}

    project_dir = state["config"].get("project_dir", "demo_project").rstrip("/") + "/"
    project_files = {path: content for path, content in fixed_files.items() if path.startswith(project_dir)}
    if not project_files:
        note_path = f"review_fix_iteration_{iteration}_no_project_files.txt"
        written = _safe_write_files(
            {
                note_path: (
                    f"Review fix iteration {iteration} returned no project files under {project_dir}.\n\n"
                    f"Returned paths:\n{json.dumps(sorted(fixed_files.keys()), indent=2)}"
                )
            }
        )
        _append_progress(
            f"Review fix iteration {iteration} skipped",
            written,
            "Reviewer-fixer returned no generated project files to update.",
        )
        return {"files": files, "review_fix_iterations": iteration}

    files.update(project_files)
    written = _safe_write_files(project_files)
    _append_progress(f"Review fix iteration {iteration} complete", written)
    return {"files": files, "review_fix_iterations": iteration}


def route_after_validation(state: State) -> Literal["qa", "fixer"]:
    if state["validation_passed"]:
        return "qa"
    if state["fix_iterations"] >= state["max_fix_iterations"]:
        return "qa"
    return "fixer"


def route_after_review(state: State) -> Literal["write_artifacts", "review_fix"]:
    if state["verdict"] == "good_enough":
        return "write_artifacts"
    if state["review_fix_iterations"] >= state["max_review_fix_iterations"]:
        return "write_artifacts"
    return "review_fix"


def qa_node(state: State) -> dict:
    print("\n[8/10] QA generating quality report from real validation output...")
    prompt = f"""
You are QA.

Validation passed: {state["validation_passed"]}

Validation output:
{state["test_output"][-12000:]}

Project files:
{json.dumps(state["files"], indent=2)}

Write docs/quality_report.md content.
Include the actual validation result, command used, known limitations, and whether follow-up fixes are needed.
Return markdown only.
"""
    qa_report = _invoke_llm(qa_llm, prompt, "QA")
    written = _safe_write_files({"docs/quality_report.md": qa_report})
    _append_progress("QA complete", written)
    return {"qa_report": qa_report}


def docs_node(state: State) -> dict:
    print("\n[9/10] Docs generating README and runbook...")
    required_docs = "\n".join(f"- {path}" for path in state["config"].get("final_docs", ["README.md", "docs/runbook.md"]))
    prompt = f"""
You are the docs writer.

Architecture:
{state["architecture"]}

Tickets:
{state["tickets"]}

Quality report:
{state["qa_report"]}

External workflow input context:
{state["input_context"]}

Generate ONLY a JSON object mapping file paths to complete markdown contents.
No markdown outside the JSON.

Required files:
{required_docs}
"""
    docs_files = _extract_json_object(_invoke_llm(docs_llm, prompt, "Docs"))
    written = _safe_write_files(docs_files)
    _append_progress("Docs complete", written)
    return {"docs_files": docs_files}


def deploy_node(state: State) -> dict:
    print("\n[10/10] Deployment Validator generating deployment checklist...")
    required_deploy_docs = "\n".join(
        f"- {path}" for path in state["config"].get("deployment_docs", ["docs/deployment_checklist.md"])
    )
    prompt = f"""
You are the deployment validator.

The project is described by the external context and generated inside the run output directory.
Validation passed: {state["validation_passed"]}

External workflow input context:
{state["input_context"]}

Validation output:
{state["test_output"][-8000:]}

Generate ONLY a JSON object mapping file paths to complete markdown contents.
No markdown outside the JSON.

Required file:
{required_deploy_docs}

The checklist must include prerequisites, validation commands, endpoint/config notes for the workflow, and local-only security assumptions.
"""
    deploy_files = _extract_json_object(_invoke_llm(deploy_llm, prompt, "Deployment Validator"))
    written = _safe_write_files(deploy_files)
    _append_progress("Deployment validation docs complete", written)
    return {"deploy_files": deploy_files}


def reviewer_node(state: State) -> dict:
    print("\n[review] Reviewer evaluating final artifacts...")
    paths = sorted(
        list(state["files"].keys())
        + list(state["docs_files"].keys())
        + list(state["deploy_files"].keys())
        + ["docs/architecture.md", "docs/tickets.md", "docs/quality_report.md", state["config"].get("validation_output", "validation_output.txt")]
    )
    prompt = f"""
You are the final reviewer.

Validation passed: {state["validation_passed"]}

Generated paths:
{chr(10).join(f"- {path}" for path in paths)}

Validation output:
{state["test_output"][-12000:]}

Generated file content preview:
{_file_preview(state["files"])}

Evaluate whether this satisfies the assignment demo requirements:
- generated project matching external inputs
- multi-file changes
- validation/tests actually executed
- docs
- deployment validation
- architecture and tickets

Also inspect the generated file content for obvious functional issues, not just path presence. Examples:
- Files should match their intended format and purpose, for example HTML files should contain valid HTML rather than markdown text.
- UI projects should have required markup, selectors, scripts, styles, and interactive containers wired together consistently.
- CLI, API, or library projects should include runnable checks for the core user-facing behavior described in the task.
- Validation scripts should check meaningful project contracts and acceptance criteria, not only file existence or syntax.
- Validation runs with cwd set to project_dir, so validation scripts should use paths relative to project_dir and should not prefix file paths with project_dir again.
- Some file previews may be truncated with an explicit CONTENT PREVIEW TRUNCATED marker. Do not report that as an actual truncated file unless validation output or full-file evidence shows the generated file itself is incomplete.

End with VERDICT: good_enough or VERDICT: needs_changes.
"""
    review = _invoke_llm(reviewer_llm, prompt, "Reviewer")
    verdict = "needs_changes"
    for line in review.splitlines():
        if "VERDICT:" in line.upper():
            verdict = "good_enough" if "good_enough" in line.lower() else "needs_changes"
    review_output = state["config"].get("review_output", "langgraph_java_review.md")
    written = _safe_write_files({review_output: review})
    _append_progress("Reviewer complete", written, f"Verdict: {verdict}")
    return {"review": review, "verdict": verdict}


def write_artifacts_node(state: State) -> dict:
    print("\n[write] Final artifact checkpoint...")
    generated_files: dict[str, str] = {
        "docs/architecture.md": state["architecture"],
        "docs/tickets.md": state["tickets"],
        "docs/quality_report.md": state["qa_report"],
        **state["docs_files"],
        **state["deploy_files"],
        state["config"].get("review_output", "langgraph_java_review.md"): state["review"],
    }
    written = _safe_write_files(generated_files)
    _append_progress("Final artifact checkpoint", written)
    print(f"      Verified/wrote {len(written)} final artifact files.")
    return {}


builder = StateGraph(State)
builder.add_node("architect", architect_node)
builder.add_node("tech_lead", tech_lead_node)
builder.add_node("worker_a", worker_a_node)
builder.add_node("worker_b", worker_b_node)
builder.add_node("write_project", write_project_node)
builder.add_node("validate", validate_node)
builder.add_node("fixer", fix_node)
builder.add_node("qa", qa_node)
builder.add_node("docs", docs_node)
builder.add_node("deploy", deploy_node)
builder.add_node("reviewer", reviewer_node)
builder.add_node("review_fix", review_fix_node)
builder.add_node("write_artifacts", write_artifacts_node)

builder.add_edge(START, "architect")
builder.add_edge("architect", "tech_lead")
builder.add_edge("tech_lead", "worker_a")
builder.add_edge("worker_a", "worker_b")
builder.add_edge("worker_b", "write_project")
builder.add_edge("write_project", "validate")
builder.add_conditional_edges("validate", route_after_validation)
builder.add_edge("fixer", "write_project")
builder.add_edge("qa", "docs")
builder.add_edge("docs", "deploy")
builder.add_edge("deploy", "reviewer")
builder.add_conditional_edges("reviewer", route_after_review)
builder.add_edge("review_fix", "write_project")
builder.add_edge("write_artifacts", END)

graph = builder.compile()


if __name__ == "__main__":
    task, input_context, config = _load_workflow_inputs()
    OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)

    print("\n==============================")
    print("  Configurable LangGraph Workflow")
    print("==============================")
    print(f"  Default model      : {DEFAULT_MODEL}")
    print(f"  Planner endpoint   : {ARCHITECT_ENDPOINT}")
    print(f"  Planner model      : {ARCHITECT_MODEL}")
    print("  Planner roles      : Architect, Tech Lead")
    print(f"  Coder endpoint     : {CODER_ENDPOINT}")
    print(f"  Coder model        : {CODER_MODEL}")
    print(f"  QA endpoint        : {QA_ENDPOINT}")
    print(f"  QA model           : {QA_MODEL}")
    print(f"  Docs endpoint      : {DOCS_ENDPOINT}")
    print(f"  Docs model         : {DOCS_MODEL}")
    print(f"  Deploy endpoint    : {DEPLOY_ENDPOINT}")
    print(f"  Deploy model       : {DEPLOY_MODEL}")
    print(f"  Reviewer endpoint  : {REVIEWER_ENDPOINT}")
    print(f"  Reviewer model     : {REVIEWER_MODEL}")
    print(f"  Input directory    : {INPUT_ROOT}")
    print(f"  Run output         : {OUTPUT_ROOT}")
    print(f"  Project name       : {config.get('project_name', 'Generated project')}")
    print("==============================\n")

    result = graph.invoke(
        {
            "task": task,
            "input_context": input_context,
            "config": config,
            "architecture": "",
            "tickets": "",
            "files": {},
            "test_output": "",
            "validation_passed": False,
            "fix_iterations": 0,
            "max_fix_iterations": 3,
            "qa_report": "",
            "docs_files": {},
            "deploy_files": {},
            "review": "",
            "verdict": "",
            "review_fix_iterations": 0,
            "max_review_fix_iterations": MAX_REVIEW_FIX_ITERATIONS,
        }
    )

    print("\n=== DONE ===")
    print(f"  Validation passed : {result['validation_passed']}")
    print(f"  Verdict           : {result['verdict']}")
    print(f"  Review fixes      : {result['review_fix_iterations']}/{result['max_review_fix_iterations']}")
    print("  Main outputs:")
    print(f"  - {OUTPUT_ROOT}/{config.get('project_dir', 'demo_project')}/")
    print(f"  - {OUTPUT_ROOT}/docs/quality_report.md")
    print(f"  - {OUTPUT_ROOT}/docs/deployment_checklist.md")
    print(f"  - {OUTPUT_ROOT / config.get('validation_output', 'validation_output.txt')}")
    print(f"  - {OUTPUT_ROOT / config.get('review_output', 'langgraph_java_review.md')}")
    print(f"  - {ARTIFACT_LOG}")
