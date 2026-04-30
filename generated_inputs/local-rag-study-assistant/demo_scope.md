# Demo Scope: Local RAG Study Assistant

## Included in MVP

✅ **Core RAG Pipeline**
- Document ingestion for TXT, MD, PDF files
- Simple keyword-based retrieval (BM25/TF-IDF)
- Local Ollama integration with qwen3:8b default
- 4T prompt engineering implementation
- Source citation display

✅ **Web Interface**
- Single-page application with question input
- Answer display area with citations
- Clean, student-focused design
- No authentication or user management

✅ **Documentation**
- Complete setup guide
- Architecture documentation
- Runbook for operation
- Limitations and assumptions

✅ **Validation**
- Structural validation script
- Syntax checking
- File existence checks
- No external API dependencies

## Excluded from MVP

❌ **Advanced Features**
- No vector embeddings (unless simple to implement)
- No multiple user support
- No document editing in UI
- No advanced search filters
- No model fine-tuning

❌ **Infrastructure**
- No Docker containers
- No cloud deployment
- No database persistence
- No user accounts

❌ **Assets**
- No binary images/audio/video
- No external CDN dependencies
- No complex animations

## Demo Success Criteria

1. All required files exist in correct structure
2. 4T prompt template is implemented and used
3. Web app starts locally without errors
4. Ingestion processes sample document
5. UI displays question input and answer output
6. Source citations are visible
7. Documentation is complete and clear
