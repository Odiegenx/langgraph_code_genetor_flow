# Local RAG Study Assistant

A locally-hosted Retrieval-Augmented Generation (RAG) system designed for students studying "LLM for Developers" course material. This system operates entirely offline using Ollama for LLM inference and simple keyword-based retrieval.

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

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rag_study_assistant
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Ensure Ollama is running:
   ```bash
   ollama serve
   ```

4. Pull the default model (if not already present):
   ```bash
   ollama pull qwen3:8b
   ```

## Usage

1. Place your study materials (`.txt`, `.md`, `.pdf`) in the `documents/` folder.

2. Start the application:
   ```bash
   python app.py
   ```

3. Open your browser and navigate to `http://localhost:5000`

4. Ask questions about your course material and receive answers grounded in your documents.

## Configuration

Set environment variables to customize behavior:

- `OLLAMA_MODEL`: Specify the model name (default: `qwen3:8b`)
- `CHUNK_SIZE`: Size of text chunks during ingestion (default: 500)
- `CHUNK_OVERLAP`: Overlap between consecutive chunks (default: 50)
- `RETRIEVAL_K`: Number of top chunks to retrieve per query (default: 3)

Example:
```bash
export OLLAMA_MODEL=llama3:8b
python app.py
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
- [Runbook](docs/runbook.md)
- [Limitations](docs/limitations.md)

## License

This project is licensed under the MIT License.
