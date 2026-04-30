# Local RAG Study Assistant - Ticket Backlog

## Phase 1: Foundation Setup

### Ticket A1: Flask Application Skeleton
**Description**: Create main Flask application with basic routing and error handling
**Scope Boundaries**:
- In: Flask app with `/`, `/health`, `/ingest`, `/ask` endpoints
- In: Basic request validation and JSON response formatting
- In: CORS configuration for local development
- Out: Actual RAG logic implementation
- Out: Frontend templates

**Acceptance Criteria**:
1. Flask app runs on port 5000 without errors
2. `/health` returns `{"status": "ok"}` 
3. `/ingest` and `/ask` endpoints accept POST requests
4. All endpoints return proper JSON responses
5. Basic error handling for 404 and 500 errors

**Definition of Done**:
- `app.py` exists with all required endpoints
- Can start server with `python app.py`
- All routes return expected JSON structure
- Code passes PEP8 style check

**Dependencies**: None

---

### Ticket A2: Document Ingestion Pipeline
**Description**: Implement document processing for TXT, MD, and PDF files
**Scope Boundaries**:
- In: Monitor `documents/` folder for supported file types
- In: Parse PDFs using pypdf library
- In: Split documents into semantic chunks (paragraph-based)
- In: Extract metadata (filename, chunk index, positions)
- Out: Advanced PDF features (images, tables)
- Out: Document versioning or update detection

**Acceptance Criteria**:
1. Processes `.txt`, `.md`, and `.pdf` files from `documents/` folder
2. Creates chunks of 200-500 characters preserving paragraph boundaries
3. Generates JSON index with structure: `{"chunks": [{"text": "...", "metadata": {...}}]}`
4. Stores index files in `index/` directory with original filename
5. Handles encoding errors gracefully

**Definition of Done**:
- `ingest.py` module can be imported and run
- Sample documents are successfully processed
- JSON index files are created in correct format
- Error handling for unsupported file types

**Dependencies**: A1 (Flask app structure)

---

### Ticket B1: HTML UI Structure
**Description**: Create basic HTML interface with required UI components
**Scope Boundaries**:
- In: Clean, responsive layout with semantic HTML
- In: Question input field and submit button
- In: Answer display area with formatting
- In: Source citations section
- Out: Advanced styling or animations
- Out: JavaScript functionality

**Acceptance Criteria**:
1. Single `index.html` file with proper HTML5 structure
2. Contains: header, main question input, answer display, citations area
3. Responsive design that works on mobile and desktop
4. Clear visual hierarchy and typography
5. Loading state placeholders

**Definition of Done**:
- `templates/index.html` exists and validates
- All required UI elements are present
- Page loads without JavaScript errors
- Basic accessibility features (alt text, ARIA labels)

**Dependencies**: None

---

## Phase 2: Core RAG Components

### Ticket A3: Retrieval Engine Implementation
**Description**: Implement simple keyword-based retrieval system
**Scope Boundaries**:
- In: Load JSON index files from `index/` directory
- In: Basic keyword matching or TF-IDF scoring
- In: Return top-k relevant chunks (k=3)
- In: Handle "no results" case gracefully
- Out: Vector embeddings or semantic search
- Out: Advanced ranking algorithms

**Acceptance Criteria**:
1. Loads all JSON index files into searchable structure
2. Scores chunks based on keyword overlap with query
3. Returns top 3 most relevant chunks with metadata
4. Returns empty list when no matches found
5. Performance: <100ms for typical queries

**Definition of Done**:
- `retrieve.py` module with `get_relevant_chunks(query)` function
- Returns structured results with scores and metadata
- Handles edge cases (empty index, no matches)
- Unit tests for basic retrieval scenarios

**Dependencies**: A2 (Document ingestion)

---

### Ticket A4: 4T Prompt Template System
**Description**: Create prompt builder that loads and formats 4T template
**Scope Boundaries**:
- In: Load prompt template from `prompts/rag_4t_prompt.md`
- In: Inject retrieved context and user question into template
- In: Maintain 4T structure (Traits, Task, Tone, Target)
- Out: Dynamic template selection or versioning
- Out: Template editing interface

