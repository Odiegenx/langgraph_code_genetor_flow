import os
import requests
from dotenv import load_dotenv
def get_ollama_response(prompt: str) -> str:
    load_dotenv()
    model = os.getenv('OLLAMA_MODEL', 'qwen3:8b')
    url = 'http://localhost:11434/api/chat'
    payload = {
        'model': model,
        'messages': [{'role': 'user', 'content': prompt}],
        'stream': False
    }
    try:
        response = requests.post(url, json=payload, timeout=30)
        response.raise_for_status()
        return response.json()['message']['content']
    except requests.exceptions.ConnectionError:
        raise Exception('Cannot connect to Ollama. Please ensure it is running.')
    except requests.exceptions.Timeout:
        raise Exception('Request to Ollama timed out. Try again later.')
    except Exception as e:
        raise Exception(f'Ollama request failed: {str(e)}')
