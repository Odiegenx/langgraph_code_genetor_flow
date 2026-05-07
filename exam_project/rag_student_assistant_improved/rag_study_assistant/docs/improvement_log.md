# Improvement log

This file tracks improvements made after the initial MVP branch.

Initial MVP branch:

```text
initial-mvp
```

Current improvement branch:

```text
improve-documentation
```

## Log entries

### 2026-05-07: Improved user documentation

Reason:

The improved MVP had working UI improvements, but its documentation was too generic and did not clearly explain the practical RAG workflow.

Change:

Created:

```text
docs/user_guide.md
docs/improvement_log.md
```

Updated:

```text
README.md
docs/runbook.md
```

The documentation now explains:

- where to add study files
- what ingestion means
- how to use the `Re-ingest documents` button
- how `documents/` becomes `index/chunks.json`
- how the 4T prompt is used
- how to run the app from this repository structure on Windows
- how to troubleshoot Ollama `401 Unauthorized`
- how to troubleshoot Ollama timeouts

Expected benefit:

- Makes the MVP easier to run from a clean pull.
- Makes the RAG flow easier to explain at exam.
- Connects the UI behavior to the technical files behind it.
