import os
import json
import logging
from pathlib import Path
from pypdf import PdfReader

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Constants
DOCUMENTS_DIR = Path("documents")
INDEX_DIR = Path("index")
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
INDEX_FILE = INDEX_DIR / "chunks.json"

def extract_text_from_pdf(file_path):
    """Extract text from a PDF file."""
    try:
        reader = PdfReader(file_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        logger.error(f"Error reading PDF {file_path}: {e}")
        return ""

def extract_text_from_txt(file_path):
    """Extract text from a TXT file."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        logger.error(f"Error reading TXT {file_path}: {e}")
        return ""

def extract_text_from_md(file_path):
    """Extract text from a MD file."""
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        logger.error(f"Error reading MD {file_path}: {e}")
        return ""

def chunk_text(text, chunk_size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    """Split text into overlapping chunks."""
    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start += chunk_size - overlap
    return chunks

def process_documents():
    """Process all supported documents and generate index."""
    if not DOCUMENTS_DIR.exists():
        logger.error("Documents directory does not exist.")
        return

    if not INDEX_DIR.exists():
        INDEX_DIR.mkdir(parents=True, exist_ok=True)

    index_data = []
    chunk_id_counter = 0

    for file_path in DOCUMENTS_DIR.iterdir():
        if file_path.suffix.lower() not in [".txt", ".md", ".pdf"]:
            continue

        logger.info(f"Processing {file_path.name}")

        if file_path.suffix.lower() == ".pdf":
            text = extract_text_from_pdf(file_path)
        elif file_path.suffix.lower() == ".md":
            text = extract_text_from_md(file_path)
        else:
            text = extract_text_from_txt(file_path)

        if not text.strip():
            logger.warning(f"No text extracted from {file_path.name}")
            continue

        chunks = chunk_text(text)
        for i, chunk in enumerate(chunks):
            index_entry = {
                "id": chunk_id_counter,
                "filename": file_path.name,
                "content": chunk,
                "page": i + 1  # Simplified page tracking
            }
            index_data.append(index_entry)
            chunk_id_counter += 1

    # Save index to JSON file
    with open(INDEX_FILE, "w", encoding="utf-8") as f:
        json.dump(index_data, f, indent=2)

    logger.info(f"Index generated with {len(index_data)} chunks.")

def ingest_documents(documents_dir, index_path):
    """Process supported local documents and write a JSON chunk index."""
    documents_path = Path(documents_dir)
    index_file = Path(index_path)
    index_file.parent.mkdir(parents=True, exist_ok=True)

    if not documents_path.exists():
        logger.error("Documents directory does not exist: %s", documents_path)
        return 0

    index_data = []
    chunk_id_counter = 0
    files_processed = 0

    for file_path in documents_path.iterdir():
        if file_path.suffix.lower() not in [".txt", ".md", ".pdf"]:
            continue

        logger.info(f"Processing {file_path.name}")
        if file_path.suffix.lower() == ".pdf":
            text = extract_text_from_pdf(file_path)
        elif file_path.suffix.lower() == ".md":
            text = extract_text_from_md(file_path)
        else:
            text = extract_text_from_txt(file_path)

        if not text.strip():
            logger.warning(f"No text extracted from {file_path.name}")
            continue

        files_processed += 1
        for page, chunk in enumerate(chunk_text(text), start=1):
            index_data.append({
                "id": chunk_id_counter,
                "source": file_path.name,
                "filename": file_path.name,
                "content": chunk,
                "page": page,
                "metadata": {
                    "filename": file_path.name,
                    "page_number": page
                }
            })
            chunk_id_counter += 1

    with open(index_file, "w", encoding="utf-8") as f:
        json.dump(index_data, f, indent=2, ensure_ascii=False)

    logger.info(
        "Index generated with %s chunks from %s files.",
        len(index_data),
        files_processed
    )
    return files_processed

if __name__ == "__main__":
    process_documents()
