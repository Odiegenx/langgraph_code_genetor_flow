# Runbook: Local RAG Study Assistant

## Prerequisites

- Python 3.9+
- pip (Python package installer)
- Ollama installed and running locally with `qwen3:8b` model pulled
  ```bash
  ollama pull qwen3:8b
  ```
- Sample documents placed in the `documents/` folder

## Quick Start

1. Clone or extract the project into your working directory.
2. Install dependencies:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\python.exe -m pip install -r requirements.txt
   ```
3. Ensure Ollama is running on `http://localhost:11434`
4. Run the ingestion process to index documents:
   ```powershell
   .\.venv\Scripts\python.exe rag\ingest.py
   ```
   You can also use the `Re-ingest documents` button in the browser UI.
5. Start the web application:
   ```powershell
   .\.venv\Scripts\python.exe app.py
   ```
6. Open browser at `http://localhost:5000`

## Validation Commands

Run structural and syntax validation:
```powershell
.\.venv\Scripts\python.exe validate_project.py
```

This will check:
- Required files exist
- 4T prompt format compliance
- Module import integrity
- Index generation status

Output saved to: `site_validation_output.txt`

## Endpoints & Configuration Notes

### Web Routes
- `GET /` – Serve main UI page
- `POST /ask` – Accept question input and return answer + citations
- `GET /models` – Return available Ollama models for the UI dropdown
- `POST /ingest` – Rebuild `index/chunks.json` from files in `documents/`
- `GET /status` – Report whether documents and index are available
- `GET /conversations` – Return the local conversation list
- `POST /conversations` – Create a new conversation
- `GET /conversation/<conversation_id>` – Return one persisted local conversation
- `POST /conversation/<conversation_id>/clear` – Clear one persisted local conversation
- `DELETE /conversation/<conversation_id>` – Archive one conversation and hide it from the visible list
- `POST /conversation/summarize` – Compress older messages into conversation summary

### Answer modes

`POST /ask` accepts:

```json
{
  "question": "What is acceptance testing?",
  "model": "qwen3:8b",
  "answer_mode": "hybrid",
  "conversation_id": "20260507_120000_abcd1234"
}
```

Allowed `answer_mode` values:

- `rag`
- `model`
- `hybrid`

`rag` and `hybrid` return document citations. `model` returns no citations.

### Configurable Settings
- Default LLM model: Editable in `rag/ollama_client.py` or config/environment variable
- Runtime model selection: available through the browser dropdown when Ollama responds to `/api/tags`
- Chunk size and overlap: Defined in `rag/ingest.py`
- Prompt templates: Located in `prompts/`

Runtime prompt files:

- `prompts/rag_4t_prompt.md`: RAG-only 4T prompt
- `prompts/rag_answer_addendum.md`: RAG conversation memory and guardrails
- `prompts/direct_answer_prompt.md`: model-only answer prompt
- `prompts/hybrid_answer_prompt.md`: hybrid RAG + model knowledge prompt
- `prompts/summary_prompt.md`: conversation memory compression prompt

### Index Files
Generated after running `rag/ingest.py`:
- `index/chunks.json`: Stores processed text chunks and metadata

### Conversation files

Generated while using the chat:

- `conversations/index.json`: Stores the visible conversation list.
- `conversations/sessions/<conversation_id>.json`: Stores each local conversation.

This is runtime data and should not be committed.

The file has three main fields:

- `summary`: compressed memory from older messages
- `archive`: exact older messages that have already been summarized
- `messages`: recent active messages kept verbatim

The summary is not a document source. It is only used as conversation memory.

The model receives `summary` plus recent `messages`. It does not receive the full `archive` on each request, which keeps prompt size and answer time under control while preserving the full chat history locally.

Summary behavior:

- automatic summary starts when the stored conversation has more than 10 messages
- older active messages are compressed into `summary` and moved to `archive`
- the latest 6 messages are kept verbatim
- saved summaries are capped at 6000 characters
- summary calls use a longer Ollama timeout than normal answer calls

## Troubleshooting

### 401 Unauthorized from Ollama

If using an Ollama cloud model, sign in:

```powershell
ollama signin
```

Then restart the Flask app.

### Timeout from Ollama

If sources appear but the answer is a timeout error, the RAG part is working and the model call is the slow part.

Try asking again, restarting Ollama, or using a faster model.

## Local-Only Security Assumptions

- No network exposure beyond localhost
- No user authentication or session tracking
- No data persistence beyond local filesystem
- No external service integrations
- All processing occurs within trusted environment

⚠️ Do not expose this application publicly without adding authentication and access control layers.
