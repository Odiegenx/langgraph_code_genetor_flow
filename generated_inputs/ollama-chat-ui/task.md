# Task: Ollama Chat UI

Build a static website that replicates the core ChatGPT experience using locally-hosted Ollama models.

## Core Features

1. **Chat Interface**: A conversational UI with user and AI message bubbles, similar to ChatGPT's layout.
2. **Dual Model Routing**: Automatically use `qwen3:8b` for text-only messages and `minicpm-v:latest` when an image is attached.
3. **Multi-Conversation Sidebar**: Full sidebar supporting create, rename, and delete of named conversations, with conversation switching.
4. **Image Input**: Support pasting images from clipboard and drag-and-drop. Show an image preview before sending.
5. **Text Input**: Support typing messages and pasting text into the input area.
6. **Full Response**: AI responses are returned all at once (no streaming).
7. **Persistence**: Conversations are saved to and loaded from localStorage.

## Technical Constraints

- Vanilla HTML, CSS, and JavaScript only — no frameworks, no build step.
- All Ollama communication goes through `http://localhost:11434/api/chat`.
- The full conversation message history must be sent to Ollama on each request for multi-turn context.
- Image attachments are sent as base64-encoded data in the Ollama message content array.
- No external APIs or cloud services.
