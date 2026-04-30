# Ollama Chat UI

A lightweight, self-contained web interface for chatting with locally-hosted Ollama models. This single-page application mimics the core experience of ChatGPT using vanilla HTML, CSS, and JavaScript—no frameworks, no build steps.

## Features

- 🧠 Multi-turn conversations with full history context
- 🖼️ Image input via paste or drag-and-drop
- 📁 Conversation management (create, rename, delete, switch)
- 💾 Local storage persistence
- 🔄 Automatic model routing (`qwen3:8b` for text, `minicpm-v:latest` for images)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- [Ollama](https://ollama.ai) installed and running on your machine
- Pull the required models:
  ```bash
  ollama pull qwen3:8b
  ollama pull minicpm-v:latest
  ```

## Quick Start

1. Clone or download this repository.
2. Open `index.html` in a modern web browser *OR* serve the directory via a local HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
3. Navigate to `http://localhost:8000` (or file path if opened directly).

## Usage

- Type your message in the input box and press **Enter** or click **Send**.
- To send an image, paste it from your clipboard or drag-and-drop it into the chat area.
- Click the ✏️ icon next to a conversation in the sidebar to rename it.
- Click the 🗑️ icon to delete a conversation.
- Click the **+ New Chat** button to start a fresh conversation.

## File Structure

- `index.html` – Static page structure with all necessary element IDs.
- `styles.css` – Complete styling for a ChatGPT-like desktop UI.
- `app.js` – Core application logic, state management, and DOM manipulation.
- `ollama.js` – Handles communication with the Ollama API, including model selection.
- `validate_site.js` – Offline validation script to verify contract compliance.
