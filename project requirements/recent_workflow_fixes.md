# Recent Workflow Fixes

This document summarizes the workflow fixes made while preparing the exam project generation flow.

## Context

The `rag_study_assistant` exam project is larger than the earlier browser-game and task-tracker demos. Because of that, the LLM had to generate more files and more code in a single run.

This exposed a few robustness issues in the existing LangGraph workflow:

- planner responses could fail if the model returned non-JSON output
- Worker A could return a very large JSON object that was truncated
- malformed JSON caused long tracebacks with little actionable information
- it was hard to see which files had actually been written while a run was active

The following changes were made to improve this.

## 1. Input-Prep Planner JSON Debugging

File changed:

```text
prepare_workflow_inputs.py
```

Problem:

The input-prep planner sometimes returned output that was not valid JSON. This caused a raw `JSONDecodeError`, for example:

```text
json.decoder.JSONDecodeError: Expecting value: line 1 column 1
```

Fix:

Added debug handling for invalid planner JSON.

If the planner returns invalid JSON while generating workflow input files, the raw response is now written to:

```text
generated_inputs/_debug/planner_invalid_json_<timestamp>.txt
```

The script now reports a clearer error explaining that the planner returned invalid JSON.

Why it helps:

We can inspect what the model actually returned instead of only seeing a Python traceback.

## 2. Worker A/B Invalid JSON Diagnostics

File changed:

```text
langgraph_workflow.py
```

Problem:

Worker A returned invalid JSON during project generation:

```text
json.decoder.JSONDecodeError: Unterminated string
```

The workflow crashed before any useful diagnostic file was produced.

Fix:

Added a helper:

```text
_record_invalid_json_response(...)
```

Worker A and Worker B now catch JSON parsing errors and write the raw model response to the run folder, for example:

```text
results/runs/<RUN_ID>/worker_a_invalid_json_response.txt
```

The artifact progress log is also updated with the failure.

Why it helps:

The run still stops when a worker returns unusable JSON, but the failure is now inspectable and easier to debug.

## 3. Worker A/B Generate One File At A Time

File changed:

```text
langgraph_workflow.py
```

Problem:

For the RAG Study Assistant project, Worker A was asked to return many complete files in one large JSON object. The response was cut off mid-file, causing:

```text
Unterminated string
```

The raw response showed that the model had generated several files successfully, but the JSON broke while generating `validate_project.py`.

Fix:

Worker A and Worker B now generate one required file per LLM call.

Added helper:

```text
_generate_worker_file(...)
```

Instead of one prompt asking for all files, each worker now loops through its `required_files` list and asks for exactly one file at a time.

Each response must be a JSON object with exactly one key:

```json
{
  "target_file_path": "complete file content"
}
```

Why it helps:

This reduces the size of each LLM response and greatly lowers the risk of truncated JSON.

Tradeoff:

The workflow uses more LLM calls and can take longer, but it is more stable for larger projects.

## 4. Console Output For Written Files

File changed:

```text
langgraph_workflow.py
```

Problem:

During long runs it was hard to see whether files were actually being written while the workflow was running.

Fix:

Updated the shared file-writing helper:

```text
_safe_write_files(...)
```

It now prints every file written to the console:

```text
[write] rag_study_assistant/app.py
[write] rag_study_assistant/rag/ingest.py
```

Why it helps:

It gives immediate progress feedback during long runs and makes demos easier to follow.

## 5. Input Validation Fix For Project-Scoped Docs

File changed:

```text
prepare_workflow_inputs.py
```

Problem:

The generated `workflow_config.json` used documentation paths like:

```text
rag_study_assistant/docs/runbook.md
```

The deterministic validator incorrectly rejected this because it only accepted docs paths like:

```text
docs/runbook.md
```

Fix:

Updated markdown doc detection so documentation files under project folders are accepted, for example:

```text
rag_study_assistant/docs/runbook.md
```

Why it helps:

The validator now matches the project structure we actually ask the workflow to generate.

## Verification

After the changes, the Python files were checked with:

```powershell
.\.venv\Scripts\python.exe -m py_compile .\langgraph_workflow.py .\prepare_workflow_inputs.py
```

The compile check passed.

## Current Recommended Run Command

Use the already generated and approved input set:

```powershell
flow.cmd main -InputDir generated_inputs\local-rag-study-assistant -RunId student_assist_with_rags_05
```

If input-prep should be run again from the request folder:

```powershell
flow.cmd start -RequestDir input_requests\rag_study_assistant -RunId student_assist_with_rags_05
```

## Practical Impact

The workflow is now better suited for larger generated projects like the exam RAG Study Assistant because:

- invalid model JSON is easier to inspect
- worker generation is less likely to be truncated
- files are written and shown incrementally
- long runs are easier to monitor
- project-scoped documentation paths are accepted
