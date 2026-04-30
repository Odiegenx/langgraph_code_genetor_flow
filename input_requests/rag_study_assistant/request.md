# Local RAG Study Assistant

Build a focused exam project prototype: a Local RAG Study Assistant for students preparing for the "LLM for Developers" course exam.

## Problem

Students often have many lecture notes, PDF files, assignment documents, and project notes. It can be difficult to quickly find the relevant course material and turn it into a clear answer while studying.

## Target User

The target user is a student preparing for an exam or project work in the LLM for Developers course.

## Value

The application should help the student ask questions about their own local course material and receive answers grounded in retrieved source material instead of only the model's general knowledge.

## Core MVP

Create a small working prototype with:

- a simple web interface
- a local document folder for source material
- an ingestion/indexing step for local documents
- support for `.txt`, `.md`, and `.pdf` files
- retrieval of relevant text chunks from the indexed documents
- local Ollama LLM answer generation
- visible source snippets or citations used for the answer
- a clear setup guide
- technical documentation

The MVP should be small, reliable, and demonstrable. Do not build a large platform.

## Local LLM Requirement

The delivered application must use a local Ollama model for core answer generation.

Default model:

- `qwen3:8b` for text answer generation

The model name should be configurable in an environment/config file, but the default setup should be local.

Do not require OpenAI API keys or cloud LLMs for the delivered solution.

## RAG Requirement

RAG must be part of the actual answer flow.

The flow should be:

1. User asks a question in the UI.
2. The backend retrieves relevant chunks from the local indexed course material.
3. The retrieved chunks are inserted into a 4T-based prompt.
4. The local Ollama model generates an answer based on the retrieved context.
5. The UI shows the answer and the source snippets/files used.

The answer must clearly be based on retrieved material. If the retrieved context is insufficient, the model should say that the available material does not contain enough information.

## 4T Prompt Engineering Requirement

The project must visibly use the 4T prompt engineering approach:

- Traits
- Task
- Tone
- Target

Include the prompt template as a project file, for example:

```text
prompts/rag_4t_prompt.md
```

The prompt should make the model act as:

- Traits: precise, source-grounded, honest, careful
- Task: answer the user's question using retrieved local course material
- Tone: clear, educational, concise
- Target: a student studying LLM for Developers

The 4T prompt design must be used in the actual LLM call, not only mentioned in documentation.

## Suggested Technical Shape

Prefer a simple Python backend and a lightweight web UI.

Suggested stack:

- Python
- Flask or FastAPI
- vanilla HTML/CSS/JavaScript frontend
- Ollama HTTP API at `http://localhost:11434/api/chat`
- `pypdf` for PDF text extraction
- local JSON index files for chunks and retrieval metadata

Retrieval can be implemented with one of these approaches:

- simple keyword/BM25-style retrieval
- local embeddings if easy and reliable

Prioritize reliability and explainability over complexity. A simple local retrieval approach is acceptable if it clearly retrieves relevant chunks and passes them into the LLM prompt.

## Project Structure

The generated project should be placed in:

```text
rag_study_assistant/
```

Expected files may include:

```text
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

The exact structure can differ if the implementation is clean and easy to run.

## User Flow

The application should support this flow:

1. User places course notes or PDFs in `documents/`.
2. User runs an ingest/index command.
3. User starts the web app.
4. User asks a question.
5. App retrieves relevant source chunks.
6. App sends retrieved context + question to the local Ollama model using the 4T prompt.
7. User sees an answer plus source snippets or filenames.

## Validation

Include a validation script that checks the MVP is structurally complete.

The validation should check:

- required source files exist
- `prompts/rag_4t_prompt.md` exists and contains Traits, Task, Tone, and Target
- sample document exists
- ingest script exists
- retrieval script exists
- Ollama client exists
- README/setup guide exists
- technical docs exist
- application can import core modules without syntax errors

The validation does not need to call the LLM, because local model availability can vary.

## Documentation Requirements

Include a clear `README.md` with:

- project purpose
- problem statement
- MVP scope
- prerequisites
- local Ollama setup
- how to add documents
- how to ingest documents
- how to start the app
- how to ask questions
- how RAG works
- how the 4T prompt is used
- known limitations

Include technical docs describing:

- architecture
- local LLM path
- RAG pipeline
- 4T prompt strategy
- data flow from user question to retrieved context to answer

## Important Constraints

- Keep the project small and exam-ready.
- Do not require cloud LLMs or API keys.
- Do not overbuild authentication, user accounts, deployment, or database infrastructure.
- The delivered project must work locally.
- The RAG implementation must be understandable and easy to explain.
- The 4T prompt template must be visible and used in code.
