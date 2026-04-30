# Ticket Backlog — chatgpt-clone

---

## EPIC 1: Frontend Structure & Styling (Worker A)

---

### TICKET A-1: HTML Page Shell & Semantic Scaffold

**Scope Boundaries:**
- Create `index.html` with full HTML5 document structure
- Include all CDN script/CSS references (marked.js, highlight.js, highlight.js theme CSS)
- Define all element IDs and classes per the Integration Contract
- Does NOT include any JavaScript logic or inline styles

**Acceptance Criteria:**
- AC1: Document uses `<!DOCTYPE html>` with `lang` attribute
- AC2: All shared element IDs exist: `chat-messages`, `message-input`, `send-button`, `settings-button`, `settings-modal`, `api-key-input`, `save-key-button`, `close-settings`, `image-upload-button`, `image-file-input`, `image-preview`
- AC3: CDN links present for `marked.min.js`, `highlight.js`, `highlight.js github.min.css` — CSS theme linked before `app.js`
- AC4: `app.js` linked via `<script>` tag at end of body
- AC5: `styles.css` linked via `<link>` in `<head>`
- AC6: All interactive elements have ARIA labels (`aria-label` attributes)
- AC7: Hidden file input present with `type="file" accept="image/*"` and `id="image-file-input"`
- AC8: Settings modal contains: API key input, save button, close button
- AC9: Image preview container exists with `id="image-preview"` and class `preview-container`

**Definition of Done:**
- `index.html` file exists in `chatgpt-clone/` directory
- All element IDs match the Integration Contract table exactly
- HTML validates with no syntax errors
- ARIA labels present on: send button, settings button, close settings, save key, image upload, message input

**Dependencies:** None

---

### TICKET A-2: Chat Layout & Message Bubble Styles

**Scope Boundaries:**
- Create `styles.css` with flexbox column layout for the full page
- Style user messages (right-aligned, distinct background) and assistant messages (left-aligned, distinct background)
- Style the scrollable messages container and fixed-bottom input area
- Does NOT include modal styles or image preview styles (separate tickets)

**Acceptance Criteria:**
- AC1: Page uses flexbox column layout (`display: flex; flex-direction: column`) filling the full viewport height
- AC2: `#chat-messages` has `flex-grow: 1` and `overflow-y: auto` (scrollable)
- AC3: Input area is fixed at the bottom of the viewport, does not scroll with messages
- AC4: `.user-message` is right-aligned with a distinct background color (e.g., blue/teal)
- AC5: `.assistant-message` is left-aligned with a distinct background color (e.g., gray/light)
- AC6: `.message` class provides common bubble styling (padding, border-radius, max-width, margin)
- AC7: `.message-content` wraps text properly and allows inline elements
- AC8: `.error-message` has a distinct error styling (e.g., red background/border)
- AC9: No sidebar, no dark mode, no model selector present in layout

**Definition of Done:**
- `styles.css` file exists in `chatgpt-clone/` directory
- Messages container scrolls independently while input stays fixed
- User and assistant messages are visually distinguishable at a glance
- Layout works at standard desktop viewport (1280×800+)

**Dependencies:** None

---

### TICKET A-3: Settings Modal Styles

**Scope Boundaries:**
- Style the settings modal as a centered overlay with semi-transparent backdrop
- Style the modal content box, input field, and buttons
- Does NOT include modal open/close logic (Worker B)

**Acceptance Criteria:**
- AC1: `.modal-overlay` covers full viewport with semi-transparent background (e.g., `rgba(0,0,0,0.5)`)
- AC2: Modal content is centered both horizontally and vertically
- AC3: Modal has a white/solid background, padding, border-radius, and appropriate width
- AC4: `#api-key-input` is a full-width text input within the modal
- AC5: `#save-key-button` and `#close-settings` are styled as clickable buttons
- AC6: Modal is hidden by default (`display: none` or equivalent)

**Definition of Done:**
- Modal overlay appears centered when `display` is toggled
- Backdrop dims the page behind the modal
- Modal is usable and readable at desktop viewport sizes

**Dependencies:** None

---

### TICKET A-4: Image Preview & Code Block Styles

**Scope Boundaries:**
- Style the image preview container with thumbnail display and remove button
- Style code blocks with monospace font and distinct background
- Style the image upload button
- Does NOT include image handling logic (Worker B)

