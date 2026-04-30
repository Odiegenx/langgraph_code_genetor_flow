# Deployment Checklist: Ollama Chat UI

## Prerequisites

- [ ] **Node.js** installed (for validation script execution)
- [ ] **Ollama** running locally at `http://localhost:11434`
- [ ] Required Ollama models installed:
  - [ ] `qwen3:8b`
  - [ ] `minicpm-v:latest`
- [ ] Web server configured to serve static files from the `ollama-chat-ui` directory

## Validation Commands

Run these commands in the root of the project directory:

```bash
# Run automated site validation script
node ollama-chat-ui/validate_site.js
```

Expected output: All checks should pass without errors.

## Endpoint & Configuration Notes

- **Ollama API Endpoint:** `http://localhost:11434/api/chat`
- **Streaming Disabled:** All requests use `stream: false`
- **Model Routing Logic:**
  - Text-only messages → routed to `qwen3:8b`
  - Messages with images → routed to `minicpm-v:latest`
- **Persistence Mechanism:** Uses browser `localStorage` under key `'ollama-chat-conversations'`

## Local-Only Security Assumptions

- [ ] This application is intended for **local development/demo purposes only**
- [ ] No user authentication or session management is implemented
- [ ] No network exposure beyond localhost is assumed or supported
- [ ] Clipboard and file system access are limited to client-side browser APIs
- [ ] No input sanitization or sandboxing for code/images beyond standard browser protections
