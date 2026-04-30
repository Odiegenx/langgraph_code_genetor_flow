# Local RAG Study Assistant - Ticket Backlog

## Phase 1: Core Infrastructure Setup

### **Ticket 1: Project Structure & Environment Setup**
**Assigned:** Worker A (Backend & RAG Developer)
**Priority:** Critical
**Estimate:** 1 day

**Scope Boundaries:**
- ✅ Create complete project directory structure
- ✅ Set up Python virtual environment
- ✅ Create requirements.txt with minimal dependencies
- ✅ Create .env.example with configuration template
- ❌ No actual implementation code
- ❌ No frontend files

**Acceptance Criteria:**
1. All directories (`rag/`, `prompts/`, `documents/`, `index/`, `static/`, `templates/`, `docs/`) exist
2. `requirements.txt` includes Flask, pypdf, requests, python-dotenv
3. `.env.example` contains OLLAMA_MODEL, CHUNK_SIZE, TOP_K_RESULTS, PORT
4. Virtual environment can be created and activated
5. Basic `__init__.py` files in Python packages

**Definition of Done:**
- [ ] Project structure matches architecture diagram
- [ ] `python -m venv venv` works without errors
- [ ] `pip install -r requirements.txt` installs all dependencies
- [ ] `.env.example` file is complete and documented
- [ ] All empty directories are created

**Dependencies:** None

---

### **Ticket 2: Document Ingestion System**
**Assigned:** Worker A (Backend & RAG Developer)
**Priority:** Critical
**Estimate:** 2 days

**Scope Boundaries:**
- ✅ Monitor `documents/` folder for .txt, .md, .pdf files
- ✅ Extract text from PDFs using pypdf
- ✅ Chunk documents (500-1000 characters)
- ✅ Create/maintain JSON index (`index/chunks.json`)
- ✅ Handle basic error cases (missing files, unsupported formats)
- ❌ No advanced PDF parsing (tables, images)
- ❌ No document versioning or update detection

**Acceptance Criteria:**
1. `rag/ingest.py` processes sample_course_notes.md
2. Creates `index/chunks.json` with proper structure
3. Handles at least .txt, .md, and .pdf formats
4. Chunks are sized appropriately (configurable)
5. Includes source file metadata in chunks
6. Can be run manually via command line

**Definition of Done:**
- [ ] `python rag/ingest.py` runs without errors
- [ ] JSON index created with sample document chunks
- [ ] Each chunk has id, text, source_file, chunk_index
- [ ] Error handling for unsupported file types
- [ ] Basic logging for ingestion process

**Dependencies:** Ticket 1 (Project Structure)

---

### **Ticket 3: Basic Retrieval System**
**Assigned:** Worker A (Backend & RAG Developer)
**Priority:** High
**Estimate:** 1.5 days

**Scope Boundaries:**
- ✅ Load JSON index into memory
- ✅ Implement keyword-based retrieval (TF-IDF/BM25)
- ✅ Return top-k relevant chunks (configurable)
- ✅ Include relevance scores
- ✅ Basic ranking algorithm
- ❌ No vector embeddings initially
- ❌ No advanced semantic search

**Acceptance Criteria:**
1. `rag/retrieve.py` loads `index/chunks.json`
2. Can query index with user question
3. Returns top 3 most relevant chunks (configurable)
4. Includes source metadata with results
5. Handles empty index gracefully
6. Basic relevance scoring implemented

**Definition of Done:**
- [ ] Retrieval module can be imported without errors
- [ ] Returns ranked results for test queries
- [ ] Configurable TOP_K_RESULTS via environment
- [ ] Error handling for missing/malformed index
- [ ] Unit tests for basic retrieval functionality

**Dependencies:** Ticket 2 (Document Ingestion)

---

### **Ticket 4: Ollama Client Integration**
**Assigned:** Worker A (Backend & RAG Developer)
**Priority:** Critical
**Estimate:** 1 day

**Scope Boundaries:**
- ✅ HTTP client to `localhost:11434/api/chat`
- ✅ Model configuration from .env file
- ✅ Request/response handling with timeout
- ✅ Error handling for offline Ollama
- ✅ Response parsing
- ❌ No other LLM providers
- ❌ No advanced streaming or token management

