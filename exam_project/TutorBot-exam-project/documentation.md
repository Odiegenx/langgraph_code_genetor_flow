# System Documentation: Local RAG Study Assistant

---

## 1. Overall Architecture

The application is a locally-hosted, retrieval-augmented generation (RAG) system consisting of four distinct layers that work together in a request-response pipeline:

```
┌──────────────────────────────────────────────────────┐
│                    Frontend (SPA)                     │
│          Browser · index.html + app.js               │
└─────────────────────┬────────────────────────────────┘
                      │ HTTP (REST)
┌─────────────────────▼────────────────────────────────┐
│              Flask Application (app.py)               │
│  Routes · Conversation management · Summarization    │
└──────┬───────────────────────────┬───────────────────┘
       │                           │
┌──────▼──────────┐    ┌───────────▼──────────────────┐
│  RAG Pipeline   │    │     Ollama Client             │
│  ingest.py      │    │     ollama_client.py          │
│  retrieve.py    │    │     localhost:11434            │
│  prompt_builder │    └───────────────────────────────┘
└──────┬──────────┘
       │
┌──────▼──────────────────────────────────────────────┐
│               File Storage                           │
│  index/chunks.json · conversations/sessions/*.json  │
└─────────────────────────────────────────────────────┘
```

**Component overview:**

| File | Role |
|---|---|
| `app.py` | Flask server — 11 REST endpoints, conversation lifecycle, auto-summarization |
| `rag/ingest.py` | Parses documents, splits into chunks, writes `chunks.json` |
| `rag/retrieve.py` | TF-IDF scoring over the chunk index |
| `rag/prompt_builder.py` | Loads markdown templates and fills placeholders |
| `rag/ollama_client.py` | HTTP client for Ollama's `/api/chat` endpoint |
| `prompts/*.md` | All prompt templates as plain markdown files |
| `conversations/` | Runtime JSON storage for all conversation sessions |
| `index/chunks.json` | Generated document index |

---

## 2. Local LLM Path

The system communicates with a **locally-running Ollama instance** over plain HTTP. No external API calls are made.

### Request path (`rag/ollama_client.py`)

```
POST http://localhost:11434/api/chat
```

The payload sent on every request:

```json
{
  "model": "<model-name>",
  "messages": [{ "role": "user", "content": "<full prompt>" }],
  "stream": false,
  "options": { "temperature": 0.2 }
}
```

**Key configuration values:**

| Setting | Value | Reason |
|---|---|---|
| Default model | `glm-4.6:cloud` | Overridable via `OLLAMA_MODEL` env var |
| Temperature | `0.2` | Low value keeps answers factual and deterministic |
| Default timeout | `120s` | Allows for slower local hardware |
| Summarization timeout | `240s` | Longer task — summarizing many messages |

### Model selection

The active model is resolved at runtime:

```python
def get_model() -> str:
    return os.getenv("OLLAMA_MODEL", DEFAULT_MODEL)
```

The frontend calls `GET /models` to list all models available on the local Ollama instance (`/api/tags`), allowing the user to switch models without restarting the server.

### Error handling

If Ollama is unreachable, the client returns a plain string starting with `[Error]`:

```python
except requests.exceptions.ConnectionError:
    return "[Error] Cannot connect to Ollama. Please ensure it is running."
```

The Flask layer checks for this prefix and surfaces it to the user rather than raising an exception.

---

## 3. How RAG Is Implemented

RAG is split into two phases: **offline indexing** and **online retrieval**.

### Phase 1 — Document Ingestion (`rag/ingest.py`)

Triggered manually via `POST /ingest` or by running `ingest.py` directly.

1. Iterates over all files in `documents/`
2. Parses supported formats:
   - `.pdf` — extracted with `pypdf.PdfReader`
   - `.txt` / `.md` — read as UTF-8 text
