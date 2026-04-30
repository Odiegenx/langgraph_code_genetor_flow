# Local RAG Study Assistant - Ticket Backlog

## Worker A: Backend & Core RAG Logic

### Ticket A1: Project Configuration & Dependencies
**Description**: Create the foundational configuration file and dependency manifest
**Scope Boundaries**:
- ✅ Create `config.py` with OLLAMA_MODEL, DOCUMENTS_PATH, INDEX_PATH constants
- ✅ Create `requirements.txt` with Flask, pypdf, scikit-learn, requests
- ❌ No environment variable management
- ❌ No advanced configuration options
**Acceptance Criteria**:
1. `config.py` exists with three required constants
2. `requirements.txt` lists exact versions of four required packages
3. Both files are in correct location (`rag_study_assistant/`)
**Definition of Done**:
- Configuration file passes import test
- Requirements file can be installed with `pip install -r requirements.txt`
**Dependencies**: None (foundational)

### Ticket A2: Document Ingestion Module
**Description**: Implement text extraction, chunking, and TF-IDF indexing for local documents
**Scope Boundaries**:
- ✅ Process .txt, .md, .pdf files from documents folder
- ✅ Extract text using pypdf for PDFs
- ✅ Split by paragraph/sentence boundaries (not fixed size)
- ✅ Build TF-IDF vectorizer and save to index folder
- ❌ No incremental indexing
- ❌ No document metadata beyond filename
- ❌ No image/audio extraction
**Acceptance Criteria**:
1. Module can process sample markdown file
2. Creates `index/chunks.json` with text chunks and source metadata
3. Creates `index/tfidf_index.pkl` with serialized vectorizer
4. Handles PDF extraction errors gracefully
**Definition of Done**:
- Ingestion runs without errors on sample document
- Index files are created and contain expected data
- Validation script can import module
**Dependencies**: Ticket A1 (configuration)

### Ticket A3: Retrieval Module
**Description**: Implement TF-IDF similarity scoring to find top relevant chunks
**Scope Boundaries**:
- ✅ Load saved index and vectorizer
- ✅ Compute query similarity using TF-IDF
- ✅ Return top 3 chunks with source metadata
- ❌ No semantic search (embeddings)
- ❌ No relevance scoring display
- ❌ No query expansion
**Acceptance Criteria**:
1. Module loads index files without errors
2. For test query "prompt engineering", returns relevant chunks
3. Returns list of dicts with `text`, `source`, `chunk_id`
4. Handles empty query gracefully
**Definition of Done**:
- Retrieval returns expected number of results
- Results are sorted by relevance
- Module imports without syntax errors
**Dependencies**: Ticket A2 (index files must exist)

### Ticket A4: Prompt Builder Module
**Description**: Load 4T template and insert context/question for LLM
**Scope Boundaries**:
- ✅ Load prompt template from `prompts/rag_4t_prompt.md`
- ✅ Insert retrieved context and user question
- ✅ Return formatted prompt string
- ❌ No template validation beyond file existence
- ❌ No dynamic template selection
- ❌ No prompt optimization
**Acceptance Criteria**:
1. Module reads template file successfully
2. Formats prompt with context and question placeholders
3. Output contains all 4T sections (Traits, Task, Tone, Target)
4. Context and question are properly escaped/inserted
**Definition of Done**:
- Prompt builder creates complete prompt string
- Template sections remain intact after formatting
- Module imports without errors
**Dependencies**: Ticket B1 (prompt template must exist)

### Ticket A5: Ollama Client Module
**Description**: Implement HTTP client for local Ollama API
**Scope Boundaries**:
- ✅ POST requests to `http://localhost:11434/api/chat`
- ✅ Use model from config (default: `qwen3:8b`)
- ✅ Parse and return response text
- ❌ No streaming responses
- ❌ No retry logic
- ❌ No advanced error handling
**Acceptance Criteria**:
1. Sends properly formatted JSON to Ollama endpoint
2. Extracts response text from Ollama JSON response
3. Returns empty string if Ollama unavailable
4. Uses model name from configuration
**Definition of Done**:
- Client can call Ollama when service is running
- Gracefully handles connection errors
- Returns parsed response text
**Dependencies**: Ticket A1 (configuration), Ticket A4 (prompt input)

