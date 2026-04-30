# Local RAG Study Assistant

A local, browser-based study assistant that uses Retrieval-Augmented Generation (RAG) to answer questions about your course materials using a local LLM.

For a practical explanation of how the program works, where to add study material, and when to run ingestion, see:

```text
docs/user_guide.md
```

## Features

- **Local Processing**: Runs entirely on your machine with no internet required after setup
- **Multiple Formats**: Supports `.txt`, `.md`, and `.pdf` documents
- **Keyword-Based Retrieval**: Uses BM25/TF-IDF for fast, relevant chunk retrieval
- **Source Citations**: Answers include references to original document sections
- **Educational Focus**: Designed specifically for students studying technical topics
- **No External APIs**: Uses local Ollama instance for LLM inference

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Python 3.9 or higher installed
- [Ollama](https://ollama.ai/) installed and running locally
- Basic understanding of command-line interfaces

> ⚠️ Note for Windows users: Make sure Python is added to your PATH environment variable.

## Setup Instructions

### 1. Clone or Download Repository

Place all project files in a directory named `rag_study_assistant`

### 2. Create Virtual Environment (Recommended)

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Start Ollama Service

Make sure Ollama is running and has pulled the default model:

```bash
ollama run qwen3:8b
```

If this is your first time, it will download the model automatically.

### 5. Prepare Your Documents

Place any `.txt`, `.md`, or `.pdf` files into the `documents/` folder.

A sample document `sample_course_notes.md` is already included.

### 6. Ingest Documents

Run the ingestion script once to prepare your documents for querying:

```bash
python rag/ingest.py
```

This generates an index file at `index/chunks.json`

### 7. Start the Application

Launch the web server:

```bash
python app.py
```

By default, the application runs on http://localhost:5000

## Usage

1. Open your browser and navigate to http://localhost:5000
2. Type your question in the input box
3. Click "Ask" to get an AI-generated answer based on your documents
4. View source citations below each answer

Example questions might be:

- What are the key differences between encoder and decoder models?
- How does attention work in transformer architectures?

## Customization

### Changing the Model

Edit `rag/ollama_client.py` to change the `DEFAULT_MODEL` constant.

### Adjusting Chunk Size

Modify parameters in `rag/ingest.py` under the chunking section.

## Troubleshooting

### Common Issues

#### Python Not Found
Ensure Python 3.9+ is installed and accessible from your terminal/command prompt.

#### Ollama Connection Failed
Check that Ollama service is running:

```bash
ollama list
```

#### Empty Answers
Verify that `index/chunks.json` exists and contains data. Re-run `rag/ingest.py` if needed.

#### Import Errors
Ensure you're running scripts from the root project directory (`rag_study_assistant`).

### Validation Script

To check if your setup is correct:

```bash
python validate_project.py
```

Review `site_validation_output.txt` for detailed results.

## Project Structure

```
rag_study_assistant/
├── app.py                    # Main web application
├── rag/
│   ├── ingest.py            # Document processing
│   ├── retrieve.py          # Retrieval logic
│   ├── prompt_builder.py    # 4T prompt construction
│   └── ollama_client.py     # Ollama API client
├── prompts/
│   └── rag_4t_prompt.md     # 4T prompt template
├── documents/
│   └── sample_course_notes.md # Example content
├── index/
│   └── chunks.json          # Generated index
├── static/
│   ├── app.js               # Frontend logic
│   └── styles.css           # Styling
├── templates/
│   └── index.html           # Main page
├── README.md                # Setup guide
├── docs/
│   ├── architecture.md      # System design
│   ├── runbook.md           # Operation guide
│   └── limitations.md       # Known limits
├── validate_project.py      # Validation script
└── requirements.txt         # Dependencies
```

## Contributing

This project is intended as an educational prototype. Contributions are welcome but not actively maintained.

## License

This project is provided as-is for educational purposes with no formal license.
