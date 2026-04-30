# Generation Contract: Local RAG Study Assistant

## Technical Specifications

### Backend (Python)
- **Framework**: Flask or FastAPI
- **PDF Processing**: pypdf for text extraction
- **Retrieval**: Simple keyword/BM25 implementation
- **LLM Client**: HTTP requests to `http://localhost:11434/api/chat`
- **Default Model**: `qwen3:8b` (configurable)
- **Index Storage**: JSON files in `index/` directory
- **Error Handling**: Graceful handling of missing Ollama

### Frontend (Vanilla Web)
- **No Frameworks**: Pure HTML/CSS/JavaScript
- **UI Components**:
  - Question input textarea
  - Submit button
  - Answer display area
  - Source citations section
  - Status indicators
- **Styling**: Clean, readable CSS with educational tone
- **Interactivity**: Fetch API for backend communication
- **Placeholders**: CSS/emoji/SVG for visual elements

### 4T Prompt Template
File: `prompts/rag_4t_prompt.md`
Must contain explicit sections:
- **Traits**: precise, source-grounded, honest, careful
- **Task**: answer using retrieved local course material
- **Tone**: clear, educational, concise
- **Target**: student studying LLM for Developers

### Document Processing
- Support formats: `.txt`, `.md`, `.pdf`
- Text extraction from PDFs using pypdf
- Chunking strategy: fixed-size with overlap
- Metadata preservation: filename, page numbers

### Dependencies
```txt
# Python requirements.txt
flask>=2.3.0
pypdf>=3.0.0
requests>=2.31.0
# Optional: fastapi, uvicorn if FastAPI chosen
```

### File Structure Requirements
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
├── documents/
│   └── sample_course_notes.md # Example content
├── index/
│   └── chunks.json          # Generated index
├── static/
│   ├── app.js               # Frontend logic
│   └── styles.css           # Styling
├── templates/
│   └── index.html           # Main page
├── README.md                # Setup guide
├── docs/
│   ├── architecture.md      # System design
│   ├── runbook.md           # Operation guide
│   └── limitations.md       # Known limits
├── validate_project.py      # Validation script
└── requirements.txt         # Dependencies
```

### Implementation Constraints
1. **Local-Only**: No external LLM APIs required
2. **Simple Retrieval**: BM25 or TF-IDF acceptable
3. **Error Resilience**: Handle missing Ollama gracefully
4. **Clear Citations**: Show source snippets with answers
5. **Configurable Model**: Environment/config file for model selection
6. **No Binary Assets**: All visuals via CSS/SVG/emoji
7. **Complete Docs**: All documentation files must be populated

### Validation Requirements
- `validate_project.py` must run without external services
- Check file existence and structure
- Verify 4T prompt contains required sections
- Test Python module imports
- Validate web file structure
- Output results to `site_validation_output.txt`
