# Generation Contract: Ollama Chat UI

## Dependencies
- Ollama running locally on `http://localhost:11434` with models `qwen3:8b` and `minicpm-v:latest` installed
- Node.js (for validation script only)
- No npm packages required

## File Ownership

### Worker A Files
- `ollama-chat-ui/index.html` — Static page structure and element IDs
- `ollama-chat-ui/styles.css` — All styling
- `ollama-chat-ui/validate_site.js` — Validation script

### Worker B Files
- `ollama-chat-ui/app.js` — Application logic, DOM manipulation, conversation management
- `ollama-chat-ui/ollama.js` — Ollama API communication

## Element IDs (defined in index.html, referenced in app.js)

| Element | ID |
|---|---|
| Sidebar container | `sidebar` |
| New conversation button | `new-chat-btn` |
| Conversation list container | `conversation-list` |
| Chat area | `chat-area` |
| Messages container | `messages-container` |
| Input area | `input-area` |
| Message text input | `message-input` |
| Image preview container | `image-preview-container` |
| Image preview element | `image-preview` |
| Remove image button | `remove-image-btn` |
| Send button | `send-btn` |

## CSS Classes (defined in styles.css, created dynamically in app.js)

| Class | Purpose |
|---|---|
| `.conversation-item` | Sidebar conversation list item |
| `.conversation-item.active` | Currently selected conversation |
| `.conversation-item-name` | Conversation name text |
| `.conversation-item-actions` | Container for rename/delete buttons |
| `.rename-btn` | Rename conversation button |
| `.delete-btn` | Delete conversation button |
| `.message` | Base message bubble |
| `.user-message` | User message bubble |
| `.ai-message` | AI message bubble |
| `.message-content` | Text content inside a message bubble |
| `.message-image` | Image inside a message bubble |
| `.hidden` | Utility class to hide elements |

## JavaScript API Contract

### ollama.js

```
detectModel(imageBase64) → string
  // Returns 'minicpm-v:latest' if imageBase64 is truthy, 'qwen3:8b' otherwise.

sendChatRequest(messages, imageBase64) → Promise<{content: string}>
  // messages: full conversation history array of {role, content} objects.
  //   For multimodal messages, content is an array of content parts:
  //   [{type: 'text', text: '...'}, {type: 'image_url', image_url: {url: 'data:...'}}]
  //   For text-only messages, content is a plain string.
  // imageBase64: optional base64 data URL string of currently attached image.
  // Calls Ollama POST /api/chat with {model, messages, stream: false}.
  // If imageBase64 is provided, appends an image content part to the last user
  // message and uses minicpm-v:latest model.
  // Returns the AI response content string.
```

### app.js

```
initApp() → void
  // Initializes the app: loads conversations from localStorage, sets up event
  // listeners, renders sidebar, and displays the current conversation.

loadConversations() → void
  // Loads conversation array from localStorage key 'ollama-chat-conversations'.

saveConversations() → void
  // Saves conversation array to localStorage key 'ollama-chat-conversations'.

createNewConversation() → void
  // Creates a new conversation object with a unique ID and default name,
  // adds it to the conversations array, saves, and switches to it.

switchConversation(id) → void
  // Switches active conversation to the one matching id, re-renders sidebar and messages.

renameConversation(id, newName) → void
  // Updates the name of the conversation matching id, saves, re-renders sidebar.

deleteConversation(id) → void
  // Removes the conversation matching id, saves, re-renders sidebar.
  // If deleted conversation was active, switches to the first remaining conversation
  // or creates a new one if none remain.

renderSidebar() → void
  // Clears #conversation-list and dynamically creates .conversation-item elements
  // for each conversation. Marks the active one with .active class.
  // Each item shows the name and rename/delete action buttons.

renderMessages() → void
  // Clears #messages-container and dynamically creates .message elements
  // for each message in the active conversation.
  // User messages get .user-message class, AI messages get .ai-message class.
  // Image messages include an <img> with .message-image class.

handleSendMessage() → void
  // Reads text from #message-input and current image from image preview.
  // If both empty, does nothing.
  // Adds user message to active conversation, renders it, clears input and image preview.
  // Calls sendChatRequest with full message history and optional imageBase64.
  // On response, adds AI message to conversation, saves, and renders it.
  // Disables #send-btn while request is in progress.

handleImagePaste(event) → void
  // Listens for paste events on #message-input.
  // If clipboard contains an image, reads it as base64 data URL and shows preview.

handleImageDrop(event) → void
  // Listens for dragover and drop events on #chat-area.
  // If dropped file is an image, reads it as base64 data URL and shows preview.

removeImage() → void
  // Clears the current image attachment and hides #image-preview-container.

showImagePreview(base64DataUrl) → void
  // Sets #image-preview src to base64DataUrl, shows #image-preview-container
  // by removing .hidden class.
```

## Ollama API Call Format

POST to `http://localhost:11434/api/chat`:
```json
{
  "model": "qwen3:8b",
  "messages": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi there!"},
    {"role": "user", "content": [
      {"type": "text", "text": "What is in this image?"},
      {"type": "image_url", "image_url": {"url": "data:image/png;base64,..."}}
    ]}
  ],
  "stream": false
}
```

## Behavioral Acceptance Criteria

1. User can type a message and click Send (or press Enter) to send it to Ollama.
2. User can paste an image from clipboard; a preview appears before sending.
3. User can drag-and-drop an image onto the chat area; a preview appears.
4. When an image is attached, the request uses `minicpm-v:latest`; otherwise `qwen3:8b`.
5. Full conversation history is sent to Ollama on each request for multi-turn context.
6. User can create a new conversation via the sidebar button.
7. User can rename a conversation via a button on the sidebar item.
8. User can delete a conversation via a button on the sidebar item.
9. Switching conversations displays the correct message history.
10. Conversations persist across page reloads via localStorage.
11. The send button is disabled while an Ollama request is in progress.
12. AI responses are displayed in a distinct styled bubble from user messages.

## Validation Requirements

The validation script (validate_site.js) must verify the following by reading and parsing the source files:

- **HTML structure**: All element IDs listed above exist in index.html.
- **CSS coverage**: All element IDs and CSS classes listed above appear as selectors in styles.css.
- **JS function existence**: All functions listed in the app.js and ollama.js contracts above are defined in their respective files.
- **Element ID wiring**: Element IDs referenced in app.js (via getElementById or querySelector) match those defined in index.html.
- **sendChatRequest signature**: ollama.js defines sendChatRequest accepting a messages parameter (full conversation history), not just a single text string.
- **Model detection**: ollama.js contains logic to select `minicpm-v:latest` when an image is present and `qwen3:8b` otherwise.
- **Ollama endpoint**: ollama.js calls `http://localhost:11434/api/chat` with `stream: false`.
- **Conversation management**: app.js defines createNewConversation, renameConversation, deleteConversation, and switchConversation.
- **Image handling**: app.js defines handleImagePaste and handleImageDrop for image input.
- **localStorage**: app.js references localStorage for conversation persistence.
- **Send button disable**: app.js disables the send button during requests.
- **Dynamic DOM creation**: app.js creates message and sidebar elements dynamically (createElement calls for .message, .conversation-item, etc.).
