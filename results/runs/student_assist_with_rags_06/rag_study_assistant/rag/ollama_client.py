import requests
import json
import time

DEFAULT_MODEL = "qwen3:8b"
OLLAMA_API_URL = "http://localhost:11434/api/chat"
TIMEOUT = 30


def send_prompt_to_ollama(prompt: str, model: str = DEFAULT_MODEL) -> str:
    """
    Sends a formatted prompt to the local Ollama API and returns the response.
    
    Args:
        prompt (str): The full prompt string to send.
        model (str): The Ollama model name to use.

    Returns:
        str: The model's response text or an error message.
    """
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": prompt}],
        "stream": False
    }

    try:
        response = requests.post(
            OLLAMA_API_URL,
            headers={"Content-Type": "application/json"},
            data=json.dumps(payload),
            timeout=TIMEOUT
        )
        response.raise_for_status()
        result = response.json()
        return result.get("message", {}).get("content", "").strip()

    except requests.exceptions.ConnectionError:
        return "[Error] Could not connect to Ollama. Please ensure it is running locally."

    except requests.exceptions.Timeout:
        return f"[Error] Request to Ollama timed out after {TIMEOUT} seconds."

    except requests.exceptions.RequestException as e:
        return f"[Error] An issue occurred while contacting Ollama: {str(e)}"

    except json.JSONDecodeError:
        return "[Error] Received invalid response from Ollama."

    except Exception as e:
        return f"[Error] Unexpected error: {str(e)}"
