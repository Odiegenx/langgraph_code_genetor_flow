# Improvement log

This file tracks improvements made after the initial MVP branch.

Initial MVP branch:

```text
initial-mvp
```

Current branch:

```text
implement-hybrid-mode
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

Change:

Updated:

```text
validate_project.py
```

Expected benefit:

- Validation now matches the generated 4T prompt format.
- The validation command is more useful in scripts and CI-like checks.
- The project can demonstrate that the 4T prompt requirement is satisfied.

### 2026-05-07: Improved user documentation

Reason:

The improved MVP had working UI improvements, but its documentation was too generic and did not clearly explain the practical RAG workflow.

Change:

Created:

```text
docs/user_guide.md
```

Updated:

```text
README.md
docs/runbook.md
```

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

Expected benefit:

- Easier to compare local and cloud models.
- Easier to recover from timeouts by selecting a faster model.
- Better demo value because model choice is visible in the UI.

### 2026-05-07: Added project-local virtual environment setup

Reason:

The app previously reused the repository root `.venv`, which was confusing when running the exam project from its own folder.

Change:

Created a project-local virtual environment:

```text
exam_project/rag_student_assistant_improved/rag_study_assistant/.venv
```

Updated:

```text
README.md
docs/runbook.md
docs/user_guide.md
```

Expected benefit:

- The exam app can be treated as a self-contained project.
- Setup commands are easier to understand.
- Users avoid accidentally calling the wrong `python.exe`.

### 2026-05-07: Verified and fixed RAG toggle behavior

Reason:

A teammate added a UI option for answering with or without RAG. A smoke test showed that the no-RAG path worked, but it ignored the model selected in the UI and fell back to the default model.

Change:

Updated:

```text
app.py
```

Expected benefit:

- Model selection works consistently whether RAG is enabled or disabled.
- The frontend can show which model was used for the answer.
- The API response makes it explicit whether the answer used document retrieval.

### 2026-05-07: Added conversational answer modes and hybrid guardrails

Reason:

The app originally handled one question at a time. To make the project more relevant to RAG, prompt engineering, context management, and guardrails, the answer flow was expanded into a small conversational assistant.

Change:

Updated:

```text
app.py
rag/prompt_builder.py
templates/index.html
static/app.js
static/styles.css
README.md
docs/runbook.md
docs/user_guide.md
docs/feature_roadmap.md
```

The checkbox for RAG on/off was replaced with an answer mode dropdown:

```text
RAG only
Model only
Hybrid
```

The browser now keeps a short conversation history and sends recent messages with each `/ask` request.

Hybrid mode uses retrieved document chunks first, but allows general model knowledge when useful. The prompt requires the answer to separate:

```text
Based on your documents:
...

Additional model knowledge:
...

Sources:
...
```

Guardrails:

- Do not invent citations.
- Only cite retrieved document sources.
- Clearly mark what comes from documents and what comes from general model knowledge.

Expected benefit:

- Supports follow-up questions.
- Makes RAG vs model-only vs hybrid behavior explicit.
- Demonstrates prompt engineering and guardrail design.
- Keeps the exam project focused on syllabus-relevant LLM concepts.
