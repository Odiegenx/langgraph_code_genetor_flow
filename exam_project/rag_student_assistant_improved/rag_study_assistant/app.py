from flask import Flask, request, jsonify, render_template
import os
import json
from datetime import datetime, timezone
from pathlib import Path
from uuid import uuid4
from werkzeug.utils import secure_filename
from rag.ingest import process_documents
from rag.retrieve import score_chunks, load_index
from rag.prompt_builder import PromptBuilder
from rag.ollama_client import ask_ollama, get_model, list_models

app = Flask(__name__)

INDEX_FILE = "index/chunks.json"
DOCUMENTS_DIR = "documents/"
CONVERSATION_DIR = "conversations"
CONVERSATION_INDEX_FILE = os.path.join(CONVERSATION_DIR, "index.json")
CONVERSATION_SESSIONS_DIR = os.path.join(CONVERSATION_DIR, "sessions")
LEGACY_CONVERSATION_FILE = os.path.join(CONVERSATION_DIR, "current_session.json")
SUMMARY_PROMPT_FILE = Path("prompts/summary_prompt.md")
VALID_ANSWER_MODES = {"rag", "model", "hybrid"}
RECENT_MESSAGE_LIMIT = 6
SUMMARY_TRIGGER_MESSAGES = 10
SUMMARY_TIMEOUT_SECONDS = 240
SUMMARY_MAX_CHARS = 6000

def utc_now_iso():
    return datetime.now(timezone.utc).isoformat()

def new_conversation_id():
    return f"{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}_{uuid4().hex[:8]}"

def empty_conversation():
    return {
        "summary": "",
        "archive": [],
        "messages": []
    }

def conversation_file_path(conversation_id):
    safe_id = "".join(
        char for char in str(conversation_id)
        if char.isalnum() or char in {"_", "-"}
    )
    if not safe_id:
        raise ValueError("Invalid conversation id")
    return os.path.join(CONVERSATION_SESSIONS_DIR, f"{safe_id}.json")

