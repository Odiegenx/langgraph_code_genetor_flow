# Architecture — chatgpt-clone

## 1. Component Decomposition

| Component | Owner | File(s) | Role |
|---|---|---|---|
| **Page Shell** | Worker A | `index.html` | Semantic HTML5 scaffold, CDN script/CSS links, element IDs matching integration contract |
| **Stylesheet** | Worker A | `styles.css` | Flexbox chat layout, message bubbles, modal overlay, image previews, code block theming |
| **App Logic** | Worker B | `app.js` | All runtime behavior: API calls, streaming, markdown, image handling, settings, event wiring |
| **Validator** | Worker B | `validate_site.js` | Node.js script checking behavioral acceptance criteria |

### Sub-components within `app.js`

| Sub-component | Responsibility |
|---|---|
| **Settings Manager** | Read/write `openai_api_key` in localStorage; open/close modal |
| **Message Builder** | Construct user/assistant DOM nodes with correct classes and content |
| **Image Handler** | Clipboard paste extraction, file upload via hidden input, FileReader → base64, preview with remove |
| **API Client** | Build OpenAI request payload (text + image_url parts), send with `stream: true`, process SSE via ReadableStream |
| **Stream Renderer** | Append tokens to assistant message-content div, call `marked.parse()` on updated text, auto-scroll |
| **Code Highlighter** | After stream ends, find `<code>` blocks in assistant message and call `hljs.highlightElement()` |
| **Error Handler** | Catch 401/429/500/network errors, render `error-message` div in chat |

---

## 2. Responsibilities

### Worker A — Frontend Structure & Styling
- Semantic HTML5 with ARIA labels on all interactive elements
- Flexbox column layout: scrollable `chat-messages` (flex-grow) + fixed-bottom input area
- User messages: right-aligned, distinct background
- Assistant messages: left-aligned, distinct background
- Settings modal: centered overlay, semi-transparent backdrop
- Image preview: thumbnail with remove button
- Code blocks: monospace font, distinct background
- Load highlight.js theme CSS before `app.js`

### Worker B — Application Logic & Interaction
- API key stored **only** in localStorage, sent **only** to `api.openai.com`
- Streaming via ReadableStream processing SSE chunks
- Markdown via `marked.parse()`, highlighting via `hljs.highlightElement()` post-insertion
- Image paste from `clipboardData.items` (image/*), file upload from hidden `<input type="file" accept="image/*">`
- Images read with `FileReader.readAsDataURL()`, sent as `image_url` content parts
- User-visible error messages for all API/network failures
- Send button disabled + loading state during response
- Image preview cleared after send
- Auto-scroll on every token

---

## 3. Dataflow

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Single Page)                     │
│                                                                  │
│  ┌──────────┐    paste/upload     ┌──────────────┐               │
│  │ Clipboard │ ──────────────────► │              │               │
│  │  / File   │                     │ Image Handler│──► base64     │
│  └──────────┘                     │              │    preview    │
│                                   └──────┬───────┘               │
│                                          │                       │
│  ┌──────────────┐  Enter/Send   ┌────────┴────────┐             │
│  │ message-input│──────────────►│  Message Builder │             │
│  └──────────────┘               │  + API Client    │             │
│                                 └────────┬─────────┘             │
│                                          │                       │
│                         ┌────────────────┼──────────────┐        │
│                         ▼                ▼              ▼        │
│               user-message      POST /v1/chat/    assistant-    │
│               div appended      completions      message div    │
│               to chat-messages  (stream:true)   appended       │
│                                        │              │         │
│                                        │    ┌─────────┘         │
│                                        ▼    ▼                   │
│                                 ┌──────────────┐                │
│                                 │Stream Renderer│                │
│                                 │ marked.parse()│                │
│                                 │ auto-scroll   │                │
│                                 └──────┬───────┘                │
│                                        │ stream ends             │
│                                        ▼                        │
│                                 ┌──────────────┐                │
│                                 │Code Highlighter│               │
│                                 │hljs.highlight  │               │
│                                 └──────────────┘                │
│                                                                  │
│  ┌──────────────┐         ┌──────────────┐                      │
│  │Settings Modal│◄───────│Settings Mgr  │◄──► localStorage     │
│  └──────────────┘  gear  └──────────────┘    (openai_api_key)   │
└─────────────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS (API key in Authorization header)
                          ▼
                 ┌─────────────────────┐
                 │  api.openai.com     │
                 │  /v1/chat/completions│
                 │  model: gpt-4o      │
                 └─────────────────────┘
```

### Request Payload Shape

```json
{
  "model": "gpt-4o",
  "stream": true,
  "messages": [
    {
      "role": "user",
      "content": [
        { "type": "text", "text": "..." },
        { "type": "image_url", "image_url": { "url": "data:image/...;base64,..." } }
      ]
    }
  ]
}
```

### Streaming Response Processing

1. `fetch()` → `response.body` (ReadableStream)
2. `reader.read()` loop → decode UTF-8 chunks
3. Parse `data: {...}` SSE lines → extract `choices[0].delta.content`
4. Accumulate token string → `marked.parse()` → update `message-content` innerHTML
5. Auto-scroll `chat-messages` container
6. On `data: [DONE]` → finalize, run `hljs.highlightElement()` on all `<code>` blocks

---

## 4. Constraints

| Category | Constraint |
|---|---|
| **Security** | API key stored **only** in localStorage (`openai_api_key`); sent **only** to `api.openai.com` in `Authorization: Bearer` header |
| **Streaming** | Must use ReadableStream API (not XMLHttpRequest); process SSE chunks incrementally |
| **Rendering** | Markdown via `marked.parse()` only; code highlighting via `hljs.highlightElement()` only, called after DOM insertion and stream completion |
| **Images** | Paste via `clipboardData.items` (image/*); upload via hidden `<input type="file" accept="image/*">`; encoding via `FileReader.readAsDataURL()`; API format: `image_url` content type with `data:` URI |
| **UX** | Send button disabled during response; loading indicator shown; image preview cleared after send; auto-scroll on every token |
| **Errors** | 401 → "Invalid API key"; 429 → "Rate limit exceeded"; 500 → "Server error"; network → "Connection failed"; missing key → prompt to open settings |
| **Layout** | Flexbox column; messages container scrollable with flex-grow; input fixed at viewport bottom; no sidebar, no dark mode, no model selector |
| **Scope** | Single conversation only; no persistence beyond session; no voice; no non-image attachments; desktop-first |
| **Integration** | All shared element IDs and classes per the contract table; Worker A owns HTML/CSS, Worker B owns JS — no cross-file ownership |

## Integration Contract

| Element | ID | Key Classes |
|---|---|---|
| Chat messages container | `chat-messages` | — |
| Message input textarea | `message-input` | — |
| Send button | `send-button` | — |
| Settings button (gear icon) | `settings-button` | — |
| Settings modal overlay | `settings-modal` | `modal-overlay` |
| API key input | `api-key-input` | — |
| Save API key button | `save-key-button` | — |
| Close settings button | `close-settings` | — |
| Image upload button | `image-upload-button` | — |
| Hidden file input | `image-file-input` | — |
| Image preview container | `image-preview` | `preview-container` |
| User message bubble | — | `message user-message` |
| Assistant message bubble | — | `message assistant-message` |
| Message content area | — | `message-content` |
| Error message | — | `error-message` |
