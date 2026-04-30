# Local RAG Study Assistant - Architecture

## System Overview
A local, web-based Retrieval-Augmented Generation system for studying course materials. The architecture prioritizes simplicity, local execution, and educational transparency over production-scale complexity.

## Component Decomposition

### 1. **Frontend Layer** (Static Web Interface)
- **index.html**: Single-page application with clean, responsive layout
- **app.js**: Vanilla JavaScript handling user interactions, API calls, and DOM updates
- **styles.css**: Minimal CSS for readability and basic UI components

**Responsibilities**:
- Provide question input field and submit button
- Display generated answers with clear formatting
- Show source citations with filename references
- Handle loading states and error messages
- Maintain session-less simplicity (no chat history)

### 2. **API Gateway** (Flask Application)
- **app.py**: Main Flask server with RESTful endpoints

**Endpoints**:
- `GET /`: Serve the main HTML interface
- `POST /ingest`: Trigger document processing and indexing
- `POST /ask`: Process questions through RAG pipeline
- `GET /health`: System status check

**Responsibilities**:
- Route HTTP requests to appropriate handlers
- Validate input parameters
- Coordinate RAG pipeline components
- Return structured JSON responses
- Handle CORS for local development

### 3. **Document Processing Pipeline**
- **ingest.py**: Document ingestion and chunking module

**Responsibilities**:
- Monitor `documents/` folder for supported file types (.txt, .md, .pdf)
- Parse PDFs using pypdf library
- Split documents into semantic chunks (paragraph-based or fixed-size)
- Extract metadata (filename, chunk index, character positions)
- Store processed chunks in JSON index format in `index/` directory

### 4. **Retrieval Engine**
- **retrieve.py**: Context retrieval implementation

**Responsibilities**:
- Load and maintain searchable index from JSON files
- Implement simple keyword matching or TF-IDF retrieval
- Score and rank chunks by relevance to query
- Return top-k relevant chunks with source metadata
- Handle "no relevant results" case gracefully

### 5. **Prompt Engineering Layer**
- **prompt_builder.py**: 4T prompt construction
- **rag_4t_prompt.md**: Template file with visible 4T structure

**Responsibilities**:
- Load and parse 4T prompt template from file
- Inject retrieved context chunks into prompt
- Format user question according to template
- Ensure prompt follows Traits, Task, Tone, Target structure
- Maintain prompt versioning and template management

### 6. **LLM Integration Layer**
- **ollama_client.py**: Ollama API client

**Responsibilities**:
- Manage HTTP connections to local Ollama instance
- Send formatted prompts to `http://localhost:11434/api/chat`
- Handle model configuration (default: `qwen3:8b`)
- Parse and validate LLM responses
- Implement timeout and error handling for offline scenarios

### 7. **Data Storage**
- **documents/**: User-provided course materials
- **index/**: Generated JSON index files
- **prompts/**: Template storage

### 8. **Validation System**
- **validate_project.py**: Structural and functional validation

**Responsibilities**:
- Verify project file structure completeness
- Check 4T prompt template for required sections
- Test module imports and basic functionality
- Generate validation report

## Data Flow

1. **Setup Phase**:
   ```
   User places documents → Run ingestion script → Generate JSON index
   ```

2. **Query Phase**:
   ```
   User question → Flask endpoint → Retrieve relevant chunks → 
   Build 4T prompt → Call Ollama API → Format response → 
   Display answer + citations
   ```

## Key Architectural Decisions

### 1. **Simplicity Over Complexity**
- Avoid vector embeddings to reduce dependencies
- Use JSON files instead of databases for index storage
- Implement basic keyword retrieval instead of semantic search
- No authentication or multi-user support

### 2. **Local-First Design**
- All processing occurs on local machine
- No external API keys or cloud dependencies
- Ollama as only external service (local HTTP)
- Offline-capable document processing

### 3. **Transparency and Education**
- Visible 4T prompt structure in template file
- Source citations displayed alongside answers
- Clear error messages for debugging
- Well-documented code for exam review

### 4. **Error Resilience**
- Graceful degradation when Ollama is unavailable
- Clear messages for missing documents or empty retrieval
- Validation script catches structural issues early
- No silent failures in API responses

## Constraints and Trade-offs

### Accepted Limitations:
- **Scale**: Limited to ~50 documents for performance
- **Retrieval**: Basic keyword matching, not semantic understanding
- **Persistence**: No chat history or user sessions
- **File Types**: Only text-based formats (no images, audio, video)

### Design Justifications:
- **JSON over database**: Simpler for exam context, easier to debug
- **Flask over FastAPI**: Lower learning curve, sufficient for MVP
- **Vanilla JS over frameworks**: No build step, direct browser execution
- **Local-only**: Privacy focus, no network dependencies

## Deployment Architecture

```
Local Machine
├── Python 3.9+ Environment
│   ├── Flask Server (port 5000)
│   └── RAG Pipeline Modules
├── Ollama Service (port 11434)
│   └── qwen3:8b Model
├── Web Browser
│   └── Static Frontend
└── File System
    ├── documents/ (user-provided)
    ├── index/ (generated)
    └── project files
```

## Failure Modes and Recovery

1. **Ollama Not Running**: Clear error message with setup instructions
2. **No Documents**: Guidance to add files to `documents/` folder
3. **Empty Retrieval**: "Insufficient information" response
4. **Corrupt Index**: Re-run ingestion to regenerate
5. **Port Conflicts**: Configurable port options in Flask app

This architecture meets all core requirements while maintaining the simplicity, local operation, and educational transparency needed for an exam-ready prototype.
