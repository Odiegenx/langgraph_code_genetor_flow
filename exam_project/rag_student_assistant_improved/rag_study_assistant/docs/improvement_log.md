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

### 2026-05-07: Added persistent conversation memory

Reason:

The conversation was stored only in browser memory. Refreshing or closing the browser removed the conversation, and backend prompts depended on conversation history sent from the frontend.

Change:

Updated:

```text
app.py
static/app.js
README.md
docs/runbook.md
docs/user_guide.md
.gitignore
```

The backend now stores the current conversation in:

```text
conversations/current_session.json
```

New endpoints:

```text
GET /conversation
POST /conversation/clear
```

`POST /ask` now reads recent conversation messages from the persisted file, appends the user question, appends the assistant answer, and returns the updated conversation to the frontend.

Expected benefit:

- Conversation survives browser refreshes.
- Backend owns conversation memory instead of trusting frontend state.
- Creates a clear foundation for a later conversation-summary feature.
- Keeps conversation memory local and inspectable.

### 2026-05-07: Added conversation summary compression

Reason:

Persistent conversation memory can grow over time. Sending the full conversation to the model would increase prompt size and slow down responses.

Change:

Updated:

```text
app.py
rag/prompt_builder.py
README.md
docs/runbook.md
docs/user_guide.md
```

The backend now summarizes older messages when the conversation exceeds the configured threshold.

Current behavior:

- If the conversation has more than 10 messages, older messages are summarized.
- The latest 6 messages are kept verbatim.
- The summary is saved in `conversations/current_session.json`.
- Prompts receive both `conversation summary` and recent messages.

New endpoint:

```text
POST /conversation/summarize
```

Guardrail:

The summary is memory only. It is not a document source and must not be cited as evidence.

Expected benefit:

- Keeps prompts smaller as conversations grow.
- Preserves continuity across longer conversations.
- Demonstrates context-window management and memory compression.
- Prepares the app for longer study sessions without sending full chat history every time.

### 2026-05-07: Added summary progress message and longer summary timeout

Reason:

The request that triggers conversation summary performs two model operations: one to summarize older messages and one to answer the current question. This can take longer than a normal answer and should be visible to the user.

Change:

Updated:

```text
rag/ollama_client.py
app.py
static/app.js
docs/user_guide.md
docs/runbook.md
```

The frontend now shows:

```text
Summarizing older conversation, then answering...
```

when the local conversation is longer than the summary threshold.

The backend now uses a longer timeout for summary calls:

```text
240 seconds
```

Normal answer calls still use the default timeout.

Expected benefit:

- The user can see why a request may take longer.
- Summary has more time to complete on slower local/cloud models.
- Normal answers are not forced to use the longer timeout.

### 2026-05-07: Added archived conversation memory

Reason:

The first summary implementation compressed older messages into `summary` and kept only the latest messages. This controlled prompt size, but the exact older messages were no longer preserved after summarization.

Change:

Updated:

```text
app.py
static/app.js
README.md
docs/runbook.md
docs/user_guide.md
```

Conversation storage now uses:

```text
summary  - compressed memory sent to the model
archive  - exact older messages kept locally
messages - recent active messages sent to the model
```

The frontend renders `archive + messages`, so the user can still see the full conversation. The backend only sends `summary + messages` to the model.

Expected benefit:

- Older conversation is no longer lost after summary.
- Prompt size stays controlled because archive is not sent every time.
- The storage format is easier to explain: full local history is preserved, but model context is compressed.

### 2026-05-07: Added maximum summary size

Reason:

The conversation summary can also grow over time if many messages are summarized repeatedly. If it grows too large, it can recreate the same context-window and latency problem that summary was meant to solve.

Change:

Updated:

```text
app.py
README.md
docs/runbook.md
docs/user_guide.md
```

The backend now defines:

```text
SUMMARY_MAX_CHARS = 6000
```

The summary prompt asks the model to keep the updated summary under that limit. The backend then enforces the limit before saving the summary.

Expected benefit:

- Summary memory remains bounded.
- Prompt size stays predictable during long conversations.
- Exact older messages are still preserved in `archive`, so truncating summary does not delete the raw local conversation history.

### 2026-05-07: Moved runtime prompts into prompt files

Reason:

Prompt engineering is a central exam topic. Some runtime prompts were still embedded directly in Python code, which made them harder to inspect, discuss, and improve.

Change:

Created:

```text
prompts/direct_answer_prompt.md
prompts/hybrid_answer_prompt.md
prompts/rag_answer_addendum.md
prompts/summary_prompt.md
```

Updated:

```text
app.py
rag/prompt_builder.py
validate_project.py
README.md
docs/runbook.md
docs/user_guide.md
```

The Python code now loads Markdown prompt templates and fills placeholders such as:

```text
{context}
{question}
{conversation_summary}
{conversation_history}
{summary_max_chars}
```

Expected benefit:

- Prompt engineering is visible as project artifacts.
- Prompt changes can be reviewed without reading application code.
- The project is easier to explain at exam because each answer mode has its own prompt file.

### 2026-05-07: Added multiple conversation sessions

Reason:

The app previously had one active conversation. For real study use, the user needs to keep separate threads for different subjects and switch between them without losing context.

Change:

Updated:

```text
app.py
templates/index.html
static/app.js
static/styles.css
README.md
docs/runbook.md
docs/user_guide.md
```

Conversation runtime storage now uses:

```text
conversations/index.json
conversations/sessions/<conversation_id>.json
```

New backend endpoints:

```text
GET /conversations
POST /conversations
GET /conversation/<conversation_id>
POST /conversation/<conversation_id>/clear
```

The frontend now shows a permanent conversation list in a left sidebar. The list remains visible, marks the active conversation, and scrolls when many conversations exist.

Expected benefit:

- Users can separate study topics into different threads.
- Conversation memory, summary, and archive are scoped per conversation.
- The UI makes local memory management easier to demonstrate.

### 2026-05-07: Replaced clear conversation with per-conversation archive

Reason:

After adding multiple conversations, a global `Clear conversation` button became less useful. It was clearer to manage conversations directly from the sidebar where they are listed.

Change:

Updated:

```text
app.py
templates/index.html
static/app.js
static/styles.css
docs/runbook.md
docs/user_guide.md
```

Added:

```text
DELETE /conversation/<conversation_id>
```

Each sidebar conversation now has its own archive button. The old clear button was removed from the input area.

Archiving is a soft delete:

```json
{
  "archived": true,
  "archived_at": "..."
}
```

Archived conversations are hidden from the normal sidebar list, but their session files remain in `conversations/sessions/`.

Expected benefit:

- Conversation management is attached to the conversation list.
- Users can hide old study threads without losing the underlying local data.
- The UI is simpler because the input area focuses on asking questions.
