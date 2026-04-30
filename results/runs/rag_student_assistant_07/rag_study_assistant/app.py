from flask import Flask, request, jsonify, render_template
import os
import json
from rag.ingest import process_documents
from rag.retrieve import retrieve_chunks
from rag.prompt_builder import build_rag_prompt
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

        with open(INDEX_FILE, "r") as f:
            chunks = json.load(f)

        retrieved = retrieve_chunks(question, chunks, k=3)
        prompt = build_rag_prompt(retrieved, question)
        answer_data = ask_ollama(prompt)

        return jsonify({
            "answer": answer_data.get("answer", ""),
            "sources": retrieved
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/ingest", methods=["POST"])
def ingest_documents():
    try:
        result = process_documents(DOCUMENTS_DIR, INDEX_FILE)
        return jsonify({"message": "Ingestion completed", "result": result}), 200
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
