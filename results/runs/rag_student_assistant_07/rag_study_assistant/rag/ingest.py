import os
import json
from pathlib import Path
from typing import List, Dict
import re

from pypdf import PdfReader


DOCUMENTS_DIR = Path("documents")
INDEX_DIR = Path("index")
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50


def extract_text_from_pdf(file_path: Path) -> str:
    """Extract text from a PDF file."""
    try:
        reader = PdfReader(str(file_path))
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return ""


def extract_text_from_md_or_txt(file_path: Path) -> str:
    """Extract text from .md or .txt files."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return ""


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE, overlap: int = CHUNK_OVERLAP) -> List[str]:
    """Split text into overlapping chunks based on word count."""
    words = text.split()
    chunks = []
    start = 0
    while start < len(words):
        end = min(start + chunk_size, len(words))
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        start += chunk_size - overlap
        if start >= len(words):
            break
    return chunks


def process_documents():
    """Process all supported documents in the documents directory."""
    INDEX_DIR.mkdir(exist_ok=True)
    index_file = INDEX_DIR / "chunks.json"

    chunks_with_metadata: List[Dict] = []

    for file_path in DOCUMENTS_DIR.iterdir():
        if file_path.suffix.lower() not in ['.txt', '.md', '.pdf']:
            print(f"Skipping unsupported file type: {file_path}")
            continue

        print(f"Processing {file_path.name}...")

        if file_path.suffix.lower() == '.pdf':
            text = extract_text_from_pdf(file_path)
        else:
            text = extract_text_from_md_or_txt(file_path)

        if not text.strip():
            print(f"No text extracted from {file_path.name}")
            continue

        chunks = chunk_text(text)

        for i, chunk in enumerate(chunks):
            chunks_with_metadata.append({
                "chunk_id": f"{file_path.stem}_{i}",
                "filename": file_path.name,
                "page": 1,  # Simplified; PDF pages could be tracked per chunk
                "content": chunk
            })

    # Save index to JSON
    with open(index_file, 'w', encoding='utf-8') as f:
        json.dump(chunks_with_metadata, f, indent=2)

    print(f"Ingestion complete. Indexed {len(chunks_with_metadata)} chunks.")


if __name__ == "__main__":
    process_documents()
