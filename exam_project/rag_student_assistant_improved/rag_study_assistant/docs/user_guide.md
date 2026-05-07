# User guide: Local RAG Study Assistant

This guide explains how the application works, where to add study material, how ingestion works, and how to run the MVP.

## What the application does

Local RAG Study Assistant is a browser-based study tool that answers questions from local course material.

The application first searches the user's local documents, selects relevant text chunks, inserts those chunks into a 4T prompt, and sends the final prompt to Ollama.

The goal is to make answers grounded in the student's own notes and course files.

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
..\..\..\.venv\Scripts\python.exe rag\ingest.py
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
..\..\..\.venv\Scripts\python.exe app.py
```

Open:

```text
http://localhost:5000
```

## Model configuration

The default model is configured in:

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
..\..\..\.venv\Scripts\python.exe app.py
```

## 4T prompt engineering

The 4T prompt is stored here:

```text
prompts/rag_4t_prompt.md
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

## Validation

Run:

```powershell
..\..\..\.venv\Scripts\python.exe validate_project.py
```

The result is written to:

```text
site_validation_output.txt
```

## Troubleshooting

### PowerShell cannot find `python`

Use the project virtual environment explicitly:

```powershell
..\..\..\.venv\Scripts\python.exe app.py
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
- `prompts/rag_4t_prompt.md`: 4T prompt template.
- `static/app.js`: browser-side behavior.
- `templates/index.html`: main page.
- `validate_project.py`: project sanity check.

## MVP limitations

- Retrieval is keyword/score based, not embedding based.
- PDF support depends on the PDF having extractable text.
- Ollama must be running locally.
- Cloud models require Ollama login.
- The app is a local prototype and should not be exposed publicly without authentication.