**Acceptance Criteria**:
1. Template file contains all four 4T sections
2. Prompt builder correctly injects context chunks
3. Generated prompt includes proper formatting and delimiters
4. Handles edge cases (empty context, malformed template)
5. Template is readable and maintainable

**Definition of Done**:
- `prompt_builder.py` module with `build_prompt(context, question)` function
- `rag_4t_prompt.md` exists with complete 4T structure
- Generated prompts follow expected format
- Template can be easily modified without code changes

**Dependencies**: A3 (Retrieval engine)

---

### Ticket B2: Frontend JavaScript Logic
**Description**: Implement vanilla JavaScript for API interaction
**Scope Boundaries**:
- In: Handle form submission and API calls
- In: Display answers and citations from API response
- In: Loading states and error messages
- In: Basic input validation
- Out: Chat history or session management
- Out: Advanced UI interactions

**Acceptance Criteria**:
1. Submits questions to `/ask` endpoint via fetch API
2. Displays formatted answer in answer area
3. Shows source citations with filename references
4. Shows loading spinner during API calls
5. Displays user-friendly error messages

**Definition of Done**:
- `static/app.js` handles all required functionality
- No JavaScript frameworks or libraries used
- Error handling for network failures
- Clean separation of concerns in code

**Dependencies**: B1 (HTML structure), A1 (API endpoints)

---

## Phase 3: Integration & Polish

### Ticket A5: Ollama Client Integration
**Description**: Create client for local Ollama API communication
**Scope Boundaries**:
- In: HTTP client for `http://localhost:11434/api/chat`
- In: Support for `qwen3:8b` model (configurable)
- In: Timeout and error handling for offline Ollama
- In: Parse and validate LLM responses
- Out: Multiple model support or model switching
- Out: Streaming responses

**Acceptance Criteria**:
1. Sends properly formatted prompts to Ollama API
2. Handles HTTP errors and timeouts gracefully
3. Extracts answer text from Ollama response
4. Configurable model via environment variable
5. Returns structured response with answer and metadata

**Definition of Done**:
- `ollama_client.py` module with `generate_answer(prompt)` function
- Handles Ollama offline scenario with clear error
- Response parsing is robust against format changes
- Environment variable `OLLAMA_MODEL` respected

**Dependencies**: A4 (Prompt builder)

---

### Ticket A6: Complete RAG Pipeline Integration
**Description**: Connect all backend components in Flask endpoints
**Scope Boundaries**:
- In: `/ingest` endpoint triggers document processing
- In: `/ask` endpoint orchestrates retrieval → prompt → LLM → response
- In: Error handling throughout pipeline
- In: Response formatting with citations
- Out: Performance optimization
- Out: Caching or memoization

**Acceptance Criteria**:
1. `/ingest` processes documents and creates/updates index
2. `/ask` returns answer with source citations in JSON format
3. Handles "insufficient information" case when retrieval empty
4. Pipeline errors return appropriate HTTP status codes
5. Response time <5 seconds for typical queries

**Definition of Done**:
- All backend modules integrated in `app.py`
- End-to-end flow works from question to answer
- Error messages are informative and actionable
- API responses follow consistent JSON schema

**Dependencies**: A3, A4, A5 (All backend modules)

---

### Ticket B3: CSS Styling and Layout
**Description**: Apply CSS for clean, readable interface
**Scope Boundaries**:
- In: Responsive layout using flexbox/grid
- In: Typography and spacing for readability
- In: Loading states and error message styling
- In: Source citation formatting
- Out: Complex animations or transitions
- Out: Dark mode or theme switching

**Acceptance Criteria**:
1. Clean, professional appearance
2. Responsive design works on mobile (320px+) and desktop
3. Clear visual distinction between answer and citations
4. Loading spinner visible during API calls
5. Error messages stand out appropriately

**Definition of Done**:
- `static/styles.css` provides all required styling
- No external CSS frameworks or libraries
- Consistent color scheme and typography
- Accessible contrast ratios and focus states

**Dependencies**: B1 (HTML structure), B2 (JavaScript)

---

## Phase 4: Documentation & Validation

### Ticket B4: Project Documentation
**Description**: Create comprehensive documentation for users and developers
**Scope Boundaries**:
- In: README with setup and usage instructions
- In: Architecture documentation explaining system design
- In: Runbook for operational procedures
- In: Limitations and trade-offs document
- Out: API reference documentation
- Out: Contributor guidelines