**Acceptance Criteria:**
- AC1: `.preview-container` displays image thumbnails inline with appropriate max dimensions (e.g., `max-height: 80px`)
- AC2: Each preview thumbnail has a visible remove/clear button (e.g., × icon or "Remove")
- AC3: Remove button is positioned on or adjacent to the thumbnail
- AC4: `#image-upload-button` is styled as a clickable icon/button adjacent to the message input
- AC5: `code` elements within `.message-content` use monospace font (`font-family: monospace`)
- AC6: `pre code` blocks have a distinct background color and padding
- AC7: Inline `code` has a subtle distinct background
- AC8: `#image-file-input` is hidden (`display: none`)

**Definition of Done:**
- Image preview thumbnails render with remove buttons when images are present
- Code blocks are visually distinct from regular message text
- Upload button is visible and styled near the input area

**Dependencies:** None

---

## EPIC 2: Application Logic & Interaction (Worker B)

---

### TICKET B-1: Settings Manager

**Scope Boundaries:**
- Read/write `openai_api_key` in localStorage
- Open/close settings modal on button click
- Save API key from input to localStorage
- Load API key from localStorage into input on modal open
- Does NOT include API calls or message handling

**Acceptance Criteria:**
- AC1: Clicking `#settings-button` sets `#settings-modal` to visible
- AC2: Clicking `#close-settings` hides `#settings-modal`
- AC3: Clicking `#save-key-button` writes the value of `#api-key-input` to localStorage key `openai_api_key`
- AC4: On modal open, `#api-key-input` value is populated from localStorage `openai_api_key` if it exists
- AC5: API key is stored ONLY in localStorage — never in cookies or external storage
- AC6: API key is sent ONLY to `api.openai.com` in the `Authorization: Bearer` header
- AC7: Clicking the modal backdrop (overlay area outside content) closes the modal

**Definition of Done:**
- Settings modal opens, displays current key, saves key, and closes correctly
- localStorage `openai_api_key` persists across page reloads
- No API key leakage to non-OpenAI domains

**Dependencies:** A-1 (HTML element IDs), A-3 (modal styles)

---

### TICKET B-2: Message Builder

**Scope Boundaries:**
- Construct user and assistant DOM nodes with correct classes and content
- Append messages to `#chat-messages`
- Clear input after sending
- Does NOT include API calls or streaming rendering

**Acceptance Criteria:**
- AC1: User message creates a `div` with classes `message user-message`
- AC2: Assistant message creates a `div` with classes `message assistant-message`
- AC3: Each message div contains a child `div` with class `message-content`
- AC4: User message content is set as text (escaped, not raw HTML)
- AC5: Messages are appended to `#chat-messages` in order
- AC6: After sending, `#message-input` value is cleared
- AC7: Auto-scroll `#chat-messages` to bottom after each message is appended

**Definition of Done:**
- User and assistant messages render in the chat area with correct alignment and styling
- Message DOM structure matches the Integration Contract class names
- Input field is empty after a message is sent

**Dependencies:** A-1 (HTML element IDs), A-2 (message bubble styles)

---

### TICKET B-3: Image Handler

