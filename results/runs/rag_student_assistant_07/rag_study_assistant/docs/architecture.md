# Local RAG Study Assistant - Architecture

## System Overview

The Local RAG Study Assistant is an offline-capable Retrieval-Augmented Generation system tailored for educational use. It enables students to ask questions about their course materials and receive AI-generated answers backed by source citations.

All components operate locally—no external APIs are used except for communicating with a local Ollama instance.

## Component Decomposition

### 1. Document Processing Layer (`rag/ingest.py`)

Responsible for converting raw documents into structured data suitable for retrieval.

**Functions**:
- Detects and parses `.txt`, `.md`, and `.pdf` files
- Normalizes extracted text
- Splits text into overlapping chunks (default: 500 tokens with 50-token overlap)
- Preserves metadata such as filename and page number
- Stores processed chunks in `index/chunks.json`

### 2. Retrieval Engine (`rag/retrieve.py`)

Performs keyword-based search across ingested documents.

**Functions**:
- Tokenizes and preprocesses user queries
- Implements BM25 scoring (falls back to TF-IDF if BM25 unavailable)
- Selects top-k most relevant chunks
- Extracts contextual snippets around matched keywords

### 3. Prompt Engineering Layer (`rag/prompt_builder.py`)

Constructs prompts following the 4T framework before sending them to the LLM.

**Functions**:
- Loads `prompts/rag_4t_prompt.md`
- Inserts retrieved context and user question into the template
- Ensures prompt stays within token limits

### 4. LLM Integration Layer (`rag/ollama_client.py`)

Handles communication with the local Ollama service.

**Functions**:
- Sends constructed prompts to `http://localhost:11434/api/chat`
- Parses responses from the model
- Handles connection errors gracefully

### 5. Web Application Layer (`app.py`)

Provides a RESTful API and serves the frontend interface.

**Endpoints**:
- `GET /` – Serve the main HTML page
- `POST /ask` – Accept user questions and return answers
- `POST /ingest` – Trigger reprocessing of documents
- `GET /status` – Check system health

### 6. Frontend Interface (`static/`, `templates/`)

Delivers a clean, single-page web interface for interacting with the system.

**Components**:
- Input area for entering questions
- Display area for answers and citations
- Status indicators for Ollama connectivity and indexing progress

## Data Flow

```
[Documents] → Ingestion → Index (chunks.json)
                             ↑
[User Query] → Retrieval → Prompt Builder → Ollama → Answer + Citations
```

## Operational Constraints

### Local-Only Operation

All computation happens on the user’s device. No cloud services or third-party APIs are contacted during normal operation.

### Simplicity First

Designed to be understandable and maintainable. Avoids complex algorithms like neural embeddings in favor of simpler keyword matching.

### Resource Management

Processes documents in fixed-size chunks to manage memory usage. Limits the number of retrieved results to prevent overwhelming the LLM.

### User Experience Guarantees

Always shows where each piece of information came from. Clearly indicates when the system cannot function due to missing dependencies (e.g., Ollama not running). Provides visual feedback during long operations.

## Integration Points

Each component communicates through well-defined interfaces:

- **Ingestion ↔ Index**: JSON serialization/deserialization
- **Retrieval ↔ Prompt Builder**: Ranked list of text chunks
- **Prompt Builder ↔ Ollama Client**: Well-formed prompt strings
- **Ollama Client ↔ Web App**: Structured JSON responses
- **Web App ↔ Frontend**: RESTful HTTP endpoints

## Failure Modes & Mitigations

| Failure Mode | Detection | Mitigation |
|--------------|-----------|------------|
| Ollama Not Running | Connection refused at startup | Show clear error message in UI |
| Empty Documents Folder | No files found during ingestion | Provide sample document and instructions |
| Unsupported File Type | Parser raises exception | Skip file and log warning |
| Large Document Hang | Long processing time observed | Show progress indicator |

## Configuration Management

Configuration options can be adjusted via environment variables:

- `OLLAMA_MODEL`: Sets which model to use (default: `qwen3:8b`)
- `CHUNK_SIZE`: Controls how much text is included per chunk
- `CHUNK_OVERLAP`: Prevents splitting important phrases across chunks
- `RETRIEVAL_K`: Adjusts how many chunks influence the final answer

Defaults are chosen to balance accuracy, speed, and resource consumption.

## Development Constraints

To ensure ease of setup and transparency:

- All code must be open-source and inspectable
- No compiled binaries or proprietary assets allowed
- Visual elements should rely on CSS, SVG, or emoji rather than image files
- Documentation must accompany every major feature

This architecture ensures the system remains lightweight, secure, and fully controllable by the end-user.
