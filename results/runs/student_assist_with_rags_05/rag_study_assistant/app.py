import os
from flask import Flask, render_template, request, jsonify
from dotenv import load_dotenv
import json

def load_env():
    load_dotenv()

load_env()

app = Flask(__name__)

# Import RAG components after env is loaded
from rag.ingest import ingest_documents
from rag.retrieve import retrieve_relevant_chunks
from rag.prompt_builder import build_rag_prompt
from rag.ollama_client import generate_answer_with_ollama

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy", "message": "RAG Study Assistant is running"})

@app.route('/ask', methods=['POST'])
def ask_question():
    try:
        data = request.get_json()
        question = data.get('question', '').strip()
        
        if not question:
            return jsonify({'error': 'Question is required'}), 400
        
        # Retrieve relevant chunks
        relevant_chunks = retrieve_relevant_chunks(question)
        
        # Build prompt with 4T structure
        prompt = build_rag_prompt(relevant_chunks, question)
        
        # Generate answer using Ollama
        answer = generate_answer_with_ollama(prompt)
        
        # Extract citations from chunks
        citations = [
            {
                "source": chunk["source_file"],
                "text": chunk["text"][:100] + "..."
            }
            for chunk in relevant_chunks
        ]
        
        return jsonify({
            "answer": answer,
            "citations": citations
        })
        
    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
