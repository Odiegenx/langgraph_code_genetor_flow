from flask import Flask, request, jsonify, render_template
import os
import json
from datetime import datetime, timezone
from rag.ingest import process_documents
from rag.retrieve import score_chunks, load_index
from rag.prompt_builder import PromptBuilder
from rag.ollama_client import ask_ollama, get_model, list_models

app = Flask(__name__)

INDEX_FILE = "index/chunks.json"
DOCUMENTS_DIR = "documents/"
CONVERSATION_DIR = "conversations"
CONVERSATION_FILE = os.path.join(CONVERSATION_DIR, "current_session.json")
VALID_ANSWER_MODES = {"rag", "model", "hybrid"}
RECENT_MESSAGE_LIMIT = 6
SUMMARY_TRIGGER_MESSAGES = 10
SUMMARY_TIMEOUT_SECONDS = 240

def utc_now_iso():
    return datetime.now(timezone.utc).isoformat()

def empty_conversation():
    return {
        "summary": "",
        "messages": []
    }

def load_conversation():
    if not os.path.exists(CONVERSATION_FILE):
        return empty_conversation()

    try:
        with open(CONVERSATION_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
    except (json.JSONDecodeError, OSError):
        return empty_conversation()

    if not isinstance(data, dict):
        return empty_conversation()

    messages = data.get("messages", [])
    if not isinstance(messages, list):
        messages = []

    return {
        "summary": str(data.get("summary", "")),
        "messages": [
            message for message in messages
            if isinstance(message, dict)
        ]
    }

def save_conversation(conversation):
    os.makedirs(CONVERSATION_DIR, exist_ok=True)
    with open(CONVERSATION_FILE, "w", encoding="utf-8") as f:
        json.dump(conversation, f, indent=2, ensure_ascii=False)

def clear_conversation_file():
    save_conversation(empty_conversation())

def append_conversation_message(role, content, **metadata):
    conversation = load_conversation()
    message = {
        "role": role,
        "content": str(content),
        "timestamp": utc_now_iso()
    }
    message.update({
        key: value for key, value in metadata.items()
        if value is not None
    })
    conversation["messages"].append(message)
    save_conversation(conversation)
    return conversation

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

def build_summary_prompt(existing_summary, older_messages):
    return (
        "Summarize this conversation for future context in a local study assistant.\n\n"
        "Preserve:\n"
        "- the user's learning goals\n"
        "- important facts already discussed\n"
        "- unresolved questions\n"
        "- decisions or preferences that matter for future answers\n\n"
        "Rules:\n"
        "- Do not add new facts.\n"
        "- Do not invent sources.\n"
        "- Keep it concise.\n"
        "- This summary is memory only, not evidence.\n\n"
        "Existing summary:\n"
        f"{existing_summary or 'No existing summary.'}\n\n"
        "Messages to merge into the summary:\n"
        f"{format_messages_for_summary(older_messages)}\n\n"
        "Updated summary:"
    )

def summarize_if_needed(conversation, model=None):
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
        "summary": summary_text.strip(),
        "messages": recent_messages
    }
    save_conversation(summarized_conversation)
    return summarized_conversation

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

        persisted_conversation = summarize_if_needed(
            load_conversation(),
            model=selected_model
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
                "conversation": updated_conversation
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
            "conversation": updated_conversation
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/conversation", methods=["GET"])
def conversation():
    conversation_data = load_conversation()
    conversation_data["summary_trigger_messages"] = SUMMARY_TRIGGER_MESSAGES
    return jsonify(conversation_data), 200

@app.route("/conversation/clear", methods=["POST"])
def clear_conversation():
    clear_conversation_file()
    conversation_data = load_conversation()
    conversation_data["summary_trigger_messages"] = SUMMARY_TRIGGER_MESSAGES
    return jsonify(conversation_data), 200

@app.route("/conversation/summarize", methods=["POST"])
def summarize_conversation():
    data = request.get_json(silent=True) or {}
    selected_model = data.get("model", "").strip() or None
    conversation = summarize_if_needed(
        load_conversation(),
        model=selected_model
    )
    conversation["summary_trigger_messages"] = SUMMARY_TRIGGER_MESSAGES
    return jsonify(conversation), 200
    
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
