from flask import Flask, request, jsonify, render_template
import os
import json
from werkzeug.utils import secure_filename
from rag.ingest import process_documents
from rag.retrieve import score_chunks, load_index
from rag.prompt_builder import PromptBuilder
from rag.ollama_client import ask_ollama

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
    app.run(host="0.0.0.0", port=5000, debug=True)
