# Local RAG Study Assistant - Ticket Backlog

## Ticket A1: Project Foundation & Setup
**Description:** Initialize project structure and core dependencies
**Scope Boundaries:**
- ✅ Create project directory structure with all required folders
- ✅ Generate `requirements.txt` with Flask, pypdf, requests
- ✅ Create basic `validate_project.py` that checks file existence
- ❌ No implementation of actual RAG components
- ❌ No frontend files beyond structure

**Acceptance Criteria:**
1. All directories exist: `rag/`, `prompts/`, `documents/`, `index/`, `static/`, `templates/`, `docs/`
2. `requirements.txt` contains Flask≥2.3.0, pypdf≥3.0.0, requests≥2.31.0
3. `validate_project.py` runs without external dependencies
4. Validation script outputs to `site_validation_output.txt`
5. Project can be installed with `pip install -r requirements.txt`

**Definition of Done:**
- [ ] All directories created
- [ ] `requirements.txt` populated with correct versions
- [ ] `validate_project.py` validates basic structure
- [ ] Validation output file created
- [ ] No syntax errors in validation script

**Dependencies:** None

---

## Ticket A2: Document Ingestion Module
**Description:** Implement document processing and chunking system
**Scope Boundaries:**
- ✅ Process TXT, MD, PDF files from `documents/` directory
- ✅ Extract text from PDFs using pypdf
- ✅ Implement fixed-size chunking (500 tokens, 50 overlap)
- ✅ Generate JSON index with metadata (filename, page, chunk_id)
- ❌ No advanced text cleaning or semantic chunking
- ❌ No support for images or binary files

**Acceptance Criteria:**
1. `rag/ingest.py` processes sample_course_notes.md successfully
2. Chunks are created with correct size and overlap
3. JSON index includes filename, page numbers, chunk IDs
4. Handles unsupported file formats gracefully
5. Preserves source information for citations

**Definition of Done:**
- [ ] `rag/ingest.py` module complete
- [ ] Sample document processed to `chunks.json`
- [ ] Chunk metadata includes citation information
- [ ] Error handling for unsupported formats
- [ ] Unit tests for chunking logic

**Dependencies:** Ticket A1 (project structure)

---

## Ticket A3: Retrieval Engine
**Description:** Implement keyword-based retrieval with BM25/TF-IDF
**Scope Boundaries:**
- ✅ BM25 or TF-IDF implementation for keyword matching
- ✅ Query processing (tokenization, stopword removal)
- ✅ Top-k chunk selection (default k=3)
- ✅ Source snippet extraction with context windows
- ✅ Fallback to simple keyword matching if BM25 unavailable
- ❌ No vector embeddings or semantic search
- ❌ No advanced query expansion

**Acceptance Criteria:**
1. `rag/retrieve.py` returns relevant chunks for test queries
2. Scores chunks by relevance using BM25/TF-IDF
3. Returns top 3 chunks by default
4. Extracts context snippets around matched keywords
5. Graceful degradation to simple keyword matching

**Definition of Done:**
- [ ] `rag/retrieve.py` module complete
- [ ] Retrieval returns scored chunks
- [ ] Context snippets include surrounding text
- [ ] Configurable k parameter
- [ ] Test queries return expected results

**Dependencies:** Ticket A2 (document ingestion)

---

## Ticket A4: 4T Prompt Template & Builder
**Description:** Create 4T prompt template and dynamic prompt construction
**Scope Boundaries:**
- ✅ Create `prompts/rag_4t_prompt.md` with 4T structure
- ✅ Implement `rag/prompt_builder.py` for dynamic prompt construction
- ✅ Format prompts with Traits, Task, Tone, Target sections
- ✅ Insert retrieved context and user question
- ❌ No advanced prompt optimization or few-shot examples
- ❌ No dynamic template selection

**Acceptance Criteria:**
1. `rag_4t_prompt.md` contains explicit Traits, Task, Tone, Target sections
2. Prompt builder loads template and inserts context/question
3. Generated prompts follow 4T structure
4. Context is properly formatted within prompt
5. Prompt length respects LLM constraints

