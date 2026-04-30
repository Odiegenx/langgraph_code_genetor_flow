# Local RAG Study Assistant Architecture

## System Overview
A local, browser-based study assistant that uses Retrieval-Augmented Generation (RAG) to answer questions about course materials using a local LLM (Ollama).

## Component Decomposition

### 1. Backend Server (`app.py`)
**Responsibilities:**
- Flask web server hosting REST API endpoints
- Request routing between frontend and RAG pipeline
- Error handling and graceful degradation
- Static file serving for frontend assets

**Endpoints:**
- `GET /` → Serve main interface
- `POST /api/ask` → Process question through RAG pipeline
- `POST /api/ingest` → Trigger document ingestion (optional UI trigger)

### 2. Document Ingestion Module (`rag/ingest.py`)
**Responsibilities:**
- File format detection and processing (.txt, .md, .pdf)
- Text extraction using pypdf for PDFs
- Chunking strategy: 500-character chunks with 50-character overlap
- Metadata preservation (filename, page numbers, chunk IDs)
- JSON index generation to `index/chunks.json`

**Data Flow:**
```
documents/ → format detection → text extraction → chunking → index/
```

### 3. Retrieval Module (`rag/retrieve.py`)
**Responsibilities:**
- Load and manage JSON index
- Implement BM25/TF-IDF keyword matching
- Top-k retrieval (default k=3)
- Relevance scoring and ranking
- Source snippet extraction with context windows

**Algorithm:**
- Simple term frequency-based scoring
- Case-insensitive matching
- Stop word filtering (basic English)

### 4. Prompt Builder (`rag/prompt_builder.py`)
**Responsibilities:**
- Load 4T prompt template from `prompts/rag_4t_prompt.md`
- Format prompt with retrieved context and user question
- Ensure proper section formatting (Traits, Task, Tone, Target)
- Context window management for LLM constraints

**Template Structure:**
```
Traits: [precise, source-grounded, honest, careful]
Task: [answer using retrieved context]
Tone: [clear, educational, concise]
Target: [student studying LLM for Developers]

Context: {retrieved_chunks}
Question: {user_question}
Answer:
```

### 5. Ollama Client (`rag/ollama_client.py`)
**Responsibilities:**
- HTTP communication with local Ollama instance (`http://localhost:11434/api/chat`)
- Model configuration (default: `qwen3:8b`)
- Response parsing and error handling
- Timeout and retry logic
- Fallback responses when Ollama unavailable

### 6. Frontend Interface (`templates/`, `static/`)
**Components:**
- `index.html`: Single-page application layout
- `app.js`: Vanilla JavaScript for API calls and DOM manipulation
- `styles.css`: Clean, responsive CSS with educational theme

**UI Elements:**
- Question input textarea with submit button
- Answer display area with syntax highlighting
- Source citations section with expandable snippets
- Status indicators (loading, success, error)
- Visual placeholders using CSS/emoji/SVG

### 7. Validation System (`validate_project.py`)
**Responsibilities:**
- Structural validation of project files
- 4T prompt template verification
- Python module import testing
- Web file structure validation
- Output generation to `site_validation_output.txt`

## Data Flow

```
User Question → Frontend → Backend API → Retrieval Module
                                              ↓
                                        Prompt Builder
                                              ↓
                                        Ollama Client
                                              ↓
                                        Answer + Citations → Frontend Display
```

**Ingestion Flow:**
```
Documents → Ingest Module → Chunks → JSON Index → Ready for Retrieval
```

## Constraints & Design Decisions

### Local-First Design
- No external API dependencies beyond local Ollama
- All processing occurs on local machine
- No internet requirement after setup

### Simplicity Over Complexity
- BM25 retrieval instead of vector embeddings
- JSON file storage instead of database
- Vanilla web technologies instead of frameworks
- Error messages instead of silent failures

### Educational Focus
- Clear source citations for verification
- Transparent process explanation in UI
- Student-friendly terminology and interface
- Emphasis on learning over production features

### Operational Boundaries
- Single-user, single-session operation
- Manual document management via file system
- No persistence beyond current session
- No concurrent user support

## Technical Stack

**Backend:**
- Python 3.9+
- Flask web framework
- pypdf for PDF processing
- requests for Ollama API calls

**Frontend:**
- Vanilla HTML5/CSS3/ES6 JavaScript
- Fetch API for backend communication
- CSS Grid/Flexbox for layout
- System fonts for zero dependencies

**Local Services:**
- Ollama with qwen3:8b model
- Local file system for document storage

## Error Handling Strategy
1. **Missing Ollama**: Graceful fallback with instructional message
2. **Empty Index**: Guide user to run ingestion
3. **Document Errors**: Skip problematic files with logging
4. **Network Issues**: Retry logic with exponential backoff
5. **Malformed Questions**: Input validation with helpful feedback

## Performance Considerations
- Index loading: Lazy load on first query
- Chunk size: Optimized for qwen3:8b context window
- Cache: Simple in-memory cache for recent queries
- Concurrency: Single-threaded for simplicity

## Security Model
- Local-only access (localhost binding)
- No authentication required
- File system permissions inherited from user
- No sensitive data storage or transmission

This architecture prioritizes educational value, local operation, and simplicity while meeting all core requirements for the exam project prototype.
