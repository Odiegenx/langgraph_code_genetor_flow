# Readiness Check

## Scope

This check summarizes the current delivery state after the Java/Maven reference run and the static website reference run.

## Reference Runs

Primary Java/Maven run:

```text
results/runs/20260411_191854/
```

Evidence:

- `artifact_progress.md`
- `maven_test_output.txt`
- `maven_package_output.txt`
- `manual_runtime_check.md`
- `langgraph_java_review.md`
- `demo_project/target/task-tracker-cli-1.0-SNAPSHOT.jar`

Secondary configurable website run:

```text
results/runs/website-demo-02/
```

Evidence:

- `artifact_progress.md`
- `site_validation_output.txt`
- `manual_runtime_check.md`
- `langgraph_website_review.md`
- `website_project/`

Latest strongest request-folder website run:

```text
results/runs/website-prep-demo-11/
```

Evidence:

- `artifact_progress.md`
- `workflow_review.md`
- `browser-games/site_validation_output.txt`
- `manual_runtime_check.md`
- `browser-games/`
- request context in `input_requests/browser_games/`

This run used clarifying questions/answers and the reviewer-fix loop. It reached final reviewer verdict `good_enough` after one review-fix iteration.

## Requirement Coverage

Covered:

- Two local model endpoints via role-based environment variables.
- At least two evaluated toolchains: CrewAI and LangGraph.
- Recommended workflow: LangGraph.
- Architecture, tech lead, implementation, testing, docs, deployment validation, and review responsibilities.
- Multiple implementation workers.
- Externalized workflow inputs in `inputs/` and `test_projects/website_task/`.
- Per-run output folders under `results/runs/<RUN_ID>/`.
- Real validation output from Maven and Node.
- Manual runtime checks for the generated Java CLI and generated website.
- Bounded validation-fix loop and bounded reviewer-fix loop.
- Clarifying question/answer flow for request folders.
- LLM call retry wrapper for temporary endpoint errors such as Ollama `503`.

Presentation source material is covered by the delivery docs, requirement mapping and documented run evidence. The final slide deck can be assembled from those files.

## Current Root Folder Notes

Relevant root items:

- `assignment specs.txt`
- `.env`
- `requirements.txt`
- `langgraph_workflow.py`
- `prepare_workflow_inputs.py`
- `flow.ps1`
- `flow.cmd`
- `inputs/`
- `input_requests/`
- `test_projects/`
- `delivery_docs/`
- `docs/`
- `results/`
- `legacy/`

CrewAI comparison evidence:

- `delivery_docs/08_crewai_evidence_note.md`
- `legacy/snake_prototype/crewai_pipeline.py`
- `legacy/snake_prototype/Snake/first iteration/crewai_output.txt`
- `legacy/snake_prototype/Snake/first iteration/crewai_snake.html`

Cleanup completed:

- Root-level `__pycache__/` was removed.
- Empty root-level `demo_project/` was removed.
- Root-level `Codex contex.txt` was moved to `legacy/scratch_notes/Codex contex latest.txt`.
- Root-level `GAP_ANALYSIS.md` was moved to `legacy/scratch_notes/GAP_ANALYSIS.md`.

## Verification Performed

The workflow file passed Python syntax validation:

```powershell
.\.venv\Scripts\python.exe -m py_compile .\langgraph_workflow.py
```

The setup guide was checked for stale commands pointing to the old root-level Snake prototypes. Those commands are no longer present in the main setup flow.

## New Input Preparation Flow

The repository now includes a front-step for creating workflow inputs from a plain-language request:

```text
prepare_workflow_inputs.py
```

Default request file:

```text
input_requests/new_project_request.md
```

Recommended request-folder pattern:

```text
input_requests/<task_name>/
  request.md
  questions.md
  answers.md
```

Clarifying questions can be generated with:

```powershell
.\flow.cmd questions -RequestDir input_requests\browser_games
```

Generated input sets are written to:

```text
generated_inputs/<slug>/
```

The prep step generates `task.md`, `demo_scope.md`, `generation_contract.md`, and `workflow_config.json`, reviews them, and only starts the main LangGraph workflow automatically if the review verdict is `good_enough`.

If deterministic input validation or reviewer feedback rejects the generated inputs, the prep step sends the issues back to the planner model and retries. The default limit is three attempts and can be changed with:

```powershell
.\.venv\Scripts\python.exe .\prepare_workflow_inputs.py --max-input-fix-iterations 3
```

The recommended short command is now:

```powershell
.\flow.cmd start -RunId demo-run-01
```

Optional fix-loop controls:

```powershell
.\flow.cmd start -RunId demo-run-01 -MaxInputFixIterations 3 -MaxReviewFixIterations 2
```

Health/syntax check:

```powershell
.\flow.cmd check
```