**Acceptance Criteria:**
1. `rag/ollama_client.py` connects to local Ollama
2. Uses OLLAMA_MODEL from environment
3. Handles connection errors gracefully
4. Implements timeout for slow responses
5. Returns parsed response text
6. Validates Ollama is running on startup

**Definition of Done:**
- [ ] Can send prompt to Ollama and receive response
- [ ] Handles Ollama not running (clear error message)
- [ ] Configurable timeout (default 30 seconds)
- [ ] Model name configurable via .env
- [ ] Basic response validation

**Dependencies:** Ticket 1 (Environment Setup)

---

### **Ticket 5: 4T Prompt Builder**
**Assigned:** Worker A (Backend & RAG Developer)
**Priority:** High
**Estimate:** 1 day

**Scope Boundaries:**
- ✅ Load prompt template from `prompts/rag_4t_prompt.md`
- ✅ Format prompt with Traits, Task, Tone, Target sections
- ✅ Inject retrieved context and user question
- ✅ Format citations for display
- ✅ Maintain prompt structure integrity
- ❌ No dynamic prompt modification
- ❌ No multiple prompt templates

**Acceptance Criteria:**
1. `rag/prompt_builder.py` loads template file
2. Formats prompt with retrieved context
3. Includes user question in Task section
4. Maintains 4T structure (Traits, Task, Tone, Target)
5. Formats citations with source file names
6. Handles empty context gracefully

**Definition of Done:**
- [ ] Prompt template exists with all 4T sections
- [ ] Can build complete prompt from context + question
- [ ] Citations formatted for display
- [ ] Error handling for missing template file
- [ ] Unit tests for prompt building

**Dependencies:** Ticket 3 (Retrieval System)

---

## Phase 2: Backend Integration

### **Ticket 6: Flask Backend Server**
**Assigned:** Worker A (Backend & RAG Developer)
**Priority:** Critical
**Estimate:** 1.5 days

**Scope Boundaries:**
- ✅ Flask web server with REST API endpoints
- ✅ Route handling (`GET /`, `POST /ask`, `GET /health`)
- ✅ Orchestrates RAG pipeline flow
- ✅ Error handling and response formatting
- ✅ CORS setup for local development
- ❌ No authentication or user management
- ❌ No advanced routing or middleware

**Acceptance Criteria:**
1. `app.py` starts Flask server on configured port
2. `GET /` serves frontend template
3. `POST /ask` processes questions through RAG pipeline
4. `GET /health` returns system status
5. Error handling for pipeline failures
6. JSON response formatting for API

**Definition of Done:**
- [ ] Server starts on `localhost:5000` (configurable)
- [ ] All three endpoints functional
- [ ] RAG pipeline integration complete
- [ ] Error responses in JSON format
- [ ] Basic request validation

**Dependencies:** Tickets 2-5 (All RAG components)

---

### **Ticket 7: RAG Pipeline Integration**
**Assigned:** Worker A (Backend & RAG Developer)
**Priority:** High
**Estimate:** 1 day

**Scope Boundaries:**
- ✅ Connect ingestion → retrieval → prompt → LLM flow
- ✅ Error handling between components
- ✅ Response formatting with citations
- ✅ Pipeline state management
- ❌ No advanced pipeline optimization
- ❌ No caching or performance enhancements

**Acceptance Criteria:**
1. Complete RAG flow: question → chunks → prompt → answer
2. Citations included in response
3. Error handling at each pipeline stage
4. Configurable via environment variables
5. Returns structured response with answer and sources

**Definition of Done:**
- [ ] End-to-end RAG pipeline functional
- [ ] Returns answer with source citations
- [ ] Handles errors at each stage gracefully
- [ ] Pipeline configurable (chunk size, top-k, model)
- [ ] Integration tests for complete flow

**Dependencies:** Tickets 2-6 (All backend components)

---

## Phase 3: Frontend Development

