# Local RAG Study Assistant Architecture

## System Overview
A locally-hosted Retrieval-Augmented Generation system designed for students studying "LLM for Developers" course material. The system operates entirely offline using Ollama for LLM inference and simple keyword-based retrieval.

## Component Decomposition

### 1. **Document Processing Layer** (`rag/ingest.py`)
**Responsibilities:**
- File format detection and parsing (TXT, MD, PDF via pypdf)
- Text extraction and normalization
- Chunking with fixed-size windows and overlap
- Metadata preservation (filename, page numbers, chunk IDs)
- JSON index generation and storage

**Data Flow:**
```
documents/*.{txt,md,pdf} → Text Extraction → Chunking (500 tokens, 50 overlap) → chunks.json
```

### 2. **Retrieval Engine** (`rag/retrieve.py`)
**Responsibilities:**
- BM25/TF-IDF implementation for keyword matching
- Query processing and relevance scoring
- Top-k chunk selection (default k=3)
- Source snippet extraction with context windows
- Fallback to simple keyword matching if BM25 unavailable

**Algorithm:**
```
User Query → Tokenization → BM25 Scoring → Top 3 Chunks → Context Snippets
```

### 3. **Prompt Engineering Layer** (`rag/prompt_builder.py`)
**Responsibilities:**
- 4T template loading from `prompts/rag_4t_prompt.md`
- Dynamic prompt construction with retrieved context
- Formatting with explicit Traits, Task, Tone, Target sections
- Context window management for LLM constraints

**Template Structure:**
```
Traits: [LLM personality characteristics]
Task: [Answer generation instructions]
Tone: [Response style guidelines]
Target: [Audience specification]
Context: [Retrieved chunks]
Question: [User query]
```

### 4. **LLM Integration Layer** (`rag/ollama_client.py`)
**Responsibilities:**
- HTTP API communication with Ollama (`localhost:11434`)
- Model configuration management (`qwen3:8b` default)
- Response parsing and error handling
- Graceful degradation when Ollama unavailable
- Streaming support for future enhancement

**API Flow:**
```
Prompt → POST /api/chat → Ollama → Response → Answer + Confidence
```

### 5. **Web Application Layer** (`app.py`)
**Responsibilities:**
- Flask server with REST endpoints
- Static file serving for frontend
- API routing (`/ask`, `/ingest`, `/status`)
- Session management (stateless)
- Error handling and logging

**Endpoints:**
- `GET /` → Serve frontend
- `POST /ask` → Process question → Return answer + citations
- `POST /ingest` → Trigger document processing
- `GET /status` → System health check

### 6. **Frontend Interface** (`static/`, `templates/`)
**Responsibilities:**
- Single-page application with clean design
- Question input with validation
- Answer display with source citations
- Status indicators and loading states
- Responsive CSS for mobile/desktop

**UI Components:**
- Header with system title
- Question input textarea
- Submit button with loading state
- Answer display area with citations
- Source snippets with highlighting
- Status panel (Ollama connection, index status)

## Data Flow Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Documents/    │    │    Web UI       │    │    Ollama       │
│   (txt/md/pdf)  │    │  (HTML/JS/CSS) │    │  (localhost)    │
└────────┬────────┘    └────────┬────────┘    └────────┬────────┘
         │                      │                      │
         ▼                      │                      │
┌─────────────────┐             │                      │
│   Ingestion     │             │                      │
│   (chunking)    │             │                      │
└────────┬────────┘             │                      │
         │                      │                      │
         ▼                      │                      │
┌─────────────────┐             │                      │
│   Index/        │             │                      │
│   (chunks.json) │             │                      │
└────────┬────────┘             │                      │
         │                      │                      │
         │              ┌────────▼────────┐            │
         │              │   Flask App     │───────────┘
         │              │   (Python)      │
         │              └────────┬────────┘
         │                      │
         │              ┌────────▼────────┐
         │              │   Retrieval      │
         │              │   (BM25)         │
         │              └────────┬────────┘
         │                      │
         │              ┌────────▼────────┐
         │              │   Prompt        │
         │              │   Builder       │
         │              └────────┬────────┘
         │                      │
         └──────────────────────┘
```

## Operational Constraints

### 1. **Local-Only Constraint**
- No external API calls beyond localhost Ollama
- All processing occurs on user machine
- Index files stored locally in JSON format

### - **Simplicity Priority**
- BM25 retrieval instead of vector embeddings
- JSON file storage instead of databases
- Vanilla web technologies instead of frameworks
- Clear error messages over complex recovery

### 3. **Resource Management**
- Fixed chunk sizes to manage memory
- Configurable retrieval depth (k=3)
- Model selection via environment variable
- Graceful handling of large documents

### 4. **User Experience Guarantees**
- Always display source citations
- Clear indication when Ollama unavailable
- Progress indicators during processing
- Responsive design for study sessions

## Integration Points

### 1. **Document → Index**
- Automatic format detection
- Chunk ID generation for traceability
- Metadata preservation for citations

### 2. **Query → Answer**
- Question preprocessing (lowercase, stopwords)
- Retrieval with confidence scores
- Prompt construction with context
- LLM response with citation mapping

### 3. **UI → Backend**
- RESTful API with JSON payloads
- Error response standardization
- CORS configuration for local development
- WebSocket readiness for streaming

## Failure Modes & Mitigations

### 1. **Ollama Unavailable**
- Clear UI message with setup instructions
- Fallback to keyword matching only
- Citation display without LLM answer

### 2. **Empty Document Folder**
- Sample document provided
- Clear ingestion instructions
- Status indicator showing empty state

### 3. **Unsupported File Format**
- Skip unsupported files with warning
- Continue processing supported formats
- Log format errors for user review

### 4. **Large Document Processing**
- Progress indicators during ingestion
- Configurable chunk sizes
- Memory usage warnings

## Configuration Management

### 1. **Environment Variables**
- `OLLAMA_MODEL`: Default `qwen3:8b`
- `CHUNK_SIZE`: Default 500 tokens
- `CHUNK_OVERLAP`: Default 50 tokens
- `RETRIEVAL_K`: Default 3 chunks

### 2. **File-Based Configuration**
- Index location: `index/chunks.json`
- Document location: `documents/`
- Prompt template: `prompts/rag_4t_prompt.md`

## Development Constraints

### 1. **No External Dependencies**
- All code must be source-available
- No binary assets in repository
- SVG/CSS/emoji for visual elements

### 2. **Documentation Requirements**
- Complete setup guide in README
- Architecture documentation
- Operational runbook
- Limitations disclosure

### 3. **Validation Enforcement**
- Structure validation script
- 4T prompt template verification
- Import error checking
- File existence validation

This architecture prioritizes simplicity, explainability, and local operation while providing a complete RAG study assistant experience for exam preparation.
