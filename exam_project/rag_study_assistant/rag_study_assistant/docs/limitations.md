# Limitations: Local RAG Study Assistant

## Scope Restrictions

This MVP version excludes several features typically found in enterprise systems:

- No support for vector embeddings or semantic search
- No multi-user or collaborative functionality
- No persistent storage beyond local JSON files
- No document editing capabilities in UI
- No advanced filtering or faceted search options

## Performance Constraints

- Retrieval uses basic keyword matching (BM25), not semantic similarity
- Indexing large documents may take time due to chunking overhead
- Response latency depends heavily on local Ollama performance
- Memory usage scales linearly with number of indexed chunks

## Dependency Limitations

- Requires manual installation of Python 3.9+
- Ollama must be pre-installed and maintained separately
- Only tested with `qwen3:8b`; other models may behave differently
- Does not auto-install missing system packages

## Security Notes

- Entirely local-first design – no internet exposure by default
- No encryption of stored data or communications
- UI does not sanitize inputs strictly – avoid malicious payloads
- Assumes trusted local user environment

## Future Expansion Opportunities

While out of scope for this release, future versions could add:
- Sentence-transformer based embedding retrieval
- SQLite or LiteFS for structured indexing
- User-specific document collections
- Streaming response updates in UI
