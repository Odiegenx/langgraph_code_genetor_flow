from flask import Flask, request, jsonify, render_template
import os
import json
from werkzeug.utils import secure_filename
from rag.ingest import process_documents
from rag.retrieve import score_chunks, load_index
from rag.prompt_builder import PromptBuilder
from rag.ollama_client import ask_ollama, get_model, list_models

app = Flask(__name__)

INDEX_FILE = "index/chunks.json"
DOCUMENTS_DIR = "documents/"
ALLOWED_EXTENSIONS = {'txt', 'pdf', 'docx'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

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

        question = data.get("question", "")
        if not isinstance(question, str):
            return jsonify({"error": "Question must be a string"}), 400
        question = question.strip()

        raw_use_rag = data.get("use_rag", True)
        if isinstance(raw_use_rag, bool):
            use_rag = raw_use_rag
        elif isinstance(raw_use_rag, str):
            normalized_use_rag = raw_use_rag.strip().lower()
            if normalized_use_rag in ("true", "1", "yes", "on"):
                use_rag = True
            elif normalized_use_rag in ("false", "0", "no", "off"):
                use_rag = False
            else:
                return jsonify({"error": "use_rag must be a boolean"}), 400
        else:
            return jsonify({"error": "use_rag must be a boolean"}), 400

        if not question:
            return jsonify({"error": "Question is required"}), 400

        if not use_rag:
            prompt_builder = PromptBuilder()
            prompt = prompt_builder.build_direct_prompt(question)
            answer = ask_ollama(prompt, model=selected_model)
            return jsonify({
                "answer": answer[0] if isinstance(answer, tuple) else answer,
                "citations": [],
                "model": selected_model or get_model(),
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

        prompt_builder = PromptBuilder()
        prompt = prompt_builder.build_prompt(context_chunks, question)
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

@app.route("/upload", methods=["POST"])
def upload_files():
    try:
        # Ensure documents directory exists
        os.makedirs(DOCUMENTS_DIR, exist_ok=True)
        
        if 'files' not in request.files:
            return jsonify({"error": "No files provided"}), 400
        
        files = request.files.getlist('files')
        uploaded_files = []
        errors = []
        
        for file in files:
            if file.filename == '':
                continue
                
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(DOCUMENTS_DIR, filename)
                
                # Handle duplicate filenames
                counter = 1
                base_name, ext = os.path.splitext(filename)
                while os.path.exists(filepath):
                    filename = f"{base_name}_{counter}{ext}"
                    filepath = os.path.join(DOCUMENTS_DIR, filename)
                    counter += 1
                
                file.save(filepath)
                uploaded_files.append(filename)
            else:
                errors.append(f"File '{file.filename}' has unsupported format")
        
        if uploaded_files:
            message = f"Successfully uploaded {len(uploaded_files)} file(s): {', '.join(uploaded_files)}"
            if errors:
                message += f". Errors: {'; '.join(errors)}"
            return jsonify({"message": message, "uploaded": uploaded_files}), 200
        else:
            return jsonify({"error": f"No valid files uploaded. {'; '.join(errors) if errors else ''}"}), 400
            
    except Exception as e:
        return jsonify({"error": f"Upload failed: {str(e)}"}), 500

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