**Scope Boundaries:**
- Clipboard paste extraction from `clipboardData.items` (image/*)
- File upload via hidden `<input type="file" accept="image/*">`
- FileReader → base64 conversion via `readAsDataURL()`
- Preview display with remove button
- Does NOT include sending images to API (B-4)

**Acceptance Criteria:**
- AC1: Pasting an image into `#message-input` triggers extraction from `clipboardData.items` filtering for `image/*` types
- AC2: Clicking `#image-upload-button` triggers click on hidden `#image-file-input`
- AC3: Selected/pasted image is read via `FileReader.readAsDataURL()` producing a `data:image/...;base64,...` string
- AC4: Image preview thumbnail is displayed in `#image-preview` container
- AC5: Each preview thumbnail has a remove button that clears that image from the preview and from internal state
- AC6: Only one image can be attached at a time (new image replaces previous, or multiple supported — clarify in implementation)
- AC7: Image preview is cleared after a message is sent

**Definition of Done:**
- Pasting an image shows a preview thumbnail in the preview container
- Uploading via button shows a preview thumbnail
- Remove button clears the preview and internal base64 data
- Preview is cleared after message send

**Dependencies:** A-1 (HTML element IDs), A-4 (preview styles)

---

### TICKET B-4: API Client — Request Construction & Streaming

**Scope Boundaries:**
- Build OpenAI request payload (text + image_url parts)
- Send POST to `https://api.openai.com/v1/chat/completions` with `stream: true`
- Process SSE via ReadableStream (`response.body.getReader()`)
- Handle `data: [DONE]` signal
- Does NOT include markdown rendering or code highlighting (B-5, B-6)

**Acceptance Criteria:**
- AC1: Request payload uses model `gpt-4o` and `stream: true`
- AC2: Text-only messages send `content` as `[{ "type": "text", "text": "..." }]`
- AC3: Messages with images send `content` as `[{ "type": "text", "text": "..." }, { "type": "image_url", "image_url": { "url": "data:image/...;base64,..." } }]`
- AC4: API key is read from localStorage `openai_api_key` and sent as `Authorization: Bearer <key>` header
- AC5: Streaming uses `response.body.getReader()` and a `reader.read()` loop — NOT XMLHttpRequest
- AC6: Each SSE chunk is decoded from UTF-8 and parsed for `data: {...}` lines
- AC7: `choices[0].delta.content` tokens are extracted and accumulated
- AC8: `data: [DONE]` signals stream completion
- AC9: Full conversation history (all previous user/assistant messages) is sent in the `messages` array for context

**Definition of Done:**
- API requests are correctly formed and sent to `api.openai.com`
- Streaming tokens are received and extracted from SSE format
- ReadableStream API is used (no XHR)
- Request payload matches the documented shape for both text-only and image+text messages

**Dependencies:** B-1 (API key from localStorage), B-2 (message structure), B-3 (image base64 data)

---

### TICKET B-5: Stream Renderer & Markdown

**Scope Boundaries:**
- Append tokens to assistant `message-content` div
- Call `marked.parse()` on accumulated text on each token update
- Auto-scroll on every token
- Does NOT include code highlighting (B-6)

**Acceptance Criteria:**
- AC1: An assistant message div is appended to `#chat-messages` before the first token arrives
- AC2: Each received token is appended to an accumulated string
- AC3: The accumulated string is rendered via `marked.parse()` and set as the `innerHTML` of the assistant `.message-content` div
- AC4: `#chat-messages` auto-scrolls to the bottom on every token update
- AC5: Markdown rendering produces correct HTML (headings, bold, italic, lists, links, code blocks)
- AC6: Only `marked.parse()` is used for markdown rendering — no custom HTML construction

**Definition of Done:**
- Assistant responses appear token-by-token in the chat area
- Markdown is rendered as formatted HTML in real-time during streaming
- Chat auto-scrolls as content arrives

**Dependencies:** B-2 (assistant message DOM structure), B-4 (streaming token extraction)

---

### TICKET B-6: Code Highlighter

**Scope Boundaries:**
- After stream ends, find `<code>` blocks in the assistant message
- Call `hljs.highlightElement()` on each code block
- Does NOT include markdown rendering or stream processing

**Acceptance Criteria:**
- AC1: After `data: [DONE]` is received, all `<code>` elements within the completed assistant `.message-content` are found
- AC2: `hljs.highlightElement()` is called on each `<code>` element
- AC3: Highlighting is applied only after DOM insertion (elements must be in the DOM)
- AC4: Only `hljs.highlightElement()` is used — no manual syntax coloring
- AC5: Both inline `<code>` and `<pre><code>` blocks are highlighted

**Definition of Done:**
- Code blocks in assistant messages display syntax highlighting with colors from the highlight.js github theme
- Highlighting is applied once per message after streaming completes

**Dependencies:** B-5 (stream completion signal, DOM insertion of code blocks), A-1 (highlight.js CDN loaded)

---

### TICKET B-7: Error Handler

**Scope Boundaries:**
- Catch and display errors for 401, 429, 500, network failures, and missing API key
- Render error messages as `error-message` divs in the chat
- Does NOT include retry logic or error recovery beyond display

**Acceptance Criteria:**
- AC1: HTTP 401 response → display "Invalid API key" as an `.error-message` div in `#chat-messages`
- AC2: HTTP 429 response → display "Rate limit exceeded" as an `.error-message` div
- AC3: HTTP 500 response → display "Server error" as an `.error-message` div
- AC4: Network failure (fetch throws) → display "Connection failed" as an `.error-message` div
- AC5: Missing API key (not in localStorage) → display message prompting user to open settings, and open the settings modal
- AC6: Error messages are visually distinct from user/assistant messages (using `.error-message` class)
- AC7: After an error, the send button is re-enabled and loading state is removed

**Definition of Done:**
- All specified error conditions produce user-visible error messages in the chat
- Error messages are clearly distinguishable from normal messages
- App remains functional after an error (send button re-enabled)

**Dependencies:** B-1 (settings modal open), B-2 (message DOM structure), B-4 (API call error paths)

---

### TICKET B-8: Send Button State & Input Wiring

**Scope Boundaries:**
- Wire send button click and Enter key in message input
- Disable send button and show loading state during API response
- Re-enable after response completes or errors
- Does NOT include API logic (B-4)

**Acceptance Criteria:**
- AC1: Clicking `#send-button` triggers the send flow
- AC2: Pressing Enter in `#message-input` triggers the send flow (Shift+Enter inserts newline)
- AC3: `#send-button` is disabled (`disabled` attribute) while awaiting an API response
- AC4: A loading indicator is shown while awaiting a response (e.g., button text changes to "Sending..." or a spinner appears)
- AC5: `#send-button` is re-enabled after the response completes (success or error)
- AC6: Empty messages (no text and no image) do not trigger a send
- AC7: Image preview is cleared after a message is sent successfully

**Definition of Done:**
- Messages can be sent via button click or Enter key
- Send button is visually and functionally disabled during response
- Button returns to enabled state after response or error
- Empty sends are prevented

**Dependencies:** B-2 (message builder), B-3 (image preview clear), B-4 (API call trigger), B-7 (error re-enable)

---

### TICKET B-9: Validation Script

**Scope Boundaries:**
- Create `validate_site.js` as a Node.js script
- Check behavioral acceptance criteria by inspecting files and/or running a headless check
- Output results to stdout
- Does NOT modify any project files

**Acceptance Criteria:**
- AC1: Script runs with `node validate_site.js` without errors
- AC2: Script checks that `index.html` exists and contains all required element IDs from the Integration Contract
- AC3: Script checks that `styles.css` exists and contains required CSS rules (flexbox layout, message classes)
- AC4: Script checks that `app.js` exists and contains key patterns (localStorage key, API URL, ReadableStream usage, marked.parse, hljs.highlightElement)
- AC5: Script outputs a pass/fail summary for each check
- AC6: Script exits with code 0 if all checks pass, non-zero if any fail

**Definition of Done:**
- `validate_site.js` exists in `chatgpt-clone/` directory
- Running `node validate_site.js` produces a clear pass/fail report
- Script validates the Integration Contract element IDs
- Script validates key behavioral patterns in JS

**Dependencies:** A-1, A-2, A-3, A-4, B-1 through B-8 (validates their output)

---

## EPIC 3: Integration & Polish

---

### TICKET I-1: End-to-End Integration Verification

**Scope Boundaries:**
- Verify all Worker A and Worker B components work together
- Test the full user flow: open page → set API key → type message → send → receive streaming response → see markdown/code highlighting
- Test image flow: paste image → preview → send → receive response
- Test error flows: missing key, invalid key, network error
- Does NOT include writing new code — only verification and bug filing

**Acceptance Criteria:**
- AC1: Full text conversation flow works: type → send → streaming response renders with markdown
- AC2: Code blocks in responses are syntax-highlighted after stream completes
- AC3: Image paste shows preview, send includes image in API payload, response renders
- AC4: Image upload button triggers file picker, shows preview, sends correctly
- AC5: Settings modal opens, saves key, persists across reload
- AC6: Missing API key shows error and opens settings
- AC7: Invalid API key (401) shows "Invalid API key" error message
- AC8: Send button is disabled during response, re-enabled after
- AC9: Auto-scroll works during streaming
- AC10: Image preview clears after send

**Definition of Done:**
- All acceptance criteria pass via manual testing in a browser
- No console errors during normal flows
- Validation script passes

**Dependencies:** A-1, A-2, A-3, A-4, B-1, B-2, B-3, B-4, B-5, B-6, B-7, B-8

---

### TICKET I-2: Cross-Browser & Edge Case Testing

**Scope Boundaries:**
- Test in Chrome, Firefox, and Edge (latest stable)
- Test edge cases: very long messages, rapid sequential sends, empty image paste, special characters
- Does NOT include mobile browser testing (desktop-first per scope)

**Acceptance Criteria:**
- AC1: Core flow works in Chrome, Firefox, and Edge
- AC2: Very long messages (1000+ chars) render correctly without layout breakage
- AC3: Send button is properly disabled preventing double-sends
- AC4: Pasting non-image content (text) does not trigger image handler
- AC5: Special characters in messages (HTML entities, markdown, emojis) render safely
- AC6: Rapid Enter presses do not cause duplicate sends

**Definition of Done:**
- All edge cases handled gracefully without errors or layout issues
- No XSS vulnerabilities from user input or API responses

**Dependencies:** I-1

---

## EPIC 4: Documentation

---

### TICKET D-1: README.md

**Scope Boundaries:**
- Create `README.md` at project root with project overview, setup, usage, and architecture summary
- Does NOT include deployment docs (D-3)

**Acceptance Criteria:**
- AC1: README contains project name, description, and purpose
- AC2: README lists prerequisites (modern browser, OpenAI API key, Node.js for validation)
- AC3: README contains setup instructions (open index.html in browser, no build step)
- AC4: README documents how to configure the API key via settings modal
- AC5: README lists CDN dependencies and their versions
- AC6: README contains a brief architecture overview referencing the component decomposition

**Definition of Done:**
- `README.md` exists in `chatgpt-clone/` directory
- A new developer can set up and run the project using only the README

**Dependencies:** I-1 (verified working state)

---

### TICKET D-2: Architecture Documentation

**Scope Boundaries:**
- Create `docs/architecture.md` documenting the full architecture, data flow, and integration contract
- Does NOT include deployment instructions

**Acceptance Criteria:**
- AC1: Document describes component decomposition (Page Shell, Stylesheet, App Logic, Validator)
- AC2: Document describes sub-components within app.js (Settings Manager, Message Builder, Image Handler, API Client, Stream Renderer, Code Highlighter, Error Handler)
- AC3: Document includes the data flow diagram in text/ASCII form
- AC4: Document lists the Integration Contract (shared element IDs and classes)
- AC5: Document describes the request payload shape and streaming response processing
- AC6: Document lists all constraints (security, streaming, rendering, images, UX, errors, layout, scope)

**Definition of Done:**
- `docs/architecture.md` exists
- Architecture document is comprehensive and matches the implemented system

**Dependencies:** I-1

---

### TICKET D-3: Deployment Checklist

**Scope Boundaries:**
- Create `docs/deployment_checklist.md` with steps and checks for deploying the static site
- Does NOT include actual deployment

**Acceptance Criteria:**
- AC1: Checklist includes: all files present (index.html, styles.css, app.js)
- AC2: Checklist includes: CDN links are reachable and correct
- AC3: Checklist includes: validation script passes
- AC4: Checklist includes: no hardcoded API keys in source files
- AC5: Checklist includes: HTML validates, no console errors
- AC6: Checklist includes: CORS considerations (API calls from file:// vs http://)

**Definition of Done:**
- `docs/deployment_checklist.md` exists
- Checklist is actionable and complete

**Dependencies:** I-1

---

## Dependency Map

```
A-1 ─────────────────────────────────────────────┐
A-2 ─────────────────────────────────────────────┤
A-3 ─────────────────────────────────────────────┤
A-4 ─────────────────────────────────────────────┤
                                                 │
B-1 (Settings) ◄── A-1, A-3 ────────────────────┤
B-2 (Message Builder) ◄── A-1, A-2 ─────────────┤
B-3 (Image Handler) ◄── A-1, A-4 ───────────────┤
B-4 (API Client) ◄── B-1, B-2, B-3 ────────────┤
B-5 (Stream Renderer) ◄── B-2, B-4 ────────────┤
B-6 (Code Highlighter) ◄── B-5 ────────────────┤
B-7 (Error Handler) ◄── B-1, B-2, B-4 ─────────┤
B-8 (Send State) ◄── B-2, B-3, B-4, B-7 ───────┤
B-9 (Validation) ◄── all A-*, B-* ─────────────┤
                                                 │
I-1 (E2E Integration) ◄── all A-*, B-* ────────┤
I-2 (Edge Case Testing) ◄── I-1 ───────────────┤
                                                 │
D-1 (README) ◄── I-1 ──────────────────────────┤
D-2 (Architecture) ◄── I-1 ────────────────────┤
D-3 (Deployment Checklist) ◄── I-1 ────────────┘
```

---

## Suggested Execution Order

| Phase | Tickets | Rationale |
|---|---|---|
| **1 — Scaffold** | A-1, A-2, A-3, A-4 | No dependencies; Worker A can build all structure and styling in parallel |
| **2 — Core Logic** | B-1, B-2, B-3 | Foundation logic with no cross-dependencies between them |
| **3 — API & Streaming** | B-4, B-5, B-6 | Sequential chain: API client → stream renderer → code highlighter |
| **4 — Error & State** | B-7, B-8 | Depends on API client and message builder being complete |
| **5 — Validation** | B-9 | Validates all prior work |
| **6 — Integration** | I-1, I-2 | Full system verification |
| **7 — Documentation** | D-1, D-2, D-3 | Document the verified, working system |
