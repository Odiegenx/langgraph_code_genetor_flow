from flask import Flask, request, jsonify, render_template
import os
import sys
import json

# Add the rag module to the path
sys.path.append(os.path.join(os.path.dirname(__file__), 'rag'))

from rag.ingest import ingest_documents
from rag.retrieve import retrieve_chunks
from rag.prompt_builder import build_rag_prompt
from rag.ollama_client import ask_ollama

app = Flask(__name__)

INDEX_PATH = os.path.join(os.path.dirname(__file__), 'index', 'chunks.json')
DOCUMENTS_DIR = os.path.join(os.path.dirname(__file__), 'documents')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/ask', methods=['POST'])
def api_ask():
    try:
        data = request.get_json()
        question = data.get('question', '').strip()

        if not question:
            return jsonify({'error': 'Question is required'}), 400

        # Retrieve relevant chunks
        if not os.path.exists(INDEX_PATH):
            return jsonify({'error': 'Index not found. Please run ingestion first.'}), 500

        with open(INDEX_PATH, 'r') as f:
            index_data = json.load(f)

        retrieved_chunks = retrieve_chunks(question, index_data, k=3)

        # Build prompt with context
        context = "\n\n".join([chunk['content'] for chunk in retrieved_chunks])
        prompt = build_rag_prompt(context=context, question=question)

        # Get answer from Ollama
        answer = ask_ollama(prompt)

        # Prepare citations
        citations = []
        for chunk in retrieved_chunks:
            citations.append({
                'source': chunk['source'],
                'page': chunk.get('page', None),
                'snippet': chunk['content'][:200] + '...' if len(chunk['content']) > 200 else chunk['content']
            })

        return jsonify({
            'answer': answer,
            'citations': citations
        }), 200

    except Exception as e:
        app.logger.error(f"Error processing request: {str(e)}")
        return jsonify({'error': 'An internal error occurred'}), 500

@app.route('/api/ingest', methods=['POST'])
def api_ingest():
    try:
        if not os.path.exists(DOCUMENTS_DIR):
            return jsonify({'error': 'Documents directory not found'}), 500

        files_processed = ingest_documents(DOCUMENTS_DIR, INDEX_PATH)
        return jsonify({
            'message': 'Ingestion completed',
            'files_processed': files_processed
        }), 200

    except Exception as e:
        app.logger.error(f"Error during ingestion: {str(e)}")
        return jsonify({'error': 'Failed to process documents'}), 500

if __name__ == '__main__':
    app.run(host='localhost', port=8080, debug=True)
