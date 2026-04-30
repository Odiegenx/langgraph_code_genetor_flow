# Local RAG Study Assistant

Build a focused exam project prototype: a Local RAG Study Assistant for students preparing for the "LLM for Developers" course exam.

## Core Requirements

- **Simple web interface**: Vanilla HTML/CSS/JavaScript frontend with Python backend (Flask/FastAPI)
- **Local document processing**: Support for `.txt`, `.md`, and `.pdf` files in a `documents/` folder
- **RAG pipeline**: Ingestion → Indexing → Retrieval → Answer generation
- **Local LLM**: Use Ollama with default model `qwen3:8b` via HTTP API
- **4T Prompt Engineering**: Implement Traits, Task, Tone, Target prompt template
- **Source citations**: Display retrieved source snippets with answers
- **Complete documentation**: Setup guide, architecture, runbook, limitations

## Technical Constraints

- Must work locally without cloud LLM APIs
- Simple keyword/BM25 retrieval acceptable
- Prioritize reliability and explainability over complexity
- No authentication, user accounts, or database infrastructure
- All assets must be generated as source code (no binary image/audio/video)

## Expected Structure

```
rag_study_assistant/
  app.py
  rag/
    ingest.py
    retrieve.py
    prompt_builder.py
    ollama_client.py
  prompts/
    rag_4t_prompt.md
  documents/
    sample_course_notes.md
  index/
    chunks.json
  static/
    app.js
    styles.css
  templates/
    index.html
  README.md
  docs/
    architecture.md
    runbook.md
    limitations.md
  validate_project.py
  requirements.txt
```

## User Flow

1. Place course notes in `documents/`
2. Run ingestion command
3. Start web app
4. Ask question via UI
5. View answer with source citations

## Validation Criteria

Validation script must check:
- Required source files exist
- `prompts/rag_4t_prompt.md` contains Traits, Task, Tone, Target sections
- Sample document exists
- Core Python modules import without syntax errors
- README and technical docs exist
- Web interface files exist with proper structure
