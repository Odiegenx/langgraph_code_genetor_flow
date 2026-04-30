# Architecture: Ollama Chat UI

## 1. Overview

Ollama Chat UI is a single-page, static web application that replicates core ChatGPT-style functionality using locally-hosted Ollama models. It is built with vanilla HTML, CSS, and JavaScript with no frameworks or build steps. The application features multi-conversation management, dual-model routing (text vs. image), and localStorage persistence.

## 2. Component Decomposition & Responsibilities

### `index.html` (Structure)

- Defines the static semantic structure of the application: sidebar, chat area, and input area.
- Declares all required element IDs used as mounting points for dynamic DOM manipulation.
- Links external stylesheets and JS modules. Contains no application logic.

### `styles.css` (Presentation)

- Provides all visual styling for the ChatGPT-like experience.
- Defines layouts for the sidebar, message bubbles, and input controls.
- Covers all required element IDs and CSS class selectors used dynamically by JavaScript.

### `app.js` (Application Logic & State)

- **State Management**: Manages an array of conversation objects in memory and persists them to `localStorage`.
- **DOM Manipulation**: Dynamically creates and renders sidebar items (`.conversation-item`) and chat messages (`.message`).
- **Event Handling**: Listens for user interactions (send, paste, drop, sidebar CRUD) and orchestrates the response flow.
- **Input Control**: Manages image preview state, clears inputs, and disables the send button during API requests.

### `ollama.js` (API Communication)

- **Model Routing**: Inspects the request for image attachments to route to `minicpm-v:latest` (image) or `qwen3:8b` (text).
- **API Request**: Formats the full conversation history into the Ollama `/api/chat` payload structure, handling multimodal content arrays for image messages.
- **API Response**: Calls the Ollama endpoint with `stream: false` and returns the complete AI response string.

### `validate_site.js` (Development Tool)

- Offline validation script ensuring HTML IDs, CSS selectors, JS function signatures, and API contracts adhere to the generation contract.

## 3. Data Model

### Conversation Object

```json
{
  "id": "string (unique)",
  "name": "string",
  "messages": [
    {
      "role": "user | assistant",
      "content": "string | array (multimodal)"
    }
  ]
}
```

- **Text `content`**: Plain string (e.g., `"Hello"`).
- **Multimodal `content`**: Array of content parts (e.g., `[{"type": "text", "text": "..."}, {"type": "image_url", "image_url": {"url": "data:image/...;base64,..."}}]`).

### Persistence

- **Storage Key**: `ollama-chat-conversations`
- **Format**: Serialized JSON array of Conversation Objects.

## 4. Dataflow

### Message Send Flow

1. **Input**: User types text and optionally attaches an image (paste/drop) into `#message-input`.
2. **Validation**: `app.js` checks for non-empty input; disables `#send-btn`.
3. **State Update**: User message is appended to the active conversation's history; DOM is updated.
4. **API Call**: `app.js` invokes `sendChatRequest(fullHistory, imageBase64)`.
5. **Routing & Formatting**: `ollama.js` selects the model and formats the last user message into a multimodal array if an image is present.
6. **Network**: `POST http://localhost:11434/api/chat` with `{model, messages, stream: false}`.
7. **Response**: `ollama.js` receives the full response and resolves the Promise with the content string.
8. **State Update**: `app.js` appends the AI message to history, saves to `localStorage`, renders the new AI message bubble, and re-enables `#send-btn`.

### Conversation Management Flow

1. **Create**: Generate unique ID, push new conversation object, save, switch active context.
2. **Switch**: Update active ID, call `renderSidebar()` (apply `.active`), call `renderMessages()` (display correct history).
3. **Rename/Delete**: Mutate conversation array, save, re-render sidebar. If active conversation is deleted, switch to the first available or create a new one.

## 5. API Integration Contract

- **Endpoint**: `http://localhost:11434/api/chat`
- **Method**: POST
- **Payload**:
  ```json
  {
    "model": "qwen3:8b | minicpm-v:latest",
    "messages": [ /* full history */ ],
    "stream": false
  }
  ```
- **Model Selection Logic**: `imageBase64 ? 'minicpm-v:latest' : 'qwen3:8b'`

## 6. Constraints

- **No Frameworks**: Vanilla JS/CSS/HTML only; no React, Vue, build tools, or bundlers.
- **No Streaming**: Responses must be returned and displayed all at once (`stream: false`).
- **Full Context**: The entire conversation history must be sent to Ollama on every request to maintain multi-turn context.
- **Local Only**: All API communication targets `localhost:11434`. No external cloud APIs or authentication services.
- **Single Image Limit**: Only one image attachment per message is supported in scope.
- **No Markdown Rendering**: AI responses are injected as plain text.
- **Desktop Only**: Layout is optimized for desktop viewing; mobile responsiveness is out of scope.
