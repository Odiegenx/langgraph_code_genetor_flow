# Local RAG Study Assistant - Ticket Backlog

## Ticket 1: Project Foundation Setup
**Scope:** Initialize project structure and core dependencies
- Create project directory with proper folder hierarchy
- Set up Python virtual environment
- Create `requirements.txt` with Flask, pypdf, requests
- Initialize git repository (optional)
- Create basic README skeleton

**Acceptance Criteria:**
- All directories exist: `rag/`, `prompts/`, `documents/`, `index/`, `static/`, `templates/`, `docs/`
- `requirements.txt` contains Flask>=2.3.0, pypdf>=3.0.0, requests>=2.31.0
- Virtual environment can be activated without errors
- Project follows structure in generation_contract.md

**Definition of Done:**
- ✅ Project structure matches specification
- ✅ Dependencies can be installed via `pip install -r requirements.txt`
- ✅ No syntax errors in any created files
- ✅ All empty directories exist

**Dependencies:** None

---

## Ticket 2: Document Ingestion Module
**Scope:** Implement `rag/ingest.py` for processing course materials
- Support TXT, MD, and PDF file formats
- Implement text extraction using pypdf for PDFs
- Create chunking strategy: 500-character chunks with 50-character overlap
- Generate JSON index with metadata (filename, page numbers, chunk IDs)
- Save index to `index/chunks.json`

**Acceptance Criteria:**
- Can process sample PDF, TXT, and MD files from `documents/` directory
- Generates chunks.json with proper structure
- Preserves source metadata in index
- Handles file reading errors gracefully
- Logs processing steps to console

**Definition of Done:**
- ✅ Module can be imported without errors
- ✅ Successfully processes at least 3 different file types
- ✅ Generated index contains at least 10 chunks from sample documents
- ✅ No crashes on malformed files
- ✅ Includes error handling for missing files

**Dependencies:** Ticket 1 (Project Foundation)

---

## Ticket 3: Retrieval Module Implementation
**Scope:** Implement `rag/retrieve.py` for BM25/TF-IDF keyword matching
- Load and manage JSON index from `index/chunks.json`
- Implement simple term frequency-based scoring
- Top-k retrieval (default k=3)
- Relevance scoring and ranking
- Source snippet extraction with context windows
- Case-insensitive matching with basic stop word filtering

**Acceptance Criteria:**
- Can load index file and return top 3 relevant chunks
- Implements BM25 or TF-IDF scoring algorithm
- Returns chunks with relevance scores
- Handles empty queries gracefully
- Provides context windows around matched terms

**Definition of Done:**
- ✅ Module returns ranked results for test queries
- ✅ Scores are calculated consistently
- ✅ Handles missing index file with clear error
- ✅ Performance acceptable for <1000 chunks
- ✅ Includes unit tests for scoring logic

**Dependencies:** Ticket 2 (Document Ingestion)

---

## Ticket 4: 4T Prompt Template System
**Scope:** Create `prompts/rag_4t_prompt.md` and `rag/prompt_builder.py`
- Design 4T prompt template with Traits, Task, Tone, Target sections
- Implement prompt builder that formats retrieved context and user question
- Ensure proper section formatting for LLM consumption
- Manage context window constraints

**Acceptance Criteria:**
- Prompt template contains all required 4T sections
- Prompt builder correctly inserts context and question
- Formatted prompt stays within reasonable token limits
- Template is readable and follows educational tone
- Can handle empty context gracefully

**Definition of Done:**
- ✅ Prompt template file exists with complete 4T structure
- ✅ Prompt builder can be imported and used
- ✅ Generated prompts are syntactically correct
- ✅ Template emphasizes source-grounded responses
- ✅ Includes fallback for missing context

**Dependencies:** Ticket 3 (Retrieval Module)

---

## Ticket 5: Ollama Client Integration
**Scope:** Implement `rag/ollama_client.py` for local LLM communication
- HTTP communication with local Ollama instance (`http://localhost:11434/api/chat`)
- Model configuration (default: `qwen3:8b`)
- Response parsing and error handling
- Timeout and retry logic
- Fallback responses when Ollama unavailable

