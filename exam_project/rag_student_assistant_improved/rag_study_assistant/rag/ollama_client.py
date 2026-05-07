import os
import json
import requests
from typing import Dict, Any, Tuple, Union, List

OLLAMA_API_URL = "http://localhost:11434/api/chat"
OLLAMA_TAGS_URL = "http://localhost:11434/api/tags"
DEFAULT_MODEL = "glm-4.6:cloud"

def get_model() -> str:
    return os.getenv("OLLAMA_MODEL", DEFAULT_MODEL)

def list_models() -> List[str]:
    """Return model names available through the local Ollama server."""
    response = requests.get(OLLAMA_TAGS_URL, timeout=10)
    response.raise_for_status()
    data = response.json()
    return sorted(
        model.get("name") or model.get("model")
        for model in data.get("models", [])
        if model.get("name") or model.get("model")
    )

def ask_ollama(prompt: str, model: str = None) -> Union[Tuple[str, float], str]:
    """
    Send prompt to Ollama API and return answer and confidence.
    Returns: (answer_text, confidence_score) or just answer_text
    """
    payload = {
        "model": model or get_model(),
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
        return "[Error] Cannot connect to Ollama. Please ensure it is running."
    except Exception as e:
        return f"[Error] {str(e)}"