### **Ticket 8: Basic HTML Interface**
**Assigned:** Worker B (Frontend & Documentation Developer)
**Priority:** High
**Estimate:** 1 day

**Scope Boundaries:**
- ✅ Create `templates/index.html` with basic structure
- ✅ Question input form with submit button
- ✅ Answer display area
- ✅ Citation display panel
- ✅ Loading states placeholder
- ❌ No JavaScript functionality
- ❌ No styling or CSS

**Acceptance Criteria:**
1. HTML file exists in correct location
2. Contains all required UI elements
3. Form submits to `/ask` endpoint
4. Placeholders for answer and citations
5. Basic semantic HTML structure
6. No external dependencies or frameworks

**Definition of Done:**
- [ ] HTML file loads in browser
- [ ] All required UI components present
- [ ] Form has proper action and method
- [ ] Placeholder elements for dynamic content
- [ ] Valid HTML5 structure

**Dependencies:** Ticket 6 (Flask Backend)

---

### **Ticket 9: Frontend JavaScript**
**Assigned:** Worker B (Frontend & Documentation Developer)
**Priority:** High
**Estimate:** 1.5 days

**Scope Boundaries:**
- ✅ Vanilla JavaScript in `static/app.js`
- ✅ Form submission handling
- ✅ API communication with backend
- ✅ Dynamic content updates
- ✅ Loading state management
- ❌ No JavaScript frameworks
- ❌ No complex state management

**Acceptance Criteria:**
1. Handles form submission asynchronously
2. Displays loading state during processing
3. Updates answer and citation areas with response
4. Error handling for failed requests
5. Clear user feedback for all states
6. No page reload on form submission

**Definition of Done:**
- [ ] Form submits via fetch API
- [ ] Loading indicator shows during processing
- [ ] Answer displayed when received
- [ ] Citations shown with source information
- [ ] Error messages displayed clearly

**Dependencies:** Ticket 8 (HTML Interface), Ticket 6 (Backend API)

---

### **Ticket 10: Basic Styling**
**Assigned:** Worker B (Frontend & Documentation Developer)
**Priority:** Medium
**Estimate:** 1 day

**Scope Boundaries:**
- ✅ Create `static/styles.css`
- ✅ Basic layout and spacing
- ✅ Clear visual hierarchy
- ✅ Citation styling (distinct from answer)
- ✅ Responsive design basics
- ❌ No complex animations
- ❌ No advanced theming

**Acceptance Criteria:**
1. Clean, readable interface
2. Clear visual distinction between answer and citations
3. Responsive to different screen sizes
4. Loading states visually clear
5. Form and results properly spaced
6. No external CSS dependencies

**Definition of Done:**
- [ ] CSS file linked in HTML
- [ ] Answer clearly distinguished from citations
- [ ] Mobile-responsive layout
- [ ] Loading states visible
- [ ] Clean, professional appearance

**Dependencies:** Ticket 8 (HTML Interface)

---

## Phase 4: Documentation & Validation

### **Ticket 11: Core Documentation**
**Assigned:** Worker B (Frontend & Documentation Developer)
**Priority:** Medium
**Estimate:** 1.5 days

**Scope Boundaries:**
- ✅ `README.md` with setup and usage instructions
- ✅ `docs/architecture.md` with system design
- ✅ `docs/runbook.md` with operational guide
- ✅ `docs/limitations.md` with constraints
- ✅ Code comments for key functions
- ❌ No advanced technical documentation
- ❌ No API reference documentation

**Acceptance Criteria:**
1. README provides complete setup instructions
2. Architecture document describes system flow
3. Runbook explains how to run and maintain
4. Limitations clearly stated
5. Code comments explain RAG pipeline
6. All documents in markdown format

**Definition of Done:**
- [ ] README covers installation, setup, usage
- [ ] Architecture document matches implemented system
- [ ] Runbook has troubleshooting steps
- [ ] Limitations document is honest and clear
- [ ] Key functions have docstrings/comments

**Dependencies:** Tickets 1-10 (All implementation complete)

---

### **Ticket 12: Project Validation Script**
**Assigned:** Worker A (Backend & RAG Developer)
**Priority:** Medium
**Estimate:** 1 day