**Acceptance Criteria:**
- Can send prompts to Ollama API endpoint
- Handles connection errors gracefully
- Parses Ollama responses correctly
- Implements timeout (e.g., 30 seconds)
- Provides fallback answer when Ollama not running

**Definition of Done:**
- ✅ Client can communicate with running Ollama instance
- ✅ Returns parsed response or clear error message
- ✅ Includes retry logic for transient failures
- ✅ Configurable model name
- ✅ Handles malformed API responses

**Dependencies:** Ticket 4 (Prompt Builder)

---

## Ticket 6: Flask Backend Server
**Scope:** Implement `app.py` as main web application
- Flask web server with REST API endpoints
- Route `/` to serve main interface
- Implement `/api/ask` endpoint for RAG pipeline
- Optional `/api/ingest` endpoint for document processing
- Error handling and graceful degradation
- Static file serving for frontend assets

**Acceptance Criteria:**
- Server starts on localhost:5000 without errors
- `/api/ask` endpoint processes questions through RAG pipeline
- Returns JSON with answer and citations
- Handles missing modules gracefully
- Serves static files from correct directories

**Definition of Done:**
- ✅ Server runs without syntax errors
- ✅ All endpoints return appropriate HTTP status codes
- ✅ Error messages are user-friendly
- ✅ CORS configured for local development
- ✅ Logs requests to console

**Dependencies:** Tickets 2-5 (All RAG modules)

---

## Ticket 7: Sample Course Content
**Scope:** Create `documents/sample_course_notes.md` with educational content
- Write sample course notes about LLMs for Developers
- Include multiple topics for testing retrieval
- Format with markdown headings and sections
- Ensure content is educational and relevant
- Include enough content for meaningful chunking

**Acceptance Criteria:**
- Document contains at least 5 sections on different LLM topics
- Content is technically accurate for educational purposes
- Markdown formatting is clean and readable
- Total content > 2000 characters for chunking
- Covers topics mentioned in 4T prompt target

**Definition of Done:**
- ✅ File exists in documents/ directory
- ✅ Content is relevant to "LLM for Developers"
- ✅ Can be successfully ingested by ingestion module
- ✅ Provides varied test cases for retrieval
- ✅ Free of formatting errors

**Dependencies:** Ticket 2 (Document Ingestion)

---

## Ticket 8: Frontend HTML Template
**Scope:** Create `templates/index.html` as single-page application
- Clean, student-focused interface design
- Question input textarea with submit button
- Answer display area with syntax highlighting support
- Source citations section with expandable snippets
- Status indicators (loading, success, error)
- Responsive layout using CSS Grid/Flexbox

**Acceptance Criteria:**
- Page loads without JavaScript errors
- All UI elements are present and functional
- Responsive design works on mobile and desktop
- Semantic HTML structure
- Proper form submission handling

**Definition of Done:**
- ✅ HTML validates without errors
- ✅ All required UI components exist
- ✅ Responsive at common breakpoints
- ✅ Accessible with proper ARIA labels
- ✅ Clean, commented code structure

**Dependencies:** Ticket 6 (Backend Server)

---

## Ticket 9: Frontend JavaScript Logic
**Scope:** Implement `static/app.js` for API calls and DOM manipulation
- Vanilla JavaScript using Fetch API
- Handle question submission and display answers
- Manage loading states and error messages
- Format and display source citations
- Implement expandable source snippets
- Client-side input validation

**Acceptance Criteria:**
- Can submit questions to `/api/ask` endpoint
- Displays answers with proper formatting
- Shows source citations with context
- Handles API errors gracefully
- Provides user feedback during processing

**Definition of Done:**
- ✅ No console errors during normal operation
- ✅ All user interactions work as expected
- ✅ Error states are clearly communicated
- ✅ Code is well-commented and organized
- ✅ Follows ES6+ best practices

**Dependencies:** Ticket 8 (HTML Template)

---

## Ticket 10: Frontend Styling
**Scope:** Create `static/styles.css` with educational theme
- Clean, readable design with educational tone
- Visual placeholders using CSS/emoji/SVG
- Responsive layout for all screen sizes
- Loading animations and state indicators
- Typography optimized for reading
- Color scheme suitable for study environment

**Acceptance Criteria:**
- Page is visually appealing and professional
- All UI states are styled (normal, loading, error, success)
- Responsive across device sizes
- Uses system fonts for zero dependencies
- Accessible color contrast ratios

