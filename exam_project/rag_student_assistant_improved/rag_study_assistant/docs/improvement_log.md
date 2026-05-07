# Improvement log

This file tracks improvements made after the initial MVP branch.

Initial MVP branch:

```text
initial-mvp
```

Current improvement branch:

```text
improve-documentation
```

## Log entries

### 2026-05-07: Improved user documentation

Reason:

The improved MVP had working UI improvements, but its documentation was too generic and did not clearly explain the practical RAG workflow.
improvement-of-validator
```

## Purpose

The goal of this log is to document what was changed after the pipeline-generated MVP, why the change was needed, and how it improves the exam project.

## Log entries

### 2026-05-07: Created improvement log

Reason:

We need a single place to record all improvements made after the initial MVP state.

Change:

Created:

```text
docs/user_guide.md
docs/improvement_log.md
```

Updated:

```text
README.md
docs/runbook.md
```

The documentation now explains:

- where to add study files
- what ingestion means
- how to use the `Re-ingest documents` button
- how `documents/` becomes `index/chunks.json`
- how the 4T prompt is used
- how to run the app from this repository structure on Windows
- how to troubleshoot Ollama `401 Unauthorized`
- how to troubleshoot Ollama timeouts

Expected benefit:

- Makes the MVP easier to run from a clean pull.
- Makes the RAG flow easier to explain at exam.
- Connects the UI behavior to the technical files behind it.

### 2026-05-07: Added Ollama model selection

Reason:

The MVP used one hardcoded/default model. This made it harder to switch between local models and Ollama cloud models during demos, and made timeout or access issues harder to work around.

Change:

Updated:

```text
app.py
rag/ollama_client.py
templates/index.html
static/app.js
static/styles.css
README.md
docs/runbook.md
docs/user_guide.md
```

The app now:

- exposes `GET /models`
- loads model names from Ollama `GET /api/tags`
- shows the models in a browser dropdown
- sends the selected model with `POST /ask`
- falls back to the configured default model if the model list cannot be loaded
- displays the model used with the answer

Expected benefit:

- Easier to compare local and cloud models.
- Easier to recover from timeouts by selecting a faster model.
- Better demo value because model choice is visible in the UI.

### 2026-05-07: Added project-local virtual environment setup

Reason:

The app previously reused the repository root `.venv`, which was confusing when running the exam project from its own folder. Running `python app.py` could also hit the Windows Microsoft Store Python alias instead of the intended interpreter.

Change:

Created a project-local virtual environment:

```text
exam_project/rag_student_assistant_improved/rag_study_assistant/.venv
```

Installed dependencies from:

```text
requirements.txt
```

Updated:

```text
README.md
docs/runbook.md
docs/user_guide.md
```

The documented run command is now:

```powershell
.\.venv\Scripts\python.exe app.py
```

Expected benefit:

- The exam app can be treated as a self-contained project.
- Setup commands are easier to understand.
- Users avoid accidentally calling the wrong `python.exe`.
docs/improvement_log.md
```

Expected benefit:

- Makes post-MVP changes easier to explain.
- Creates a clear link between generated MVP and manual/assisted improvements.
- Helps with exam documentation and review.

### 2026-05-07: Improved project validator 4T check

Reason:

The validator reported that the 4T prompt was missing required sections, even though the prompt contained Markdown headings:

```text
## Traits
## Task
## Tone
## Target
```

The validator only looked for literal strings with colons:

```text
Traits:
Task:
Tone:
Target:
```

Change:

Updated:

```text
validate_project.py
```

The prompt section check now accepts both Markdown headings and colon-based labels.

Additional cleanup:

- Reads the prompt file as UTF-8.
- Writes `site_validation_output.txt` as UTF-8.
- Returns exit code `0` when validation passes.
- Returns exit code `1` when validation fails.

Expected benefit:

- Validation now matches the actual generated 4T prompt format.
- The validation command is more useful in scripts and CI-like checks.
- The project can demonstrate that the 4T prompt requirement is satisfied.