**Scope Boundaries:**
- ✅ Create `validate_project.py`
- ✅ Check required files exist and are non-empty
- ✅ Validate module imports
- ✅ Check 4T prompt structure
- ✅ Basic configuration validation
- ❌ No LLM calls or external dependencies
- ❌ No complex testing framework

**Acceptance Criteria:**
1. Script runs without external services
2. Validates all required files exist
3. Checks core modules can be imported
4. Verifies 4T prompt contains required sections
5. Outputs clear validation results
6. Can be run via `python validate_project.py`

**Definition of Done:**
- [ ] Script runs successfully on complete project
- [ ] Identifies missing files
- [ ] Validates Python imports
- [ ] Checks prompt template structure
- [ ] Clear output format

**Dependencies:** Tickets 1-11 (All files created)

---

### **Ticket 13: Sample Document & Final Integration**
**Assigned:** Both Workers
**Priority:** Medium
**Estimate:** 0.5 days

**Scope Boundaries:**
- ✅ Create `documents/sample_course_notes.md`
- ✅ Final integration testing
- ✅ End-to-end workflow validation
- ✅ Basic smoke tests
- ❌ No comprehensive test suite
- ❌ No performance testing

**Acceptance Criteria:**
1. Sample document provides test content
2. Complete system can be started
3. End-to-end question answering works
4. Citations displayed correctly
5. All components integrated and functional

**Definition of Done:**
- [ ] Sample document exists with relevant content
- [ ] `python app.py` starts server
- [ ] Web interface loads
- [ ] Question submission returns answer with citations
- [ ] Validation script passes

**Dependencies:** All previous tickets

---

## Phase 5: Polish & Review

### **Ticket 14: Error Handling & User Experience**
**Assigned:** Both Workers
**Priority:** Low
**Estimate:** 1 day

**Scope Boundaries:**
- ✅ Improve error messages throughout system
- ✅ Frontend loading states and error display
- ✅ Backend error response formatting
- ✅ Graceful degradation when Ollama offline
- ❌ No advanced error recovery
- ❌ No automated retry logic

**Acceptance Criteria:**
1. Clear error messages for common failures
2. Frontend shows appropriate error states
3. Backend returns structured error responses
4. System handles missing documents gracefully
5. User-friendly messages for all error cases

**Definition of Done:**
- [ ] Error messages help user diagnose issues
- [ ] Frontend displays errors clearly
- [ ] Backend errors don't crash server
- [ ] Missing Ollama gives clear instructions
- [ ] Missing documents handled gracefully

**Dependencies:** Tickets 1-13

---

### **Ticket 15: Final Review & Documentation Polish**
**Assigned:** Both Workers
**Priority:** Low
**Estimate:** 0.5 days

**Scope Boundaries:**
- ✅ Review all documentation for clarity
- ✅ Update README with actual commands
- ✅ Ensure architecture matches implementation
- ✅ Verify all acceptance criteria met
- ❌ No new features
- ❌ No major refactoring

**Acceptance Criteria:**
1. All documentation is accurate and complete
2. README provides working commands
3. Architecture document matches built system
4. All constraints from generation contract met
5. Project ready for demonstration

**Definition of Done:**
- [ ] Documentation reviewed and updated
- [ ] README has exact setup commands
- [ ] All files present and correct
- [ ] Validation script passes
- [ ] Demo scope criteria satisfied

**Dependencies:** All previous tickets

---

## Dependencies Graph

```
Ticket 1 → Ticket 2 → Ticket 3 → Ticket 5 → Ticket 7
Ticket 1 → Ticket 4 → Ticket 7
Ticket 1 → Ticket 6 → Ticket 8 → Ticket 9 → Ticket 10
Ticket 7 + Ticket 6 → Ticket 13
All Tickets → Ticket 14 → Ticket 15
```

## Success Metrics
1. All tickets completed within scope boundaries
2. System passes validation script
3. End-to-end workflow functional
4. Documentation complete and accurate
5. Demo scope criteria fully satisfied
