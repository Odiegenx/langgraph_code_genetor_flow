# User guide: Local RAG Study Assistant

This document explains what the program does, how the RAG part works, where to add study material, and how to run the full flow.

## What the program does

Local RAG Study Assistant is a small web application for asking questions about local study material.

Instead of answering only from the model's general knowledge, the program first searches through local course files. It then sends the most relevant text snippets to a local Ollama model together with the user's question.

The goal is that answers stay grounded in the user's own course material.

## Application flow

The application has four main steps:

1. Add study material to the `documents/` folder.
2. Ingest the documents so they are split into searchable chunks.
3. Ask a question in the web interface.
4. The app retrieves relevant chunks and sends them to Ollama as RAG context.

The flow looks like this:

```text
documents/
  -> rag/ingest.py
  -> index/chunks.json
  -> rag/retrieve.py
  -> prompts/rag_4t_prompt.md
  -> rag/ollama_client.py
  -> answer in browser
```

## Where to add your own information

Add your study files here:

```text
documents/
```

Supported file types:

- `.md`
- `.txt`
- `.pdf`

Example:

```text
documents/
  sample_course_notes.md
  lecture_01_intro_to_llms.pdf
  lecture_02_prompt_engineering.md
  personal_notes.txt
```

After adding or changing files, ingestion must be run again. Otherwise the app will still use the old `index/chunks.json`.

## What ingestion means

Ingestion is the process where the program reads the files in `documents/`, splits them into smaller chunks, and writes those chunks to:

```text
index/chunks.json
```

The app does not search the original files directly during questions. It searches the generated index.

Run ingestion from the project folder:

```powershell
..\..\..\.venv\Scripts\python.exe rag\ingest.py
```

Or use the web app's ingest button if the UI exposes it.

## How retrieval works

When a user asks a question, the app:

1. Loads `index/chunks.json`.
2. Compares the question with the indexed chunks.
3. Selects the most relevant chunks.
4. Builds a prompt using those chunks as context.

The retrieval logic is implemented in:

```text
rag/retrieve.py
```

This prototype uses simple keyword and TF-IDF-style scoring. It is enough for an MVP, but it is not as strong as an embedding/vector database setup.

## How the 4T prompt is used

The prompt template is here:

```text
prompts/rag_4t_prompt.md
```

It uses the 4T prompt engineering structure:

- Traits: how the assistant should behave.
- Task: what the assistant must do.
- Tone: how the answer should be written.
- Target: who the answer is for.

The app inserts two dynamic values into the prompt:

```text
{context}
{question}
```

`{context}` is filled with retrieved chunks from the study material.

`{question}` is filled with the user's question from the web interface.

## How to run the app

Start Ollama first:

```powershell
$env:OLLAMA_HOST="127.0.0.1:11434"
ollama serve
```

Then start the web app from this folder:

```powershell
cd "C:\Users\pf\Desktop\Skole\LLM for Developers\LLM\mandetory1\Mandatory-1 real\exam project\rag_study_assistant\rag_study_assistant"
..\..\..\.venv\Scripts\python.exe app.py
```

Open the app in a browser:

```text
http://localhost:5000
```

## How to validate the project

Run:

```powershell
..\..\..\.venv\Scripts\python.exe validate_project.py
```

Expected result:

```text
ALL VALIDATIONS PASSED
```

The validation checks:

- required files exist
- the 4T prompt exists and contains the required sections
- Python modules can be imported

## Important files

- `app.py`: Flask web app and API routes.
- `documents/`: where the user's study material is placed.
- `rag/ingest.py`: reads documents and creates the chunk index.
- `index/chunks.json`: generated searchable RAG index.
- `rag/retrieve.py`: finds relevant chunks for a question.
- `rag/prompt_builder.py`: inserts question and context into the 4T prompt.
- `rag/ollama_client.py`: sends the final prompt to local Ollama.
- `prompts/rag_4t_prompt.md`: 4T prompt template.
- `validate_project.py`: local validation script.

## When to re-ingest

Run ingestion again when:

- a new file is added to `documents/`
- a file in `documents/` is edited
- a file is deleted from `documents/`
- the chunking logic in `rag/ingest.py` changes

If ingestion is not rerun, the app may answer from outdated information.

## Current MVP limitations

- Retrieval is keyword-based, not embedding-based.
- PDF extraction depends on whether the PDF contains selectable text.
- The app expects Ollama to run locally on `http://localhost:11434`.
- The default model is configured in `rag/ollama_client.py`.
- The quality of answers depends heavily on the quality of the documents in `documents/`.

## Troubleshooting: Ollama 401 Unauthorized

If the app can find sources but the answer says:

```text
[Error] An issue occurred while contacting Ollama: 401 Client Error: Unauthorized
```

then the RAG part is working, but the selected Ollama model requires authentication.

This usually happens when `DEFAULT_MODEL` in `rag/ollama_client.py` is set to an Ollama cloud model.

Fix:

```powershell
ollama signin
```

Then restart the Flask app.

If you want to avoid Ollama cloud authentication, use a local model instead. Check available local models with:

```powershell
ollama list
```
