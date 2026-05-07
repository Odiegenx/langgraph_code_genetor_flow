# Local RAG Study Assistant

A locally-hosted Retrieval-Augmented Generation (RAG) system designed for students studying "LLM for Developers" course material. This system operates entirely offline using Ollama for LLM inference and simple keyword-based retrieval.

For the practical user guide, including where to add documents, how to ingest them, and how to troubleshoot Ollama issues, see:

```text
docs/user_guide.md
```

## Features

- **Local Operation**: Runs completely on your machine with no internet access required
- **Offline LLM Integration**: Communicates with a local Ollama instance
- **Document Ingestion**: Supports `.txt`, `.md`, and `.pdf` files
- **Keyword-Based Retrieval**: Uses BM25/TF-IDF for efficient chunk matching
- **Source Citations**: Answers always include references to original documents
- **Educational UI**: Clean, responsive interface optimized for study sessions

## Prerequisites

- Python 3.9+
- [Ollama](https://ollama.ai) installed and running locally
- `qwen3:8b` model (or another compatible model configured via environment variables)

## Installation

1. Open the project folder:
   ```powershell
   cd "C:\Users\pf\Desktop\Skole\LLM for Developers\LLM\mandetory1\Mandatory-1 real\exam_project\rag_student_assistant_improved\rag_study_assistant"
   ```

2. Install dependencies:
   ```powershell
   ..\..\..\.venv\Scripts\python.exe -m pip install -r requirements.txt
   ```

3. Ensure Ollama is running:
   ```powershell
   ollama serve
   ```

4. If you use the default cloud model, make sure Ollama is signed in:
   ```powershell
   ollama signin
   ```

## Usage

1. Place your study materials (`.txt`, `.md`, `.pdf`) in the `documents/` folder.

2. Ingest documents from the browser using `Re-ingest documents`, or run:
   ```powershell
   ..\..\..\.venv\Scripts\python.exe rag\ingest.py
   ```

3. Start the application:
   ```powershell
   ..\..\..\.venv\Scripts\python.exe app.py
   ```

4. Open your browser and navigate to `http://localhost:5000`

5. Ask questions about your course material and receive answers grounded in your documents.

## Configuration

Set environment variables to customize behavior:

- `OLLAMA_MODEL`: Specify the model name (default: `qwen3:8b`)
- `CHUNK_SIZE`: Size of text chunks during ingestion (default: 500)
- `CHUNK_OVERLAP`: Overlap between consecutive chunks (default: 50)
- `RETRIEVAL_K`: Number of top chunks to retrieve per query (default: 3)

Example:
```powershell
$env:OLLAMA_MODEL="qwen3:8b"
..\..\..\.venv\Scripts\python.exe app.py
```

## Project Structure

```
rag_study_assistant/
├── app.py                    # Main web application
├── rag/
│   ├── ingest.py            # Document processing
│   ├── retrieve.py          # Retrieval logic
│   ├── prompt_builder.py    # 4T prompt construction
│   └── ollama_client.py     # Ollama API client
├── prompts/
│   └── rag_4t_prompt.md     # 4T prompt template
├── documents/               # Your course notes go here
├── index/                   # Generated index files
├── static/                  # Frontend assets
├── templates/               # HTML templates
├── docs/                    # Documentation
├── README.md                # This file
├── requirements.txt         # Dependencies
└── validate_project.py      # Validation script
```

## Documentation

For detailed information about this project, see:

- [Architecture](docs/architecture.md)
- [User guide](docs/user_guide.md)
- [Runbook](docs/runbook.md)
- [Limitations](docs/limitations.md)
- [MVP fix log](docs/mvp_fix_log.md)

## Troubleshooting

### Ollama 401 Unauthorized

If the app finds sources but the answer says `401 Client Error: Unauthorized`, the selected Ollama cloud model requires login:

```powershell
ollama signin
```

Then restart the Flask app.

### Ollama timeout

If the app finds sources but the answer says `Read timed out`, RAG retrieval is working but the model did not answer before the timeout. Try again, restart Ollama, or use a faster model.

## License

This project is licensed under the MIT License.
