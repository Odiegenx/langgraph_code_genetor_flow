# User guide: Local RAG Study Assistant

This guide explains how the application works, where to add study material, how ingestion works, and how to run the MVP.

## What the application does

Local RAG Study Assistant is a browser-based study tool that answers questions from local course material.

The application first searches the user's local documents, selects relevant text chunks, inserts those chunks into a 4T prompt, and sends the final prompt to Ollama.

The goal is to make answers grounded in the student's own notes and course files.

The app keeps persistent local conversation sessions in `conversations/`. This supports follow-up questions, multiple conversation threads, and browser refreshes.

## Application flow

```text
documents/
  -> rag/ingest.py
  -> index/chunks.json
  -> rag/retrieve.py
  -> prompts/rag_4t_prompt.md
  -> rag/ollama_client.py
  -> answer and sources in the browser
```

## Where to add study material

Add course notes, slides exported as text, personal notes, or PDFs here:

```text
documents/
```

Supported formats:

- `.txt`
- `.md`
- `.pdf`

After adding or editing files, the documents must be ingested again.

## What ingestion means

Ingestion reads the files in `documents/`, splits them into smaller chunks, and writes the searchable index to:

```text
index/chunks.json
```

The app searches `index/chunks.json` when answering questions. It does not search the original files directly during each question.

You can run ingestion from the browser by clicking:

```text
Re-ingest documents
```

Or from PowerShell, while standing in the app folder:

```powershell
.\.venv\Scripts\python.exe rag\ingest.py
```

## How to run the app

Start Ollama first:

```powershell
$env:OLLAMA_HOST="127.0.0.1:11434"
ollama serve
```

Then start the Flask app:

```powershell
cd "C:\Users\pf\Desktop\Skole\LLM for Developers\LLM\mandetory1\Mandatory-1 real\exam_project\rag_student_assistant_improved\rag_study_assistant"
.\.venv\Scripts\python.exe app.py
```

Open:

```text
http://localhost:5000
```

## Model configuration

The app can load available models from Ollama and show them in the browser model dropdown.

The model list is loaded from:

```text
GET /models
```

The backend retrieves that list from Ollama:

```text
GET http://localhost:11434/api/tags
```

When asking a question, the selected model is sent to:

```text
POST /ask
```

The default fallback model is configured in:

```text
rag/ollama_client.py
```

Current default:

```python
DEFAULT_MODEL = "glm-4.6:cloud"
```

You can override it before starting the app:

```powershell
$env:OLLAMA_MODEL="qwen3:8b"
.\.venv\Scripts\python.exe app.py
```

If the model dropdown cannot load models, check that Ollama is running on `localhost:11434`.

## Answer modes

The app supports three answer modes.

### RAG only

Uses retrieved document chunks as the only source.

Best for syllabus-grounded answers and reducing hallucinations. If the documents do not contain enough information, the model should say that the documents do not cover it.

### Model only

Does not use retrieved document chunks.

Best for comparing against RAG answers or asking general questions. No sources are shown in this mode.

### Hybrid

Uses retrieved document chunks as the primary source, but allows the model to add general knowledge when helpful.

The hybrid prompt requires the model to separate:

```text
Based on your documents:
...

Additional model knowledge:
...

Sources:
...
```

The model must not invent citations. Only retrieved document chunks can be listed as sources.

## 4T prompt engineering

The 4T prompt is stored here:

```text
prompts/rag_4t_prompt.md
```

All main runtime prompts are stored in `prompts/` so they can be inspected and discussed directly:

```text
prompts/rag_4t_prompt.md
prompts/rag_answer_addendum.md
prompts/direct_answer_prompt.md
prompts/hybrid_answer_prompt.md
prompts/summary_prompt.md
```

It contains:

- Traits: how the assistant should behave.
- Task: what the assistant must do.
- Tone: how the answer should be written.
- Target: who the answer is for.

The app inserts:

