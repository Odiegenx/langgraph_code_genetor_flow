import os
import json
import hashlib
from pathlib import Path
from typing import List, Dict
import logging

from pypdf import PdfReader

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configuration from environment or defaults
CHUNK_SIZE = int(os.getenv('CHUNK_SIZE', 800))
INDEX_PATH = Path('index/chunks.json')
DOCUMENTS_PATH = Path('documents')

SUPPORTED_EXTENSIONS = {'.txt', '.md', '.pdf'}


def extract_text_from_pdf(file_path: Path) -> str:
    """Extract text from PDF using pypdf."""
    try:
        reader = PdfReader(file_path)
        text = ''
        for page in reader.pages:
            text += page.extract_text() + '\n'
        return text
    except Exception as e:
        logger.error(f"Error reading PDF {file_path}: {e}")
        return ""


def read_text_file(file_path: Path) -> str:
    """Read text from .txt or .md files."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except Exception as e:
        logger.error(f"Error reading file {file_path}: {e}")
        return ""


def chunk_text(text: str, chunk_size: int = CHUNK_SIZE) -> List[str]:
    """Split text into chunks of specified size."""
    if not text.strip():
        return []
    return [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]


def generate_chunk_id(source_file: str, chunk_index: int) -> str:
    """Generate unique ID for each chunk based on source and index."""
    hash_input = f"{source_file}_{chunk_index}"
    return hashlib.sha256(hash_input.encode()).hexdigest()[:16]


def load_existing_index() -> List[Dict]:
    """Load existing index if it exists, otherwise return empty list."""
    if INDEX_PATH.exists():
        try:
            with open(INDEX_PATH, 'r') as f:
                data = json.load(f)
                if isinstance(data, list):
                    return data
        except Exception as e:
            logger.warning(f"Could not load existing index: {e}")
    return []


def save_index(chunks: List[Dict]) -> None:
    """Save chunks to JSON index file."""
    INDEX_PATH.parent.mkdir(exist_ok=True)
    with open(INDEX_PATH, 'w') as f:
        json.dump(chunks, f, indent=2)
    logger.info(f"Index saved with {len(chunks)} chunks")


def process_documents() -> None:
    """Main ingestion function to process all supported files in documents folder."""
    if not DOCUMENTS_PATH.exists():
        logger.error(f"Documents directory does not exist: {DOCUMENTS_PATH}")
        return

    # Load any existing chunks
    indexed_chunks = load_existing_index()
    processed_ids = {chunk['id'] for chunk in indexed_chunks}
    
    # Process each file
    for file_path in DOCUMENTS_PATH.iterdir():
        if file_path.is_file() and file_path.suffix.lower() in SUPPORTED_EXTENSIONS:
            logger.info(f"Processing {file_path.name}...")
            
            # Read content based on extension
            if file_path.suffix.lower() == '.pdf':
                content = extract_text_from_pdf(file_path)
            else:  # .txt or .md
                content = read_text_file(file_path)
            
            if not content.strip():
                logger.warning(f"Empty or unreadable file: {file_path}")
                continue
                
            # Chunk content
            chunks = chunk_text(content)
            
            # Add to index
            for idx, chunk_text_content in enumerate(chunks):
                chunk_id = generate_chunk_id(str(file_path.name), idx)
                if chunk_id not in processed_ids:
                    indexed_chunks.append({
                        'id': chunk_id,
                        'text': chunk_text_content,
                        'source_file': str(file_path.name),
                        'chunk_index': idx
                    })
    
    # Save updated index
    save_index(indexed_chunks)


if __name__ == '__main__':
    process_documents()