3. Splits extracted text into word-count-based chunks:
   - `CHUNK_SIZE = 500` words per chunk
   - `CHUNK_OVERLAP = 50` words overlap between adjacent chunks
4. Each chunk is stored with metadata:

```json
{
  "chunk_id": "filename_0",
  "filename": "lecture_notes.pdf",
  "page": 1,
  "content": "... chunk text ..."
}
```

5. All chunks are written to `index/chunks.json`.

The overlap ensures that content near a chunk boundary is not lost when only one of the two adjacent chunks is retrieved.

### Phase 2 — Retrieval (`rag/retrieve.py`)

Executed on every `/ask` request.

1. The full chunk index is loaded into memory from `chunks.json`.
2. The user's query is tokenized using `re.findall(r'\b\w+\b', text.lower())`.
3. **TF-IDF scoring** is computed across all chunks:
   - Term Frequency (TF): how often a query term appears in a chunk, normalized by chunk length
   - Inverse Document Frequency (IDF): `log(total_chunks / document_frequency)` — rare terms score higher
   - Final score per chunk: `Σ TF(term, chunk) × IDF(term)` for all query terms
4. Chunks are ranked by score; the top 3 are selected.
5. If TF-IDF fails for any reason, a simple keyword intersection count is used as fallback.

In `app.py`, the top chunks are then formatted as context for the prompt builder:

```python
sorted_chunks = sorted(chunks, key=lambda c: scores.get(c['chunk_id'], 0), reverse=True)[:3]
context_chunks = [{'content': chunk['content'], 'source': chunk['filename']} for chunk in sorted_chunks]
```

---

## 4. How the Parts Connect

The full request lifecycle for a RAG-mode question is:

```
1. Browser sends POST /ask
   { question, answer_mode, conversation_id, model }

2. app.py:
   a. Validates input
   b. Loads conversation history (last 6 messages + summary)
   c. Calls summarize_if_needed() — compresses history if > 10 messages
   d. Appends the user message to the conversation file

3. RAG pipeline:
   a. load_index() reads chunks.json into memory
   b. score_chunks(question, chunks) computes TF-IDF scores
   c. Top 3 chunks selected and formatted

4. PromptBuilder:
   a. Loads rag_4t_prompt.md template
   b. Fills {context} with retrieved chunks (source-labelled)
   c. Fills {question} with the user's query
   d. Appends rag_answer_addendum.md with {conversation_summary}
      and {conversation_history}

5. ask_ollama(prompt, model):
   a. Sends POST to localhost:11434/api/chat
   b. Returns answer text

6. app.py:
   a. Appends assistant message + citations to conversation file
   b. Returns JSON: { answer, citations, model, answer_mode, conversation }

7. Browser renders answer and inline citations
```

### Answer modes and which prompt is used

| Mode | Prompt template | Context injected |
|---|---|---|
| `rag` | `rag_4t_prompt.md` + `rag_answer_addendum.md` | Top 3 retrieved chunks |
| `model` | `direct_answer_prompt.md` | None — model knowledge only |
| `hybrid` | `hybrid_answer_prompt.md` | Top 3 chunks + model supplement |

The mode is selected by the user in the UI and passed in the request body as `answer_mode`.

### Conversation memory

Every conversation is stored as a JSON file under `conversations/sessions/<id>.json` with three fields:

```json
{
  "summary": "...",
  "archive": [...],
  "messages": [...]
}
```

- `messages` — the last N raw messages, sent verbatim in every prompt
- `summary` — a compressed text generated by the LLM when message count exceeds the trigger
- `archive` — older messages moved out of the active window

When a conversation exceeds `SUMMARY_TRIGGER_MESSAGES = 10` messages:

1. The oldest `messages[:-6]` are formatted as plain text
2. A summarization prompt is sent to Ollama with a 240-second timeout
3. The resulting summary is stored; the older messages move to `archive`
4. Only the 6 most recent messages remain in `messages`

This keeps the context injected into every prompt bounded, regardless of how long a conversation runs.