```text
{context}
{question}
```

`{context}` is filled with retrieved chunks from local documents.

`{question}` is filled with the user's question from the web UI.

For hybrid mode, `rag/prompt_builder.py` adds guardrails that require document-based information and model knowledge to be separated.

`rag/prompt_builder.py` is responsible for loading prompt templates and filling placeholders such as `{context}`, `{question}`, `{conversation_summary}`, and `{conversation_history}`. The prompt instructions themselves live in Markdown files, not directly in Python code.

## Validation

Run:

```powershell
.\.venv\Scripts\python.exe validate_project.py
```

The result is written to:

```text
site_validation_output.txt
```

## Conversation memory

Conversation metadata is stored locally in:

```text
conversations/index.json
```

Each conversation is stored as a separate session file:

```text
conversations/sessions/<conversation_id>.json
```

The file contains:

- `summary`: compressed memory from older messages
- `archive`: exact older messages that have already been compressed
- `messages`: recent user and assistant messages kept as active prompt context

The app uses recent persisted messages as short-term conversation context when building prompts.

When the conversation becomes long, older active messages are compressed into `summary` and moved to `archive`. The prompt then receives:

```text
conversation summary
recent messages
current question
```

The `archive` field keeps the older exact messages locally so the chat history is not lost, but those archived messages are not sent to the model on every question. This keeps the prompt smaller while preserving an inspectable full history.

The summary is only memory of the dialogue. It is not a document source and must not be cited as evidence.

The summary is capped at 6000 characters. The summary prompt asks the model to stay under that limit, and the backend truncates the saved summary if the model still returns a longer result.

When summary is about to happen, the UI shows:

```text
Summarizing older conversation, then answering...
```

Summary uses a longer Ollama timeout than a normal answer because that request performs memory compression before the final answer is generated.

The left sidebar lists conversations from `conversations/index.json`. Selecting a conversation loads that session file, and `POST /ask` receives the selected `conversation_id`.

Conversation endpoints:

```text
GET /conversations
POST /conversations
GET /conversation
GET /conversation/<conversation_id>
POST /conversation/clear
POST /conversation/<conversation_id>/clear
DELETE /conversation/<conversation_id>
POST /conversation/summarize
```

Each conversation in the sidebar has an archive button. Archiving a conversation hides it from the visible list, keeps its session file in `conversations/sessions/`, and switches the UI to another available conversation.

The `conversations/` folder is runtime data and is ignored by git.

## Troubleshooting

### PowerShell cannot find `python`

Use the project virtual environment explicitly:

```powershell
.\.venv\Scripts\python.exe app.py
```

### Ollama 401 Unauthorized

If the app returns:

```text
[Error] 401 Client Error: Unauthorized
```

then the selected Ollama cloud model requires login.

Fix:

```powershell
ollama signin
```

Then restart the Flask app.

### Ollama timeout

If sources are shown but the answer says `Read timed out`, RAG retrieval is working but the model did not answer before the timeout.

Try:

- ask the question again
- restart Flask
- restart Ollama
- use a faster model

## Important files

- `app.py`: Flask routes and application flow.
- `documents/`: local study material.
- `rag/ingest.py`: turns documents into chunks.
- `index/chunks.json`: generated RAG index.
- `rag/retrieve.py`: scores and selects relevant chunks.
- `rag/prompt_builder.py`: builds the final 4T RAG prompt.
- `rag/ollama_client.py`: sends prompts to Ollama.
- `prompts/`: prompt templates for RAG, model-only, hybrid, and summary behavior.
- `static/app.js`: browser-side behavior.
- `templates/index.html`: main page.
- `validate_project.py`: project sanity check.

## MVP limitations

- Retrieval is keyword/score based, not embedding based.
- PDF support depends on the PDF having extractable text.
- Ollama must be running locally.
- Cloud models require Ollama login.
- The app is a local prototype and should not be exposed publicly without authentication.
