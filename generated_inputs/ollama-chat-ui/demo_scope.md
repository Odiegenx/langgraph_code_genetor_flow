# Demo Scope: Ollama Chat UI

## In Scope
- Single-page chat application with sidebar and main chat area
- Multi-conversation management (create, rename, delete, switch)
- Text message input and sending
- Image paste from clipboard and drag-and-drop file input
- Image preview with remove button before sending
- Dual Ollama model routing (qwen3:8b for text, minicpm-v:latest for images)
- Full response display (no streaming)
- localStorage persistence for conversations
- Responsive layout for desktop viewing

## Out of Scope
- Streaming token-by-token responses
- User authentication or accounts
- Ollama model installation or management
- Image generation
- Code execution or sandboxing
- Mobile-responsive design (desktop demo only)
- Markdown rendering in AI responses
- Multiple image attachments in a single message
- Export/import of conversations