### Ticket A6: Flask Application Backend
**Description**: Create main web server with three endpoints
**Scope Boundaries**:
- ✅ `GET /` serves HTML template
- ✅ `POST /ingest` triggers document processing
- ✅ `POST /query` executes full RAG pipeline
- ❌ No authentication
- ❌ No session management
- ❌ No production WSGI server
**Acceptance Criteria**:
1. Flask app starts on `localhost:5000`
2. `/ingest` endpoint calls ingestion module
3. `/query` endpoint integrates retrieval → prompt → Ollama → response
4. Returns JSON with `answer` and `sources` fields
**Definition of Done**:
- All endpoints respond without errors
- RAG pipeline executes end-to-end
- App can run with `python app.py`
**Dependencies**: Tickets A2-A5 (all modules), Ticket B3 (HTML template)

---

## Worker B: Frontend, Data, Docs & Validation

### Ticket B1: 4T Prompt Template
**Description**: Create the structured prompt template for RAG interactions
**Scope Boundaries**:
- ✅ Markdown file with six sections (Traits, Task, Tone, Target, Context, Question)
- ✅ Clear instructional language for study assistant role
- ❌ No multiple template variants
- ❌ No conditional sections
**Acceptance Criteria**:
1. File exists at `prompts/rag_4t_prompt.md`
2. Contains all required section headers
3. Context and question are marked as `{context}` and `{question}` placeholders
4. Template is educational and concise
**Definition of Done**:
- Template passes validation script check
- Prompt builder can read and format it
- Sections are clearly delineated
**Dependencies**: None

### Ticket B2: Sample Course Notes
**Description**: Create demonstration document about LLM for Developers topics
**Scope Boundaries**:
- ✅ 3-5 paragraphs covering RAG, prompt engineering, fine-tuning
- ✅ Markdown format with clear headings
- ❌ No complex formatting (tables, images)
- ❌ No external references
**Acceptance Criteria**:
1. File exists at `documents/sample_course_notes.md`
2. Contains at least 500 words of relevant content
3. Topics align with "LLM for Developers" theme
4. Text is cleanly extractable (no special characters)
**Definition of Done**:
- Document is non-empty
- Ingestion module can process it
- Contains retrievable chunks for demo questions
**Dependencies**: None

### Ticket B3: HTML Template Interface
**Description**: Create single-page web interface for question/answer interaction
**Scope Boundaries**:
- ✅ Basic HTML structure with title, description
- ✅ Question textarea and submit button
- ✅ Answer display section
- ✅ Source citations section
- ❌ No complex UI components
- ❌ No mobile-responsive design
**Acceptance Criteria**:
1. Template loads without JavaScript errors
2. Form submits to `/query` endpoint
3. Includes references to `app.js` and `styles.css`
4. Has clear areas for answer and sources display
**Definition of Done**:
- HTML validates (no syntax errors)
- All required elements present
- Flask can serve template successfully
**Dependencies**: None

### Ticket B4: Frontend JavaScript Logic
**Description**: Implement vanilla JS for API calls and UI updates
**Scope Boundaries**:
- ✅ Handle form submission with POST to `/query`
- ✅ Display answer and sources in UI
- ✅ Show loading indicator during request
- ❌ No frameworks (jQuery, React, etc.)
- ❌ No advanced error handling UI
**Acceptance Criteria**:
1. JavaScript file exists at `static/app.js`
2. Prevents default form submission
3. Shows loading state during API call
4. Updates DOM with response data
**Definition of Done**:
- Form submission works end-to-end
- Loading indicator appears/disappears
- Answer and sources display correctly
**Dependencies**: Ticket B3 (HTML template), Ticket A6 (backend endpoints)

### Ticket B5: CSS Styling
**Description**: Create basic styling for layout and visual elements
**Scope Boundaries**:
- ✅ Flexbox/Grid layout for main sections
- ✅ Styling for input, button, answer box, sources box
- ✅ Basic visual hierarchy and spacing
- ❌ No external images or icons
- ❌ No dark/light theme toggle
**Acceptance Criteria**:
1. CSS file exists at `static/styles.css`
2. Interface has clear visual structure
3. Answer and sources sections are visually distinct
4. Uses CSS gradients or emoji for simple visual elements
**Definition of Done**:
- Page is visually coherent
- All elements are properly styled
- No broken layout at standard screen sizes
**Dependencies**: Ticket B3 (HTML structure)

