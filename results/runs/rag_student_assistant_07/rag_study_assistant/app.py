from flask import Flask, request, jsonify, render_template
import os
import json
from rag.ingest import process_documents
from rag.retrieve import score_chunks, load_index
from rag.prompt_builder import PromptBuilder
from rag.ollama_client import ask_ollama

app = Flask(__name__)

INDEX_FILE = "index/chunks.json"
DOCUMENTS_DIR = "documents/"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask_question():
    data = request.get_json()
    question = data.get("question", "").strip()

    if not question:
        return jsonify({"error": "Question is required"}), 400

    try:
        if not os.path.exists(INDEX_FILE):
            return jsonify({"error": "No index found. Please run ingestion first."}), 400

        chunks = load_index()
        scores = score_chunks(question, chunks)
        
        # Sort chunks by score and take top 3
        sorted_chunks = sorted(chunks, key=lambda c: scores.get(c['chunk_id'], 0), reverse=True)[:3]
        
        # Prepare context for prompt builder
        context_chunks = [
            {
                'content': chunk['content'],
                'source': chunk['filename']
            }
            for chunk in sorted_chunks
        ]
        
        prompt_builder = PromptBuilder()
        prompt = prompt_builder.build_prompt(context_chunks, question)
        answer = ask_ollama(prompt)

        # Format retrieved chunks for citations
        retrieved = [
            {
                'source': chunk['filename'],
                'page': chunk.get('page', 1),
                'snippet': chunk['content'][:200] + '...'
            }
            for chunk in sorted_chunks
        ]

        return jsonify({
            "answer": answer[0] if isinstance(answer, tuple) else answer,
            "citations": retrieved
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/ingest", methods=["POST"])
def ingest_documents():
    try:
        process_documents()
        return jsonify({"message": "Ingestion completed"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/status", methods=["GET"])
def status_check():
    index_exists = os.path.exists(INDEX_FILE)
    docs_exist = os.path.exists(DOCUMENTS_DIR) and any(os.listdir(DOCUMENTS_DIR))
    return jsonify({
        "index_ready": index_exists,
        "documents_available": docs_exist
    }), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
