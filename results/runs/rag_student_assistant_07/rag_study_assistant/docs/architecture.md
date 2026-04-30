## Operational Constraints

### 1. **Local-Only Constraint**
- No external API calls beyond localhost Ollama
- All processing occurs on user machine
- Index files stored locally in JSON format

### 2. **Simplicity Priority**
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