**Definition of Done:**
- [ ] `rag_4t_prompt.md` complete with 4T sections
- [ ] `rag/prompt_builder.py` module complete
- [ ] Prompts include all required sections
- [ ] Context integration works correctly
- [ ] Template validation passes

**Dependencies:** Ticket A3 (retrieval engine)

---

## Ticket A5: Ollama Client Integration
**Description:** Implement LLM client for local Ollama instance
**Scope Boundaries:**
- ✅ HTTP API communication with `localhost:11434/api/chat`
- ✅ Model configuration (`qwen3:8b` default, configurable)
- ✅ Response parsing and error handling
- ✅ Graceful degradation when Ollama unavailable
- ❌ No streaming response support
- ❌ No model fine-tuning or advanced parameters

**Acceptance Criteria:**
1. `rag/ollama_client.py` sends requests to Ollama API
2. Handles connection errors gracefully
3. Parses responses into answer + confidence format
4. Configurable model via environment variable
5. Returns clear error when Ollama not running

**Definition of Done:**
- [ ] `rag/ollama_client.py` module complete
- [ ] Successful communication with Ollama
- [ ] Error handling for missing Ollama
- [ ] Model configuration via environment
- [ ] Response parsing works correctly

**Dependencies:** Ticket A4 (prompt builder)

---

## Ticket A6: Flask Web Application
**Description:** Build main Flask application with REST endpoints
**Scope Boundaries:**
- ✅ Flask server with routes: `/`, `/ask`, `/ingest`, `/status`
- ✅ Integration of all RAG components
- ✅ JSON API responses with error handling
- ✅ Static file serving for frontend
- ❌ No authentication or user management
- ❌ No database persistence

**Acceptance Criteria:**
1. `app.py` starts Flask server on localhost
2. `/ask` endpoint processes questions through full RAG pipeline
3. `/ingest` triggers document processing
4. `/status` returns system health
5. Error responses follow consistent JSON format

**Definition of Done:**
- [ ] `app.py` complete with all routes
- [ ] Full RAG pipeline integration
- [ ] API endpoints return correct JSON
- [ ] Error handling implemented
- [ ] Server starts without errors

**Dependencies:** Tickets A2-A5 (all RAG components)

---

## Ticket A7: Sample Content & Validation
**Description:** Create sample course notes and final validation script
**Scope Boundaries:**
- ✅ Create `sample_course_notes.md` with LLM for Developers content
- ✅ Enhance `validate_project.py` for complete project validation
- ✅ Check 4T prompt structure and module imports
- ❌ No extensive course content (sample only)
- ❌ No external service validation

**Acceptance Criteria:**
1. `sample_course_notes.md` contains relevant course material
2. Validation script checks all required files exist
3. Validates 4T prompt contains required sections
4. Tests Python module imports
5. Outputs validation results to file

**Definition of Done:**
- [ ] Sample document created with course content
- [ ] Validation script checks complete structure
- [ ] 4T template validation passes
- [ ] Import validation passes
- [ ] Validation output file generated

**Dependencies:** All previous tickets

---

## Ticket B1: HTML Template & Basic UI
**Description:** Create main HTML template with clean student-focused design
**Scope Boundaries:**
- ✅ Single-page application in `templates/index.html`
- ✅ Question input textarea with validation
- ✅ Answer display area with citations section
- ✅ Status indicators (Ollama, index status)
- ❌ No JavaScript functionality (static only)
- ❌ No advanced interactivity

**Acceptance Criteria:**
1. HTML template includes all required UI components
2. Clean, readable design focused on students
3. Placeholders for dynamic content
4. Responsive layout works on mobile/desktop
5. Uses CSS/emoji/SVG for visuals (no binary assets)

**Definition of Done:**
- [ ] `templates/index.html` complete
- [ ] All UI components present
- [ ] Responsive design implemented
- [ ] No binary assets used
- [ ] Design matches educational tone

**Dependencies:** None

---

