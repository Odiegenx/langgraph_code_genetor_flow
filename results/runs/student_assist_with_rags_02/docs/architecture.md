# Local RAG Study Assistant - Architecture

## System Overview
A lightweight web application implementing a Retrieval-Augmented Generation (RAG) pipeline for local course materials, using a local Ollama LLM and 4T prompt engineering.

## Component Architecture

### 1. Frontend Layer (Presentation)
- **HTML Template** (`templates/index.html`): Single-page interface with question input, answer display, and source citations
- **Static Assets** (`static/`): Vanilla JavaScript for API calls and CSS for basic styling
- **Responsibilities**: User interaction, display formatting, API communication

### 2. Backend Layer (Application Logic)
- **Flask Application** (`app.py`): Web server with three endpoints:
  - `GET /`: Serve main interface
  - `POST /ingest`: Trigger document processing
  - `POST /query`: Handle RAG pipeline execution
- **Configuration** (`config.py`): Centralized settings for paths and model

### 3. RAG Pipeline Layer (Core Processing)

#### Document Ingestion Module (`rag/ingest.py`)
- **Input**: Files from `documents/` folder (.txt, .md, .pdf)
- **Processing**:
  1. Text extraction (pypdf for PDFs)
  2. Chunking by paragraph/sentence boundaries
  3. TF-IDF vectorization using scikit-learn
- **Output**: JSON index file and serialized vectorizer

#### Retrieval Module (`rag/retrieve.py`)
- **Algorithm**: TF-IDF similarity scoring
- **Operation**: Load index, compute query similarity, return top-3 chunks
- **Output**: Context chunks with source metadata

#### Prompt Engineering Module (`rag/prompt_builder.py`)
- **Template Source**: `prompts/rag_4t_prompt.md` (4T format)
- **Operation**: Template loading, context/question insertion
- **Output**: Formatted prompt for LLM

#### LLM Client Module (`rag/ollama_client.py`)
- **Connection**: HTTP POST to `http://localhost:11434/api/chat`
- **Configuration**: Model name from config (default: `qwen3:8b`)
- **Output**: Parsed LLM response

### 4. Data Layer
- **Source Documents** (`documents/`): User-provided course materials
- **Index Storage** (`index/`): Generated JSON and pickle files
- **Sample Data**: Pre-populated markdown file for demonstration

### 5. Documentation & Validation Layer
- **User Documentation**: README with setup/usage instructions
- **Technical Documentation**: Architecture, runbook, limitations
- **Validation Script**: Structural and import validation

## Data Flow

```
User Question → Frontend → Flask Backend → Retrieval Module
                                              ↓
                    Retrieved Context → Prompt Builder
                                              ↓
                    Formatted Prompt → Ollama Client
                                              ↓
                    LLM Answer → Backend → Frontend → User
```

### Detailed Pipeline:
1. **Document Preparation**: User places files in `documents/`, runs ingestion
2. **Index Creation**: TF-IDF vectors built and persisted
3. **Query Processing**:
   - Question received via `/query` endpoint
   - TF-IDF similarity computes top-3 relevant chunks
   - Context inserted into 4T prompt template
   - Prompt sent to local Ollama API
   - Response parsed and returned with source citations

## Key Design Decisions

### 1. Local-First Approach
- **Constraint**: No cloud LLM dependencies
- **Implementation**: Ollama HTTP API with configurable model
- **Fallback**: System shows retrieved context even if Ollama unavailable

### 2. Simple Retrieval Strategy
- **Choice**: TF-IDF over embeddings for simplicity
- **Advantage**: No vector database dependencies, easily explainable
- **Trade-off**: Less semantic understanding than embeddings

### 3. 4T Prompt Integration
- **Template Storage**: Separate markdown file for visibility
- **Runtime Usage**: Template loaded and formatted for each query
- **Auditability**: Prompt structure visible in project files

### 4. Minimal Infrastructure
- **No Database**: JSON files for index storage
- **No Authentication**: Single-user local application
- **No Framework**: Vanilla frontend for simplicity

## Technical Constraints

### Mandatory Constraints:
- ✅ Local Ollama only (no OpenAI/cloud APIs)
- ✅ 4T prompt from file in actual LLM call
- ✅ Retrieval must use local documents
- ✅ Web interface with source citations
- ✅ Simple, explainable retrieval (TF-IDF)

### Implementation Boundaries:
- ❌ No user accounts or authentication
- ❌ No advanced retrieval (embeddings, vector DB)
- ❌ No document management UI
- ❌ No streaming responses
- ❌ No production deployment tooling

## Dependencies

### Core Python Packages:
- `Flask>=2.3.0`: Web server
- `pypdf>=3.17.0`: PDF text extraction
- `scikit-learn>=1.3.0`: TF-IDF implementation
- `requests>=2.31.0`: Ollama API calls

### External Services:
- **Ollama**: Must be installed and running locally
- **Default Model**: `qwen3:8b` (configurable)

## Validation Criteria

The architecture supports all MVP requirements:
- ✅ Web interface with question input
- ✅ Local document ingestion (.txt, .md, .pdf)
- ✅ Retrieval of relevant chunks
- ✅ Local Ollama answer generation
- ✅ Source citations display
- ✅ 4T prompt engineering implementation
- ✅ Complete documentation
- ✅ Validation script

## Scalability Considerations

**Current Scale**: Suitable for ~50 documents, ~1000 chunks
**Limitations**: 
- TF-IDF memory usage grows with vocabulary size
- JSON index loading for each query
- No incremental indexing
- Single-threaded Flask dev server

**Extension Points**:
- Vectorizer could be replaced with sentence embeddings
- JSON index could move to SQLite
- Flask could use production WSGI server

This architecture prioritizes clarity, educational value, and local operation over scalability or production readiness, aligning with the exam project prototype goals.
