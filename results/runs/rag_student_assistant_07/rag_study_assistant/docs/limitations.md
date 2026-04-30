# Limitations of the Local RAG Study Assistant

This document outlines the known limitations of the Local RAG Study Assistant. These constraints are intentional design choices made to maintain simplicity, local operation, and ease of use for students preparing for exams.

## 1. Retrieval Capabilities

### Keyword-Based Only
- The system uses BM25/TF-IDF for keyword matching, which does not understand semantic meaning.
- Complex or nuanced queries may not retrieve the most relevant content if keywords differ between question and document.

### Limited Context Windows
- Retrieved chunks are limited to a fixed size (default 500 tokens), potentially splitting coherent ideas across multiple fragments.
- Context beyond retrieved snippets is not considered during answer generation.

## 2. Language Model Constraints

### Local Model Dependency
- Requires Ollama running locally with a compatible model (`qwen3:8b` recommended).
- Performance depends on the capabilities of the selected model and available system resources.

### No Fine-Tuning
- The system cannot adapt or improve its responses based on user feedback or domain-specific training.

## 3. Document Processing Limits

### Supported Formats Only
- Ingests only TXT, MD, and PDF files.
- Other formats (e.g., DOCX, PPTX) must be converted prior to ingestion.

### PDF Quality Sensitivity
- PDF parsing relies on `pypdf`, which may struggle with scanned documents or non-standard encodings.

## 4. User Interface Limitations

### Single-User & Stateless
- No persistent user sessions or history tracking.
- Each interaction is independent; no learning from past queries.

### No Advanced Interactions
- Does not support features like auto-complete, query suggestions, or multi-turn conversations.

## 5. Scalability & Resource Usage

### Memory Constraints
- Entire document index is loaded into memory at runtime.
- Large document sets may cause high memory usage or slow retrieval times.

### No Parallel Ingestion
- Document processing occurs sequentially; ingestion time scales linearly with number and size of documents.

## 6. Deployment Scope

### Local Execution Only
- Designed for individual, local use.
- Not optimized for network access, concurrent users, or remote hosting scenarios.

### No Authentication or Security Layers
- Lacks any form of access control or data encryption.
- Should not be exposed directly to untrusted networks.

## 7. Error Handling

### Graceful Degradation Only
- When components fail (e.g., Ollama unreachable), the system shows an error but does not attempt self-repair.

### Minimal Logging
- Basic logging is included for debugging, but lacks detailed analytics or audit trails.

---

These limitations reflect the trade-off between functionality and simplicity in favor of accessibility for educational purposes. For more advanced needs, consider integrating enterprise-grade RAG systems or cloud-based AI services.
