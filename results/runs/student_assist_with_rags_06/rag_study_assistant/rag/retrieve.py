import json
import os
import re
from collections import defaultdict
from math import log

CHUNKS_INDEX_PATH = "index/chunks.json"
STOP_WORDS = {"the", "is", "at", "which", "on", "and", "or", "a", "an", "in", "to", "of", "for", "with", "by", "from"}

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
        tokens = re.findall(r'\b\w+\b', text.lower())
        return [token for token in tokens if token not in STOP_WORDS]

    def compute_tf_idf_scores(self, query_tokens):
        """Compute TF-IDF scores for all chunks against the query."""
        doc_count = len(self.chunks)
        token_doc_freq = defaultdict(int)

        # Calculate document frequencies for each token
        for chunk in self.chunks:
            unique_tokens = set(self.tokenize(chunk["content"]))
            for token in unique_tokens:
                token_doc_freq[token] += 1

        scores = []

        for chunk in self.chunks:
            tf_scores = defaultdict(int)
            content_tokens = self.tokenize(chunk["content"])

            # Term frequency
            for token in content_tokens:
                tf_scores[token] += 1

            score = 0.0
            for token in query_tokens:
                if token in tf_scores:
                    tf = tf_scores[token]
                    idf = log(doc_count / (1 + token_doc_freq[token]))
                    score += tf * idf

            scores.append((score, chunk))

        # Sort by descending score
        scores.sort(key=lambda x: x[0], reverse=True)
        return scores

    def retrieve(self, query, k=3, context_window=100):
        """Retrieve top-k most relevant chunks based on query."""
        if not query.strip():
            return []

        query_tokens = self.tokenize(query)
        scored_chunks = self.compute_tf_idf_scores(query_tokens)

        results = []
        for score, chunk in scored_chunks[:k]:
            # Extract a snippet with surrounding context
            content = chunk["content"]
            start_idx = max(0, content.find(query_tokens[0]) - context_window // 2) if query_tokens else 0
            snippet = content[start_idx:start_idx + context_window].strip()
            results.append({
                "id": chunk["id"],
                "filename": chunk["metadata"]["filename"],
                "page_number": chunk["metadata"].get("page_number"),
                "score": round(score, 4),
                "snippet": snippet,
                "content": chunk["content"]
            })

        return results

# Convenience function for easy access
def retrieve_context(query, k=3):
    retriever = SimpleRetriever()
    return retriever.retrieve(query, k=k)
