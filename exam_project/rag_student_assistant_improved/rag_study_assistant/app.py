from flask import Flask, request, jsonify, render_template
import os
import json
from rag.ingest import process_documents
from rag.retrieve import score_chunks, load_index
from rag.prompt_builder import PromptBuilder
from rag.ollama_client import ask_ollama, get_model, list_models

app = Flask(__name__)

INDEX_FILE = "index/chunks.json"
DOCUMENTS_DIR = "documents/"
VALID_ANSWER_MODES = {"rag", "model", "hybrid"}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/ask", methods=["POST"])
def ask_question():
    try:
        data = request.get_json(silent=True)
        if not isinstance(data, dict):
            return jsonify({"error": "Request body must be a valid JSON object"}), 400

        selected_model = data.get("model", "").strip() or None
        answer_mode = data.get("answer_mode", "").strip().lower()
        if not answer_mode:
            raw_use_rag = data.get("use_rag", True)
            answer_mode = "rag" if raw_use_rag is not False else "model"

        question = data.get("question", "")
        if not isinstance(question, str):
            return jsonify({"error": "Question must be a string"}), 400
        question = question.strip()

        if answer_mode not in VALID_ANSWER_MODES:
            return jsonify({"error": "answer_mode must be one of: rag, model, hybrid"}), 400

        conversation = data.get("conversation", [])
        if not isinstance(conversation, list):
            return jsonify({"error": "conversation must be a list"}), 400
        safe_conversation = [
            {
                "role": message.get("role", "user"),
                "content": str(message.get("content", ""))[:1200]
            }
            for message in conversation[-6:]
            if isinstance(message, dict)
        ]

        if not question:
            return jsonify({"error": "Question is required"}), 400

        prompt_builder = PromptBuilder()

        if answer_mode == "model":
            prompt = prompt_builder.build_direct_prompt(question, conversation=safe_conversation)
            answer = ask_ollama(prompt, model=selected_model)
            return jsonify({
                "answer": answer[0] if isinstance(answer, tuple) else answer,
                "citations": [],
                "model": selected_model or get_model(),
                "answer_mode": "model",
                "use_rag": False
            }), 200

        if not os.path.exists(INDEX_FILE):
            return jsonify({"error": "No index found. Please run ingestion first."}), 400

        chunks = load_index()
        scores = score_chunks(question, chunks)

        sorted_chunks = sorted(chunks, key=lambda c: scores.get(c['chunk_id'], 0), reverse=True)[:3]

        context_chunks = [
            {
                'content': chunk['content'],
                'source': chunk['filename']
            }
            for chunk in sorted_chunks
        ]

        if answer_mode == "hybrid":
            prompt = prompt_builder.build_hybrid_prompt(
                context_chunks,
                question,
                conversation=safe_conversation
            )
        else:
            prompt = prompt_builder.build_prompt(
                context_chunks,
                question,
                conversation=safe_conversation
            )
        answer = ask_ollama(prompt, model=selected_model)

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
            "citations": retrieved,
            "model": selected_model or get_model(),
            "answer_mode": answer_mode,
            "use_rag": True
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/models", methods=["GET"])
def models():
    try:
        return jsonify({
            "default_model": get_model(),
            "models": list_models()
        }), 200
    except Exception as e:
        return jsonify({
            "default_model": get_model(),
            "models": [get_model()],
            "error": str(e)
        }), 200

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
    port = int(os.getenv("PORT", "5500"))
    app.run(host="0.0.0.0", port=port, debug=True)
