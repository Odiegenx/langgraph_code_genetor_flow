# Feature roadmap

This file captures potential improvements for the Local RAG Study Assistant.

The goal is to preserve ideas for later without expanding the MVP too much at once.

## Current MVP focus

The core product is still:

```text
Local RAG Study Assistant
  -> add local study documents
  -> ingest documents
  -> ask questions
  -> retrieve relevant chunks
  -> answer with sources
  -> choose Ollama model
  -> optionally disable RAG
```

Future features should support explaining or demonstrating this flow.

## High-priority ideas

### 1. Answer mode badge

Show the active answer mode above the answer:

```text
Mode: RAG ON
Model: qwen3:8b
```

If RAG is disabled:

```text
Mode: Model only
Model: glm-4.6:cloud
```

Why it is useful:

- makes demos easier to explain
- makes the selected model visible
- makes it clear whether sources were used

### 2. Indexed document overview

Show what is currently indexed:

- document filenames
- number of chunks
- whether `index/chunks.json` exists
- maybe last modified time

Why it is useful:

- makes the RAG pipeline visible
- helps users understand when they need to re-ingest
- helps debugging when sources do not match expectations

### 3. Compare RAG vs no-RAG

Let the user ask one question and compare:

```text
RAG answer
Model-only answer
```

Why it is useful:

- demonstrates the value of RAG clearly
- shows how document-grounded answers differ from general model knowledge
- strong exam/demo feature

Risk:

- doubles model calls
- can increase latency and timeout risk

## Hybrid answer mode

Status:

```text
Implemented in branch implement-hybrid-mode
```

Add a third answer mode:

```text
RAG only
Model only
Hybrid
```

### RAG only

The model must answer only from retrieved documents.

Best for:

- syllabus-grounded answers
- reducing hallucinations
- exam-relevant study support

### Model only

The model ignores local documents and answers from its own knowledge.

Best for:

- comparison
- fallback when no documents are indexed
- showing why RAG matters

### Hybrid

The model uses retrieved context as the primary source, but may supplement with general model knowledge.

Important requirement:

The answer must clearly separate the two:

```text
Based on your documents:
...

Additional model knowledge:
...

Sources:
...
```

The model must not invent citations for general model knowledge.

Why it is useful:

- can produce richer explanations
- keeps local document grounding visible
- shows a realistic tradeoff between strict RAG and general assistant behavior

Risk:

- less strict than pure RAG
- can blur the line between course material and model knowledge if not clearly formatted

## Medium-priority ideas

### Source detail expand/collapse

Make source snippets collapsible.

Why it is useful:

- keeps UI cleaner
- still allows source inspection

### Prompt preview

Show the final prompt/context sent to the model.

Why it is useful:

- strong technical explanation feature
- makes 4T prompt engineering visible

Risk:

- can make UI feel complex
- prompt may be long

### Demo/acceptance test document

Create a document with fixed demo scenarios:

```text
1. Start Ollama
2. Start app
3. Re-ingest documents
4. Ask with RAG on
5. Ask with RAG off
6. Switch model
7. Show sources
```

Why it is useful:

- helps exam preparation
- gives a repeatable manual acceptance test
- documents what the MVP is expected to do

## Recommended next feature

Next time, start with one of these:

```text
Answer mode badge
```

or:

```text
Indexed document overview
```

These are small, low-risk, and improve the demo without changing the core architecture.