## Ticket B2: Frontend JavaScript
**Description:** Implement frontend logic with Fetch API
**Scope Boundaries:**
- ✅ Vanilla JavaScript in `static/app.js`
- ✅ Question submission to `/ask` endpoint
- ✅ Answer and citation display
- ✅ Loading states and error handling
- ❌ No JavaScript frameworks
- ❌ No advanced features like auto-suggest

**Acceptance Criteria:**
1. `app.js` handles form submission via Fetch API
2. Displays answers with source citations
3. Shows loading indicators during processing
4. Handles API errors gracefully
5. Updates status indicators based on system state

**Definition of Done:**
- [ ] `static/app.js` complete
- [ ] Form submission works
- [ ] Answer display with citations
- [ ] Loading states implemented
- [ ] Error handling for failed requests

**Dependencies:** Ticket B1 (HTML template), Ticket A6 (Flask app)

---

## Ticket B3: CSS Styling
**Description:** Create clean, responsive CSS stylesheet
**Scope Boundaries:**
- ✅ Complete styling in `static/styles.css`
- ✅ Responsive design for mobile/desktop
- ✅ Educational tone with readable typography
- ✅ Visual elements using CSS/emoji/SVG only
- ❌ No CSS frameworks or libraries
- ❌ No complex animations

**Acceptance Criteria:**
1. CSS provides clean, student-focused interface
2. Responsive layout adapts to screen size
3. Readable typography and spacing
4. Visual indicators using CSS/emoji/SVG
5. Consistent color scheme and design

**Definition of Done:**
- [ ] `static/styles.css` complete
- [ ] Responsive design implemented
- [ ] All UI elements styled
- [ ] No external CSS dependencies
- [ ] Design matches requirements

**Dependencies:** Ticket B1 (HTML template)

---

## Ticket B4: Complete Documentation
**Description:** Write all documentation files
**Scope Boundaries:**
- ✅ `README.md` with complete setup guide
- ✅ `docs/architecture.md` with system design
- ✅ `docs/runbook.md` with operational instructions
- ✅ `docs/limitations.md` with known constraints
- ❌ No API documentation beyond what's needed
- ❌ No contributor guidelines

**Acceptance Criteria:**
1. README includes installation, setup, and usage instructions
2. Architecture document describes system components
3. Runbook provides operational troubleshooting
4. Limitations document discloses constraints
5. All documentation is clear and complete

**Definition of Done:**
- [ ] `README.md` complete with setup guide
- [ ] `docs/architecture.md` complete
- [ ] `docs/runbook.md` complete
- [ ] `docs/limitations.md` complete
- [ ] Documentation reviewed for clarity

**Dependencies:** All implementation tickets

---

## Ticket A8: Integration & Final Testing
**Description:** Integrate all components and perform final testing
**Scope Boundaries:**
- ✅ End-to-end testing of complete system
- ✅ Validation of all integration points
- ✅ Demo scenario testing
- ✅ Bug fixes and polish
- ❌ No new feature development
- ❌ No performance optimization

**Acceptance Criteria:**
1. Complete system runs end-to-end without errors
2. Web interface displays questions and answers
3. Citations show source snippets
4. Ollama integration works when available
5. All demo success criteria met

**Definition of Done:**
- [ ] System starts without errors
- [ ] End-to-end tests pass
- [ ] Demo scenario successful
- [ ] All components integrated
- [ ] Final validation passes

**Dependencies:** All previous tickets

---

## Ticket B5: Final Review & Polish
**Description:** Final review, polish, and preparation for demo
**Scope Boundaries:**
- ✅ Review all documentation for completeness
- ✅ Polish UI/UX for demo
- ✅ Ensure all constraints met (no binary assets, etc.)
- ✅ Create demo checklist
- ❌ No major changes to functionality
- ❌ No additional features

**Acceptance Criteria:**
1. All documentation complete and accurate
2. UI is polished and professional
3. All constraints from generation contract met
4. Demo checklist created
5. Project ready for demonstration

**Definition of Done:**
- [ ] Documentation reviewed and polished
- [ ] UI reviewed and polished
- [ ] All constraints verified
- [ ] Demo checklist created
- [ ] Project marked as complete

**Dependencies:** All previous tickets
