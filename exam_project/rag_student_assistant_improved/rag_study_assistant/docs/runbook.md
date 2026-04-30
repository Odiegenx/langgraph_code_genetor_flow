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
   ```bash
   pip install -r requirements.txt
   ```
3. Ensure Ollama is running on `http://localhost:11434`
4. Run the ingestion process to index documents:
   ```bash
   python rag/ingest.py
   ```
5. Start the web application:
   ```bash
   python app.py
   ```
6. Open browser at `http://localhost:5000`

## Validation Commands

Run structural and syntax validation:
```bash
python validate_project.py
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

### Configurable Settings
- Default LLM model: Editable in `rag/ollama_client.py` or config/environment variable
- Chunk size and overlap: Defined in `rag/ingest.py`
- Prompt path: Located at `prompts/rag_4t_prompt.md`

### Index Files
Generated after running `rag/ingest.py`:
- `index/chunks.json`: Stores processed text chunks and metadata

## Local-Only Security Assumptions

- No network exposure beyond localhost
- No user authentication or session tracking
- No data persistence beyond local filesystem
- No external service integrations
- All processing occurs within trusted environment

⚠️ Do not expose this application publicly without adding authentication and access control layers.