def load_conversation_index():
    if not os.path.exists(CONVERSATION_INDEX_FILE):
        return []

    try:
        with open(CONVERSATION_INDEX_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (json.JSONDecodeError, OSError):
        return []

    if not isinstance(data, list):
        return []

    conversations = []
    for item in data:
        if isinstance(item, dict) and item.get("id"):
            conversations.append({
                "id": str(item.get("id")),
                "title": str(item.get("title") or "New conversation"),
                "created_at": str(item.get("created_at") or utc_now_iso()),
                "updated_at": str(item.get("updated_at") or utc_now_iso()),
                "archived": bool(item.get("archived", False)),
                "archived_at": str(item.get("archived_at") or "")
            })
    return conversations

def visible_conversations():
    return [
        item for item in load_conversation_index()
        if not item.get("archived", False)
    ]

def save_conversation_index(conversations):
    os.makedirs(CONVERSATION_DIR, exist_ok=True)
    with open(CONVERSATION_INDEX_FILE, "w", encoding="utf-8") as f:
        json.dump(conversations, f, indent=2, ensure_ascii=False)

def create_conversation(title="New conversation"):
    conversation_id = new_conversation_id()
    now = utc_now_iso()
    conversations = load_conversation_index()
    conversations.insert(0, {
        "id": conversation_id,
        "title": str(title or "New conversation"),
        "created_at": now,
        "updated_at": now
    })
    save_conversation_index(conversations)
    save_conversation(empty_conversation(), conversation_id)
    return conversations[0]

def ensure_conversation(conversation_id=None):
    conversations = visible_conversations()
    if conversation_id and any(item["id"] == conversation_id for item in conversations):
        return conversation_id

    if conversations:
        return conversations[0]["id"]

    return create_conversation()["id"]

def update_conversation_metadata(conversation_id, title_candidate=None):
    conversations = load_conversation_index()
    now = utc_now_iso()
    updated = False

    for item in conversations:
        if item["id"] != conversation_id:
            continue

        if title_candidate and item.get("title") == "New conversation":
            title = str(title_candidate).strip().replace("\n", " ")
            item["title"] = title[:48] if title else "New conversation"
        item["updated_at"] = now
        updated = True
        break

    if updated:
        conversations.sort(key=lambda item: item.get("updated_at", ""), reverse=True)
        save_conversation_index(conversations)

def archive_conversation(conversation_id):
    conversations = load_conversation_index()
    now = utc_now_iso()
    for item in conversations:
        if item["id"] == conversation_id:
            item["archived"] = True
            item["archived_at"] = now
            item["updated_at"] = now
            break

    save_conversation_index(conversations)
    active_conversations = visible_conversations()
    if not active_conversations:
        active_conversations = [create_conversation()]

    return active_conversations

def load_conversation(conversation_id=None):
    conversation_id = ensure_conversation(conversation_id)
    conversation_path = conversation_file_path(conversation_id)
    if not os.path.exists(conversation_path):
        return empty_conversation()

    try:
        with open(conversation_path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (json.JSONDecodeError, OSError):
        return empty_conversation()

    if not isinstance(data, dict):
        return empty_conversation()

    messages = data.get("messages", [])
    if not isinstance(messages, list):
        messages = []

    archive = data.get("archive", [])
    if not isinstance(archive, list):
        archive = []

    return {
        "summary": str(data.get("summary", "")),
        "archive": [
            message for message in archive
            if isinstance(message, dict)
        ],
        "messages": [
            message for message in messages
            if isinstance(message, dict)
        ]
    }

def save_conversation(conversation, conversation_id=None):
    conversation_id = ensure_conversation(conversation_id)
    os.makedirs(CONVERSATION_SESSIONS_DIR, exist_ok=True)
    with open(conversation_file_path(conversation_id), "w", encoding="utf-8") as f:
        json.dump(conversation, f, indent=2, ensure_ascii=False)

def clear_conversation_file(conversation_id=None):
    conversation_id = ensure_conversation(conversation_id)
    save_conversation(empty_conversation(), conversation_id)
    update_conversation_metadata(conversation_id)

def append_conversation_message(role, content, conversation_id=None, **metadata):
    conversation_id = ensure_conversation(conversation_id)
    conversation = load_conversation(conversation_id)
    message = {
        "role": role,
        "content": str(content),
        "timestamp": utc_now_iso()
    }
    message.update({
        key: value for key, value in metadata.items()
        if value is not None
    })
    conversation.setdefault("archive", [])
    conversation.setdefault("messages", [])
    conversation["messages"].append(message)
    save_conversation(conversation, conversation_id)
    update_conversation_metadata(
        conversation_id,
        title_candidate=content if role == "user" else None
    )
    return conversation

def conversation_response(conversation, conversation_id=None):
    response = dict(conversation)
    response["conversation_id"] = conversation_id
    response["archive"] = list(conversation.get("archive", []))
    response["messages"] = list(conversation.get("messages", []))
    response["summary_trigger_messages"] = SUMMARY_TRIGGER_MESSAGES
    response["active_message_count"] = len(response["messages"])
    response["archive_message_count"] = len(response["archive"])
    return response

def recent_prompt_messages(conversation, limit=6):
    messages = conversation.get("messages", [])
    return [
        {
            "role": message.get("role", "user"),
            "content": str(message.get("content", ""))[:1200]
        }
        for message in messages[-limit:]
        if isinstance(message, dict)
    ]

def format_messages_for_summary(messages):
    lines = []
    for message in messages:
        role = str(message.get("role", "user")).title()
        content = str(message.get("content", "")).strip()
        if content:
            lines.append(f"{role}: {content}")
    return "\n".join(lines)

def load_text_file(path):
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def fill_text_template(template, **values):
    output = template
    for key, value in values.items():
        output = output.replace(f"{{{key}}}", str(value))
    return output

def build_summary_prompt(existing_summary, older_messages):
    return fill_text_template(
        load_text_file(SUMMARY_PROMPT_FILE),
        summary_max_chars=SUMMARY_MAX_CHARS,
        existing_summary=existing_summary or "No existing summary.",
        messages_to_merge=format_messages_for_summary(older_messages)
    )

def clamp_summary(summary_text):
    summary = str(summary_text).strip()
    if len(summary) <= SUMMARY_MAX_CHARS:
        return summary

    suffix = "\n[Summary truncated.]"
    trimmed = summary[:SUMMARY_MAX_CHARS - len(suffix)].rstrip()
    return f"{trimmed}{suffix}"

def summarize_if_needed(conversation, model=None, conversation_id=None):
    messages = conversation.get("messages", [])
    if len(messages) <= SUMMARY_TRIGGER_MESSAGES:
        return conversation

    older_messages = messages[:-RECENT_MESSAGE_LIMIT]
    recent_messages = messages[-RECENT_MESSAGE_LIMIT:]
    if not older_messages:
        return conversation

    summary_prompt = build_summary_prompt(
        conversation.get("summary", ""),
        older_messages
    )
    summary_response = ask_ollama(
        summary_prompt,
        model=model,
        timeout=SUMMARY_TIMEOUT_SECONDS
    )
    summary_text = summary_response[0] if isinstance(summary_response, tuple) else summary_response

    if summary_text.startswith("[Error]"):
        return conversation

    summarized_conversation = {
        "summary": clamp_summary(summary_text),
        "archive": conversation.get("archive", []) + older_messages,
        "messages": recent_messages
    }
    save_conversation(summarized_conversation, conversation_id)
    return summarized_conversation
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

        if not question:
            return jsonify({"error": "Question is required"}), 400

        conversation_id = ensure_conversation(data.get("conversation_id"))
        persisted_conversation = summarize_if_needed(
            load_conversation(conversation_id),
            model=selected_model,
            conversation_id=conversation_id
        )
        safe_conversation = recent_prompt_messages(
            persisted_conversation,
            limit=RECENT_MESSAGE_LIMIT
        )
        conversation_summary = persisted_conversation.get("summary", "")
        prompt_builder = PromptBuilder()
        append_conversation_message(
            "user",
            question,
            conversation_id=conversation_id,
            model=selected_model or get_model(),
            answer_mode=answer_mode
        )

        if answer_mode == "model":
            prompt = prompt_builder.build_direct_prompt(
                question,
                conversation=safe_conversation,
                conversation_summary=conversation_summary
            )
            answer = ask_ollama(prompt, model=selected_model)
            answer_text = answer[0] if isinstance(answer, tuple) else answer
            updated_conversation = append_conversation_message(
                "assistant",
                answer_text,
                conversation_id=conversation_id,
                model=selected_model or get_model(),
                answer_mode="model",
                use_rag=False,
                citations=[]
            )
            return jsonify({
                "answer": answer_text,
                "citations": [],
                "model": selected_model or get_model(),
                "answer_mode": "model",
                "use_rag": False,
                "conversation": conversation_response(updated_conversation, conversation_id)
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
                conversation=safe_conversation,
                conversation_summary=conversation_summary
            )
        else:
            prompt = prompt_builder.build_prompt(
                context_chunks,
                question,
                conversation=safe_conversation,
                conversation_summary=conversation_summary
            )
        answer = ask_ollama(prompt, model=selected_model)
        answer_text = answer[0] if isinstance(answer, tuple) else answer

        retrieved = [
            {
                'source': chunk['filename'],
                'page': chunk.get('page', 1),
                'snippet': chunk['content'][:200] + '...'
            }
            for chunk in sorted_chunks
        ]
        updated_conversation = append_conversation_message(
            "assistant",
            answer_text,
            conversation_id=conversation_id,
            model=selected_model or get_model(),
            answer_mode=answer_mode,
            use_rag=True,
            citations=retrieved
        )

        return jsonify({
            "answer": answer_text,
            "citations": retrieved,
            "model": selected_model or get_model(),
            "answer_mode": answer_mode,
            "use_rag": True,
            "conversation": conversation_response(updated_conversation, conversation_id)
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/conversation", methods=["GET"])
def conversation():
    conversation_id = ensure_conversation(request.args.get("conversation_id"))
    conversation_data = load_conversation(conversation_id)
    return jsonify(conversation_response(conversation_data, conversation_id)), 200

@app.route("/conversation/<conversation_id>", methods=["GET"])
def conversation_by_id(conversation_id):
    conversation_id = ensure_conversation(conversation_id)
    conversation_data = load_conversation(conversation_id)
    return jsonify(conversation_response(conversation_data, conversation_id)), 200

@app.route("/conversation/clear", methods=["POST"])
def clear_conversation():
    data = request.get_json(silent=True) or {}
    conversation_id = ensure_conversation(data.get("conversation_id"))
    clear_conversation_file(conversation_id)
    conversation_data = load_conversation(conversation_id)
    return jsonify(conversation_response(conversation_data, conversation_id)), 200

@app.route("/conversation/<conversation_id>/clear", methods=["POST"])
def clear_conversation_by_id(conversation_id):
    conversation_id = ensure_conversation(conversation_id)
    clear_conversation_file(conversation_id)
    conversation_data = load_conversation(conversation_id)
    return jsonify(conversation_response(conversation_data, conversation_id)), 200

@app.route("/conversation/<conversation_id>", methods=["DELETE"])
def archive_conversation_by_id(conversation_id):
    conversations = archive_conversation(conversation_id)
    next_conversation_id = conversations[0]["id"]
    return jsonify({
        "archived_conversation_id": conversation_id,
        "active_conversation_id": next_conversation_id,
        "conversations": conversations
    }), 200

@app.route("/conversation/summarize", methods=["POST"])
def summarize_conversation():
    data = request.get_json(silent=True) or {}
    selected_model = data.get("model", "").strip() or None
    conversation_id = ensure_conversation(data.get("conversation_id"))
    conversation = summarize_if_needed(
        load_conversation(conversation_id),
        model=selected_model,
        conversation_id=conversation_id
    )
    return jsonify(conversation_response(conversation, conversation_id)), 200

@app.route("/conversations", methods=["GET"])
def conversations():
    ensure_conversation()
    return jsonify({
        "conversations": visible_conversations()
    }), 200

@app.route("/conversations", methods=["POST"])
def new_conversation():
    data = request.get_json(silent=True) or {}
    conversation_meta = create_conversation(data.get("title") or "New conversation")
    return jsonify({
        "conversation": conversation_meta,
        "conversations": visible_conversations()
    }), 201
    
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
