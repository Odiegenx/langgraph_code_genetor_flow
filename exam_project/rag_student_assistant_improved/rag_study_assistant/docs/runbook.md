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

### Answer modes

`POST /ask` accepts:

```json
{
  "question": "What is acceptance testing?",
  "model": "qwen3:8b",
  "answer_mode": "hybrid",
  "conversation": [
    {"role": "user", "content": "previous question"},
    {"role": "assistant", "content": "previous answer"}
  ]
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
- Prompt path: Located at `prompts/rag_4t_prompt.md`

### Index Files
Generated after running `rag/ingest.py`:
- `index/chunks.json`: Stores processed text chunks and metadata

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
