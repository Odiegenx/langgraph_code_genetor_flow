# Local RAG Study Assistant Architecture

## System Overview
A locally-running Retrieval-Augmented Generation system for course exam preparation that processes local documents and generates answers using a local LLM (Ollama).

## Component Decomposition

### 1. Backend Server (`app.py`)
**Responsibilities:**
- Flask web server with REST API endpoints
- Route handling for web interface
- Orchestrates RAG pipeline flow
- Error handling and response formatting

**Endpoints:**
- `GET /` - Serve frontend interface
- `POST /ask` - Process user questions through RAG pipeline
- `GET /health` - System status check

### 2. RAG Pipeline Modules (`rag/`)

#### 2.1 Document Ingestor (`rag/ingest.py`)
**Responsibilities:**
- Monitor `documents/` folder for new files
- Process `.txt`, `.md`, and `.pdf` formats
- Extract text content using `pypdf` for PDFs
- Chunk documents into manageable segments (500-1000 chars)
- Create and maintain local JSON index (`index/chunks.json`)

**Data Structure:**
```json
{
  "chunks": [
    {
      "id": "doc1_chunk0",
      "text": "extracted text content",
      "source_file": "sample_course_notes.md",
      "chunk_index": 0,
      "metadata": {}
    }
  ]
}
```

#### 2.2 Retriever (`rag/retrieve.py`)
**Responsibilities:**
- Load and query the chunk index
- Implement keyword-based retrieval (TF-IDF/BM25)
- Optionally support local embeddings via `sentence-transformers`
- Return top-k relevant chunks with source metadata
- Score and rank relevance

#### 2.3 Prompt Builder (`rag/prompt_builder.py`)
**Responsibilities:**
- Load 4T prompt template from `prompts/rag_4t_prompt.md`
- Format prompt with:
  - **Traits**: System role definition
  - **Task**: Specific question + retrieved context
  - **Tone**: Response style guidelines
  - **Target**: Expected output format
- Inject retrieved context and user question
- Format citations for display

#### 2.4 Ollama Client (`rag/ollama_client.py`)
**Responsibilities:**
- HTTP client to `localhost:11434/api/chat`
- Model configuration management (`.env`)
- Request/response handling with timeout
- Error handling for offline Ollama
- Response parsing and citation extraction

### 3. Frontend Interface (`templates/`, `static/`)
**Responsibilities:**
- Minimal HTML interface (`index.html`)
- Question input and answer display
- Citation visualization
- Loading states and error messages
- Responsive design for various screen sizes

**Components:**
- Question input form
- Answer display area
- Source citation panel
- Status indicators

### 4. Configuration & Documentation

#### Configuration (`.env.example`)
```
OLLAMA_MODEL=qwen3:8b
CHUNK_SIZE=500
TOP_K_RESULTS=3
PORT=5000
```

#### Documentation (`docs/`)
- `architecture.md`: System design and flow
- `runbook.md`: Setup and operational guide
- `limitations.md`: Known constraints and boundaries

## Data Flow

```
User Question → Web Interface → Flask Backend
                                      ↓
                                Retrieve Relevant Chunks
                                      ↓
                                Build 4T Prompt with Context
                                      ↓
                                Query Local Ollama LLM
                                      ↓
                                Format Response with Citations
                                      ↓
                                Display Answer + Sources
```

## Detailed Pipeline Flow

1. **Document Ingestion** (Manual/Startup):
   ```
   documents/ → File Detection → Text Extraction → Chunking → JSON Index
   ```

2. **Query Processing** (Real-time):
   ```
   User Question → Retrieve Top-k Chunks → Build 4T Prompt → 
   LLM Generation → Format Response → Display with Citations
   ```

## Constraints & Design Decisions

### Technical Constraints:
1. **Local-Only**: No external API calls except local Ollama
2. **Simple Storage**: JSON files instead of databases
3. **Minimal Dependencies**: Avoid heavy ML/vector libraries
4. **Vanilla Frontend**: No frameworks to reduce complexity
5. **Configurable Model**: `.env` file for model selection

### Retrieval Strategy Options:
1. **Primary**: Keyword-based (TF-IDF/BM25) - Simple, no embeddings
2. **Optional**: Local embeddings via `sentence-transformers` - Better accuracy

### Error Handling:
- Graceful degradation when Ollama unavailable
- Clear user messages for missing documents
- Validation of file formats during ingestion

## File Structure Validation
The validation script (`validate_project.py`) checks:
- All required files exist and are non-empty
- Core modules can be imported without errors
- 4T prompt contains required sections
- Configuration templates are present
- Sample document exists for testing

## Performance Considerations
- **Index Size**: JSON index suitable for course-scale documents
- **Chunking**: Fixed-size chunks for simplicity
- **Retrieval**: In-memory search for speed
- **Caching**: Consider caching frequent queries

## Security & Privacy
- **Local Processing**: All data stays on user's machine
- **No External Calls**: Complete privacy for study materials
- **Environment Variables**: Sensitive configuration externalized

## Extension Points
1. **Retrieval**: Swap keyword search for embeddings
2. **Storage**: Replace JSON with SQLite for larger collections
3. **UI**: Add advanced filtering and search
4. **Batch Processing**: Support bulk question answering

This architecture balances simplicity with functionality, providing a working RAG prototype that runs entirely locally while maintaining extensibility for future improvements.