**Definition of Done:**
- ✅ CSS validates without errors
- ✅ Design matches educational focus
- ✅ All interactive elements have visual feedback
- ✅ No external dependencies or CDN links
- ✅ Consistent spacing and typography

**Dependencies:** Ticket 8 (HTML Template)

---

## Ticket 11: Project Validation Script
**Scope:** Implement `validate_project.py` for structural validation
- Check file existence and structure
- Verify 4T prompt contains required sections
- Test Python module imports
- Validate web file structure
- Output results to `site_validation_output.txt`
- Run without external services

**Acceptance Criteria:**
- Script runs without external dependencies
- Validates all required files exist
- Checks 4T prompt structure
- Tests Python imports work correctly
- Generates clear validation report

**Definition of Done:**
- ✅ Script executes without errors
- ✅ Output file contains validation results
- ✅ All checks pass for complete project
- ✅ Clear error messages for failures
- ✅ Can be run independently

**Dependencies:** All previous tickets

---

## Ticket 12: Complete Documentation Suite
**Scope:** Create all documentation files
- `README.md`: Complete setup and usage guide
- `docs/architecture.md`: System design documentation
- `docs/runbook.md`: Operational guide
- `docs/limitations.md`: Known limits and assumptions

**Acceptance Criteria:**
- README includes installation, setup, and usage instructions
- Architecture document describes all components
- Runbook provides operational procedures
- Limitations document is honest about constraints
- All documentation is clear and complete

**Definition of Done:**
- ✅ All documentation files exist and are populated
- ✅ Instructions are clear and actionable
- ✅ Technical details are accurate
- ✅ Limitations are clearly stated
- ✅ Documentation follows consistent style

**Dependencies:** All implementation tickets

---

## Ticket 13: End-to-End Integration Testing
**Scope:** Test complete system workflow
- Verify document ingestion creates valid index
- Test retrieval returns relevant chunks
- Validate prompt generation format
- Confirm Ollama integration works (or graceful fallback)
- Test frontend-backend communication
- Validate error handling throughout pipeline

**Acceptance Criteria:**
- Complete RAG pipeline works end-to-end
- Web interface displays answers with citations
- System handles errors gracefully at all levels
- Performance is acceptable for local use
- All components integrate correctly

**Definition of Done:**
- ✅ System can answer questions about sample documents
- ✅ Source citations are displayed correctly
- ✅ Error states are handled gracefully
- ✅ Validation script passes all checks
- ✅ Demo success criteria are met

**Dependencies:** All previous tickets

---

## Ticket 14: Final Review and Polish
**Scope:** Final quality assurance and refinement
- Code review and cleanup
- Documentation proofreading
- UI/UX polish
- Performance optimization
- Security review
- Final validation run

**Acceptance Criteria:**
- All code follows Python/JavaScript best practices
- Documentation is complete and accurate
- UI is polished and professional
- System meets all requirements from generation contract
- Ready for demonstration

**Definition of Done:**
- ✅ Project passes final validation
- ✅ Code is clean and well-commented
- ✅ Documentation is publication-ready
- ✅ System demonstrates all MVP features
- ✅ Ready for submission/demo

**Dependencies:** Ticket 13 (Integration Testing)

---

## Ticket 15: Optional Enhancement - Advanced Error Handling
**Scope:** Improve error handling and user feedback (if time permits)
- Enhanced error messages throughout pipeline
- Better handling of edge cases
- Improved user feedback in UI
- Additional validation checks
- Performance monitoring

**Acceptance Criteria:**
- Users receive clear guidance for common issues
- System recovers gracefully from more edge cases
- UI provides helpful error messages
- Additional validation prevents user errors

**Definition of Done:**
- ✅ Error handling is robust and user-friendly
- ✅ Edge cases are documented and handled
- ✅ UI guides users through troubleshooting
- ✅ System is more resilient to misuse

**Dependencies:** Ticket 14 (Final Review)

---

**Total Tickets:** 15  
**Priority Order:** 1-14 are required for MVP, Ticket 15 is optional enhancement  
**Estimated Completion:** Sequential dependency chain, each ticket builds on previous
