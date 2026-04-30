# Runbook: Local RAG Study Assistant

## Prerequisites

- **Python 3.9+** installed and available on PATH
- **Ollama** installed locally with `qwen3:8b` model pulled:
  ```bash
  ollama pull qwen3:8b
  ```
- All dependencies installed via pip:
  ```bash
  pip install -r requirements.txt
  ```

## Quick Start

1. Place your study documents (TXT, MD, PDF) into the `documents/` folder.
2. Run ingestion script to process documents and build index:
   ```bash
   python rag/ingest.py
   ```
3. Start the web server:
   ```bash
   python app.py
   ```
4. Open browser at [http://localhost:5000](http://localhost:5000)

## Ingestion Workflow

1. The `ingest.py` script reads all supported files from `documents/`
2. Extracts text using `pypdf` for PDFs
3. Splits content into overlapping chunks
4. Stores processed chunks as JSON in `index/chunks.json`

## Validation Commands

Run project structure and dependency checks:
```bash
python validate_project.py
```
Output written to: `site_validation_output.txt`

Check if Ollama service is running:
```bash
ollama list
```

## Endpoints & Configuration

### Backend Routes

| Method | Route        | Description                  |
|--------|--------------|------------------------------|
| GET    | `/`          | Serve main UI page           |
| POST   | `/ask`       | Submit question for RAG flow |

### Configurable Settings

Model can be changed via environment variable:
```bash
export OLLAMA_MODEL=llama3:instruct
```

Default port can be overridden when starting Flask/FastAPI app.

## Local-Only Assumptions

- No network access required beyond localhost
- No user authentication or session management
- All data stored locally in filesystem (`index/`, `documents/`)
- No external databases or cloud integrations
- No telemetry or remote logging enabled

This runbook assumes full control over execution environment within a single machine.
