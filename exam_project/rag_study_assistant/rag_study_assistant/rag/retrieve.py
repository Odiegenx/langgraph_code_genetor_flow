import json
import os
import re
from collections import defaultdict
from math import log

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CHUNKS_INDEX_PATH = os.path.join(BASE_DIR, "index", "chunks.json")
STOP_WORDS = {"the", "is", "at", "which", "on", "and", "or", "a", "an", "in", "to", "of", "for", "with", "by", "from"}

def tokenize(text):
    """Tokenize and normalize text, removing stop words."""
    tokens = re.findall(r'\b\w+\b', text.lower())
    return [token for token in tokens if token not in STOP_WORDS]

def compute_tf_idf_scores(query_tokens, chunks):
    """Compute simple TF-IDF-like scores for chunks against a query."""
    doc_count = max(len(chunks), 1)
    token_doc_freq = defaultdict(int)

    for chunk in chunks:
        unique_tokens = set(tokenize(chunk.get("content", "")))
        for token in unique_tokens:
            token_doc_freq[token] += 1

    scores = []
    for chunk in chunks:
        tf_scores = defaultdict(int)
        for token in tokenize(chunk.get("content", "")):
            tf_scores[token] += 1

        score = 0.0
        for token in query_tokens:
            if token in tf_scores:
                score += tf_scores[token] * log(doc_count / (1 + token_doc_freq[token]))

        scores.append((score, chunk))

    scores.sort(key=lambda item: item[0], reverse=True)
    return scores

def _normalise_chunk(chunk, score=0.0):
    metadata = chunk.get("metadata") or {}
    source = chunk.get("source") or chunk.get("filename") or metadata.get("filename", "unknown")
    page = chunk.get("page") or metadata.get("page_number")
    return {
        "id": chunk.get("id"),
        "source": source,
        "filename": source,
        "page": page,
        "page_number": page,
        "score": round(score, 4),
        "content": chunk.get("content", ""),
        "snippet": chunk.get("content", "")[:250]
    }

def retrieve_chunks(query, index_data, k=3):
    """Retrieve top-k chunks from already-loaded index data."""
    if not query.strip() or not index_data:
        return []

    query_tokens = tokenize(query)
    scored_chunks = compute_tf_idf_scores(query_tokens, index_data)
    return [_normalise_chunk(chunk, score) for score, chunk in scored_chunks[:k]]

class SimpleRetriever:
    def __init__(self):
        self.chunks = []
        self.load_index()

    def load_index(self):
        """Load the preprocessed chunks from JSON index."""
        if not os.path.exists(CHUNKS_INDEX_PATH):
            raise FileNotFoundError(f"Index file not found at {CHUNKS_INDEX_PATH}. Please run ingestion first.")
        with open(CHUNKS_INDEX_PATH, 'r') as f:
            self.chunks = json.load(f)

    def tokenize(self, text):
        """Tokenize and normalize text, removing stop words."""
        return tokenize(text)

    def compute_tf_idf_scores(self, query_tokens):
        """Compute TF-IDF scores for all chunks against the query."""
        return compute_tf_idf_scores(query_tokens, self.chunks)

    def retrieve(self, query, k=3, context_window=100):
        """Retrieve top-k most relevant chunks based on query."""
        if not query.strip():
            return []

        query_tokens = self.tokenize(query)
        scored_chunks = self.compute_tf_idf_scores(query_tokens)

        results = []
        for score, chunk in scored_chunks[:k]:
            result = _normalise_chunk(chunk, score)
            content = result["content"]
            start_idx = max(0, content.lower().find(query_tokens[0]) - context_window // 2) if query_tokens else 0
            result["snippet"] = content[start_idx:start_idx + context_window].strip()
            results.append(result)

        return results

# Convenience function for easy access
def retrieve_context(query, k=3):
    retriever = SimpleRetriever()
    return retriever.retrieve(query, k=k)
