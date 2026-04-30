import os
import json
import requests
from typing import Dict, Any, Tuple

OLLAMA_API_URL = "http://localhost:11434/api/chat"
DEFAULT_MODEL = "qwen3:8b"

def get_model() -> str:
    return os.getenv("OLLAMA_MODEL", DEFAULT_MODEL)

def ask_ollama(prompt: str) -> Tuple[str, float]:
    """
    Send prompt to Ollama API and return answer and confidence.
    Returns: (answer_text, confidence_score)
    """
    payload = {
        "model": get_model(),
        "messages": [{"role": "user", "content": prompt}],
        "stream": False,
        "options": {
            "temperature": 0.2
        }
    }

    try:
        response = requests.post(OLLAMA_API_URL, json=payload, timeout=120)
        response.raise_for_status()
        data = response.json()
        answer = data.get("message", {}).get("content", "").strip()
        return answer, 0.95  # Static confidence for now
    except requests.exceptions.ConnectionError:
        return "[Error] Cannot connect to Ollama. Please ensure it is running.", 0.0
    except Exception as e:
        return f"[Error] {str(e)}", 0.0