### Ticket B6: User Documentation (README)
**Description**: Create setup and usage guide for end users
**Scope Boundaries**:
- ✅ Purpose, problem, MVP scope explanation
- ✅ Prerequisites: Python 3.9+, Ollama installation
- ✅ Installation and running instructions
- ✅ Example usage with screenshots/descriptions
- ❌ No API documentation
- ❌ No contributor guidelines
**Acceptance Criteria**:
1. README.md exists in project root
2. Contains all required sections from generation contract
3. Instructions are clear and testable
4. Explains RAG flow and 4T prompt usage
**Definition of Done**:
- Documentation allows new user to run project
- All key concepts explained
- No broken commands or links
**Dependencies**: All implementation tickets (for accurate descriptions)

### Ticket B7: Technical Documentation Suite
**Description**: Create architecture, runbook, and limitations documents
**Scope Boundaries**:
- ✅ `architecture.md`: Component diagram and descriptions
- ✅ `runbook.md`: Operational steps and troubleshooting
- ✅ `limitations.md`: Scale constraints and trade-offs
- ❌ No UML diagrams
- ❌ No API reference
**Acceptance Criteria**:
1. All three documents exist in `docs/` folder
2. Architecture matches implemented system
3. Runbook provides actionable troubleshooting steps
4. Limitations document is honest about constraints
**Definition of Done**:
- Documents are technically accurate
- Runbook helps resolve common issues
- Limitations align with implementation
**Dependencies**: All implementation tickets (for accurate technical details)

### Ticket B8: Validation Script
**Description**: Create automated project structure and logic validation
**Scope Boundaries**:
- ✅ Check existence of all required files
- ✅ Validate 4T prompt contains required headings
- ✅ Check sample document is non-empty
- ✅ Attempt imports of core Python modules
- ❌ No performance testing
- ❌ No Ollama connectivity testing
**Acceptance Criteria**:
1. Script exists as `validate_project.py`
2. Outputs summary report to `validation_output.txt`
3. Catches missing files and syntax errors
4. Provides clear pass/fail status
**Definition of Done**:
- Script runs without errors on complete project
- Reports success when all criteria met
- Helps identify missing components
**Dependencies**: All other tickets (to validate complete project)

---

## Integration & Testing Tickets

### Ticket I1: End-to-End Pipeline Integration
**Description**: Connect all modules and verify complete RAG flow
**Scope Boundaries**:
- ✅ Test ingestion → retrieval → prompt → Ollama → response chain
- ✅ Verify frontend-backend communication
- ❌ No performance benchmarking
- ❌ No edge case testing
**Acceptance Criteria**:
1. Full pipeline executes without errors
2. Web interface shows answer and sources
3. 4T prompt is actually sent to Ollama
4. Source citations match retrieved chunks
**Definition of Done**:
- Demo question produces coherent answer
- All components work together
- Validation script passes
**Dependencies**: All A and B tickets

### Ticket I2: Demo Preparation & Validation
**Description**: Prepare final project for demonstration
**Scope Boundaries**:
- ✅ Run validation script and fix any issues
- ✅ Ensure sample document provides good demo queries
- ✅ Test with Ollama running and not running
- ❌ No additional features
**Acceptance Criteria**:
1. Validation script reports all checks passed
2. Demo question "What is prompt engineering?" works
3. System shows retrieved context when Ollama unavailable
4. All documentation is complete and accurate
**Definition of Done**:
- Project meets all acceptance criteria from generation contract
- Ready for demonstration per demo_scope.md
- All files in correct locations with correct content
**Dependencies**: Ticket I1, Ticket B8

---

## Ticket Dependencies Graph

```
A1 → A2 → A3 → A6
↓           ↓    ↓
A5 ← A4 ← B1    B4 ← B3 ← B5
                    ↓    ↓
                    B6   B7
                    ↓    ↓
                    I1 → I2
                    ↑    ↑
B2 → A2           B8 → I2
```

**Critical Path**: A1 → A2 → A3 → A4 → A5 → A6 → I1 → I2  
**Parallel Work**: B1, B2, B3, B5, B7 can proceed concurrently with A tickets  
**Integration Point**: All tickets must complete before I1
