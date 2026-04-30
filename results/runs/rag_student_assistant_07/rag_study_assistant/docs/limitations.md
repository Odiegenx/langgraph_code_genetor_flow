# Limitations: Local RAG Study Assistant

## Technical Constraints

- **Model Dependency**: Requires Ollama with `qwen3:8b` running locally; no fallback behavior if unavailable
- **Retrieval Method**: Uses basic keyword matching (BM25-style) rather than semantic embeddings
- **Single-user Scope**: Not designed for concurrent usage or multi-session environments
- **No Editing UI**: Documents must be manually added to `/documents` before ingestion
- **Static Indexing**: Re-indexing required when new content is added

## Functional Boundaries

- **Supported Formats**: Only `.txt`, `.md`, and `.pdf` are parsed
- **Response Quality**: Answers may vary based on prompt clarity and indexed content relevance
- **Citation Accuracy**: Source attribution depends on chunk-level metadata accuracy
- **Language Support**: Primarily optimized for English-language technical materials

## Scalability Notes

- Performance degrades as number of indexed documents increases due to linear search
- Memory usage scales with total indexed content size
- No caching mechanism between queries

## Documentation Gaps

- Advanced customization requires code-level understanding
- No automated tests included
- Deployment instructions assume developer familiarity with Python/Flask

## Future Improvements

Consider upgrading to vector-based retrieval and persistent storage for enhanced performance.