**Acceptance Criteria**:
1. README includes Ollama setup instructions
2. Architecture document matches implemented system
3. Runbook covers common operations and troubleshooting
4. Limitations document clearly states system constraints
5. All documentation is technically accurate and up-to-date

**Definition of Done**:
- All required documentation files exist in `docs/` directory
- Documentation is clear, concise, and well-organized
- Includes code examples where helpful
- No placeholder or TODO content

**Dependencies**: A6, B3 (Complete implementation)

---

### Ticket A7: Validation Script
**Description**: Create script to validate project structure and functionality
**Scope Boundaries**:
- In: Check existence of all required files
- In: Validate 4T prompt template structure
- In: Test module imports and basic functionality
- In: Generate validation report
- Out: Full integration testing
- Out: Performance benchmarking

**Acceptance Criteria**:
1. Checks all files listed in workflow_config.json exist
2. Verifies `rag_4t_prompt.md` contains required 4T sections
3. Tests that core modules can be imported without errors
4. Outputs results to `validation_output.txt`
5. Does not require Ollama to be running

**Definition of Done**:
- `validate_project.py` runs without errors
- Validation report clearly indicates pass/fail status
- Script provides actionable feedback for failures
- Can be run as part of CI/CD pipeline

**Dependencies**: All other tickets (complete project)

---

### Ticket B5: Deployment Checklist & Final Polish
**Description**: Create deployment guide and perform final UI polish
**Scope Boundaries**:
- In: Deployment checklist for local setup
- In: Final UI improvements and bug fixes
- In: Cross-browser compatibility testing
- In: Sample course document
- Out: Production deployment scripts
- Out: Automated testing suite

**Acceptance Criteria**:
1. Deployment checklist covers all setup steps
2. UI works correctly in Chrome, Firefox, Safari
3. Sample course document demonstrates system capabilities
4. All known issues documented in limitations.md
5. Project passes validation script

**Definition of Done**:
- `docs/deployment_checklist.md` exists and is complete
- Sample document provides meaningful test cases
- UI has been tested on multiple browsers
- Project is ready for demonstration

**Dependencies**: All other tickets

---

## Cross-Cutting Concerns

### Ticket X1: Error Handling & User Experience
**Description**: Implement consistent error handling across all components
**Scope Boundaries**:
- In: Backend API error responses
- In: Frontend error display
- In: Ollama offline handling
- In: Empty retrieval handling
- Out: Advanced error recovery
- Out: Error analytics or logging

**Acceptance Criteria**:
1. All API errors return structured JSON with error messages
2. Frontend displays user-friendly error messages
3. Clear guidance when Ollama is not running
4. "Insufficient information" response when retrieval empty
5. No unhandled exceptions in normal operation

**Definition of Done**:
- Error handling implemented in all modules
- Error messages are actionable for users
- System degrades gracefully when components unavailable
- Validation script catches common configuration errors

**Dependencies**: Distributed across all tickets

---

### Ticket X2: Code Quality & Standards
**Description**: Ensure code follows best practices and is well-documented
**Scope Boundaries**:
- In: Code comments and docstrings
- In: Consistent naming conventions
- In: PEP8 compliance for Python code
- In: JavaScript code organization
- Out: Automated testing
- Out: Code coverage requirements

**Acceptance Criteria**:
1. All Python modules have docstrings and comments
2. Code follows PEP8 style guide
3. JavaScript uses modern ES6+ features appropriately
4. No linting errors in critical code paths
5. Code is organized for readability and maintainability

**Definition of Done**:
- Code review passes for style and quality
- Documentation matches implementation
- No obvious code smells or anti-patterns
- Project structure follows architecture document

**Dependencies**: Distributed across all tickets

---

## Dependencies Graph

```
A1 → A2 → A3 → A4 → A5 → A6 → A7
                             ↑
B1 → B2 → B3 → B4 → B5 →─────┘
      ↑     ↑
     A1    B1
     
X1, X2: Cross-cutting (apply to all)
```

**Total Tickets**: 12 (7 Backend, 5 Frontend/Docs, 2 Cross-cutting)
