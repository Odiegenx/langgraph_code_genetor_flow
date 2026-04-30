import json
import os
import re
from collections import defaultdict
class SimpleRetriever:
    def __init__(self, index_path='index/chunks.json'):
        self.index_path = index_path
        self.chunks = []
        self.load_index()
    
def load_index(self):
        """Load the JSON index into memory"""
        if os.path.exists(self.index_path):
            try:
                with open(self.index_path, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    self.chunks = data.get('chunks', [])
            except (json.JSONDecodeError, IOError) as e:
                print(f"Error loading index: {e}")
                self.chunks = []
        else:
            print("Index file not found.")
            self.chunks = []
    
def preprocess_text(self, text):
        """Basic preprocessing for keyword extraction"""
        return re.findall(r'\b\w+\b', text.lower())
    
def get_term_frequencies(self, terms):
        """Calculate term frequencies"""
        freq = defaultdict(int)
        for term in terms:
            freq[term] += 1
        return freq
    
def calculate_relevance_score(self, query_terms, chunk_text):
        """Calculate relevance score based on term frequency matching"""
        chunk_terms = self.preprocess_text(chunk_text)
        chunk_freq = self.get_term_frequencies(chunk_terms)
        score = 0
        for term in query_terms:
            score += chunk_freq.get(term, 0)
        return score
    
def retrieve(self, query, top_k=3):
        """Retrieve top-k relevant chunks based on keyword matching"""
        if not self.chunks:
            return []
        query_terms = self.preprocess_text(query)
        scored_chunks = []
        for chunk in self.chunks:
            text = chunk.get('text', '')
            score = self.calculate_relevance_score(query_terms, text)
            if score > 0:
                scored_chunks.append({
                    'id': chunk.get('id'),
                    'text': text,
                    'source_file': chunk.get('source_file'),
                    'chunk_index': chunk.get('chunk_index'),
                    'score': score
                })
        # Sort by score descending
        scored_chunks.sort(key=lambda x: x['score'], reverse=True)
        return scored_chunks[:top_k]
