# Ollama Chat UI — Ticket Backlog

---

## TICKET-001: Static HTML Structure

**Priority:** P0 — Critical  
**Assignee:** Worker A  
**Files:** `ollama-chat-ui/index.html`

### Scope

Create the static semantic HTML page that defines all required element IDs and serves as the mounting surface for dynamic DOM manipulation. No application logic, no inline scripts, no dynamic element creation. Only structural markup and external resource links.

### Scope Boundaries

- **In Scope:** All 12 element IDs from the generation contract, semantic layout regions (sidebar, chat area, input area), linking `styles.css`, `app.js`, and `ollama.js`.
- **Out of Scope:** Any JavaScript logic, dynamic DOM creation, inline event handlers, framework markup, mobile viewport meta tags.

### Acceptance Criteria

1. All 12 element IDs exist in the document: `sidebar`, `new-chat-btn`, `conversation-list`, `chat-area`, `messages-container`, `input-area`, `message-input`, `image-preview-container`, `image-preview`, `remove-image-btn`, `send-btn`.
2. Sidebar region contains `#sidebar`, `#new-chat-btn`, and `#conversation-list` in a logical hierarchy.
3. Chat region contains `#chat-area` wrapping `#messages-container`.
4. Input region contains `#input-area` wrapping `#message-input`, `#image-preview-container` (with `#image-preview` and `#remove-image-btn`), and `#send-btn`.
5. `#image-preview-container` has the `.hidden` class applied by default.
6. `styles.css`, `app.js`, and `ollama.js` are linked/loaded via `<link>` and `<script>` tags.
7. No `<script>` blocks contain application logic.
8. No inline `onclick`, `onsubmit`, or other event handler attributes exist.
9. HTML validates with no syntax errors.

### Definition of Done

- File `ollama-chat-ui/index.html` committed.
- All 12 element IDs present and uniquely named.
- No application logic in the HTML file.
- Passes manual structural review against the element ID table in the generation contract.

### Dependencies

- None (foundational ticket).

---

## TICKET-002: Complete CSS Styling

**Priority:** P0 — Critical  
**Assignee:** Worker A  
**Files:** `ollama-chat-ui/styles.css`

### Scope

Provide all visual styling for the ChatGPT-like desktop experience. Must cover every element ID and every dynamically-created CSS class listed in the generation contract. The layout must produce a functional sidebar + chat area desktop view.

### Scope Boundaries

- **In Scope:** All 12 element ID selectors, all 13 CSS class selectors (including `.hidden` utility), sidebar layout, message bubble styling, input area styling, image preview styling, conversation item styling with action buttons, active state styling.
- **Out of Scope:** Mobile-responsive breakpoints, animations beyond hover/focus states, markdown rendering styles, print styles.

### Acceptance Criteria

1. Every element ID from the contract has at least one CSS rule targeting it.
2. Every CSS class from the contract table is defined: `.conversation-item`, `.conversation-item.active`, `.conversation-item-name`, `.conversation-item-actions`, `.rename-btn`, `.delete-btn`, `.message`, `.user-message`, `.ai-message`, `.message-content`, `.message-image`, `.hidden`.
3. `.hidden` class sets `display: none` (or equivalent hiding mechanism).
4. Sidebar is a fixed-width left panel; chat area fills remaining horizontal space.
5. `.user-message` and `.ai-message` have visually distinct styling (different background colors, alignment).
6. `.message-image` constrains image size within message bubbles (max-width/max-height).
7. `#image-preview-container` layout supports an image preview alongside a remove button.
8. `#send-btn` has a disabled visual state.
9. `.conversation-item.active` has a distinct visual indicator (background color, border, etc.).
10. Input area is anchored to the bottom of the chat region.
11. `#message-input` is a multi-line expandable textarea.

### Definition of Done

- File `ollama-chat-ui/styles.css` committed.
- All ID and class selectors from the contract are present.
- Visual layout produces a recognizable ChatGPT-style desktop interface when paired with `index.html`.
- No unused framework class references.

### Dependencies

- TICKET-001 (element IDs must be defined to verify selector coverage).

---

## TICKET-003: Ollama API Communication Layer

**Priority:** P0 — Critical  
**Assignee:** Worker B  
**Files:** `ollama-chat-ui/ollama.js`

### Scope

Implement the two functions defined in the generation contract: `detectModel` and `sendChatRequest`. This module is the sole interface to the Ollama API and must handle model routing, multimodal message formatting, and non-streaming response extraction.

### Scope Boundaries

- **In Scope:** `detectModel(imageBase64)` function, `sendChatRequest(messages, imageBase64)` function, POST to `http://localhost:11434/api/chat`, model selection logic, multimodal content array construction for the last user message when an image is present, `stream: false` parameter, response content extraction.
- **Out of Scope:** Streaming support, error retry logic, model installation, API key management, request queuing, response caching.

### Acceptance Criteria

1. `detectModel(imageBase64)` returns `'minicpm-v:latest'` when `imageBase64` is truthy and `'qwen3:8b'` otherwise.
2. `sendChatRequest(messages, imageBase64)` accepts a `messages` array (full conversation history) and an optional `imageBase64` string.
3. When `imageBase64` is provided, the last user message's `content` is converted from a plain string to a multimodal array: `[{"type": "text", "text": originalString}, {"type": "image_url", "image_url": {"url": imageBase64}}]`.
4. The function does **not** mutate the original `messages` array passed in; it creates a deep copy before modifying.
5. The POST request body includes `model`, `messages`, and `stream: false`.
6. The model field is set via `detectModel(imageBase64)`.
7. The endpoint URL is exactly `http://localhost:11434/api/chat`.
8. On successful response, the function resolves the promise with `{content: response.message.content}`.
9. On network error or non-OK HTTP status, the function rejects the promise with a descriptive error.
10. No `stream: true` or streaming parsing logic exists in the file.

### Definition of Done

- File `ollama-chat-ui/ollama.js` committed.
- Both functions are exported/available on the global scope for `app.js` consumption.
- `sendChatRequest` signature accepts `messages` (full history array), not a single text string.
- Model detection logic correctly routes based on image presence.
- Endpoint URL and `stream: false` are verifiable in source.

### Dependencies

- None (can be developed independently; integration depends on TICKET-004).

---

## TICKET-004: Application Logic — Core State & Conversation Management

**Priority:** P0 — Critical  
**Assignee:** Worker B  
**Files:** `ollama-chat-ui/app.js`

### Scope

Implement the foundational state management layer: conversation CRUD, localStorage persistence, active conversation tracking, sidebar rendering, and conversation switching. This is the backbone upon which messaging and image handling are built.

### Scope Boundaries

- **In Scope:** `initApp()`, `loadConversations()`, `saveConversations()`, `createNewConversation()`, `switchConversation(id)`, `renameConversation(id, newName)`, `deleteConversation(id)`, `renderSidebar()`.
- **Out of Scope:** Message sending, image handling, API calls (those belong in TICKET-005 and TICKET-006).

### Acceptance Criteria

1. `initApp()` calls `loadConversations()`, sets up event listeners on `#new-chat-btn`, and renders the sidebar and messages for the current active conversation.
2. `loadConversations()` reads from `localStorage` key `'ollama-chat-conversations'` and parses the JSON array. If empty or corrupt, initializes an empty array and calls `createNewConversation()`.
3. `saveConversations()` serializes the conversations array to JSON and writes to `localStorage` key `'ollama-chat-conversations'`.
4. `createNewConversation()` generates a unique ID (e.g., `Date.now().toString()` or UUID), sets default name (e.g., "New Chat"), adds to the array, saves, and switches to it.
5. `switchConversation(id)` updates the active conversation ID, calls `renderSidebar()` and `renderMessages()`.
6. `renameConversation(id, newName)` updates the name property, saves, and re-renders sidebar.
7. `deleteConversation(id)` removes the conversation, saves, re-renders sidebar. If the deleted conversation was active, switches to the first remaining conversation or creates a new one if none remain.
8. `renderSidebar()` clears `#conversation-list` and dynamically creates `.conversation-item` elements for each conversation. The active conversation gets the `.active` class. Each item contains `.conversation-item-name` and `.conversation-item-actions` with `.rename-btn` and `.delete-btn`.
9. Rename button triggers an inline edit or prompt to rename. Delete button triggers deletion with confirmation or immediate deletion.
10. All DOM references use the element IDs from `index.html` (`getElementById` or `querySelector` with correct IDs).

### Definition of Done

- File `ollama-chat-ui/app.js` committed with all 8 functions defined.
- Conversations persist to localStorage and survive page reload.
- Sidebar dynamically renders conversation items with active state, rename, and delete actions.
- Switching conversations correctly updates the active state and triggers message re-render.
- Deleting the active conversation correctly falls back to another conversation or creates a new one.

### Dependencies

- TICKET-001 (element IDs must exist in HTML for DOM queries to work).
- TICKET-002 (CSS classes must exist for dynamic elements to be styled).
- TICKET-003 (ollama.js must exist for `sendChatRequest` to be callable, though this ticket doesn't call it directly).

---

## TICKET-005: Application Logic — Message Rendering & Send Flow

**Priority:** P0 — Critical  
**Assignee:** Worker B  
**Files:** `ollama-chat-ui/app.js`

### Scope

Implement `renderMessages()` and `handleSendMessage()`. This connects the UI input to the Ollama API and displays both user and AI messages in the chat area. Includes send button disable/enable logic and Enter key handling.

### Scope Boundaries

- **In Scope:** `renderMessages()`, `handleSendMessage()`, Enter key submission, send button disable during request, AI response rendering, auto-scroll to latest message.
- **Out of Scope:** Image paste/drop handling (TICKET-006), streaming display, markdown rendering.

### Acceptance Criteria

1. `renderMessages()` clears `#messages-container` and creates `.message` elements for each message in the active conversation.
2. User messages receive `.user-message` class; AI messages receive `.ai-message` class.
3. Each message element contains a `.message-content` child with the text content.
4. If a message has an image (multimodal content array), an `<img>` with `.message-image` class is rendered with the base64 data URL as `src`.
5. `handleSendMessage()` reads text from `#message-input` and the current image attachment (if any). If both are empty, does nothing.
6. User message is appended to the active conversation's `messages` array and rendered immediately.
7. `#send-btn` is disabled (attribute `disabled`) while the API request is in progress.
8. `handleSendMessage()` calls `sendChatRequest(fullMessageHistory, imageBase64)` with the **complete** conversation history, not just the latest message.
9. On successful response, the AI message `{role: "assistant", content: responseContent}` is appended to the conversation, saved to localStorage, and rendered.
10. On error, a user-visible error message is displayed (e.g., as an AI message with error text).
11. After the request completes (success or error), `#send-btn` is re-enabled and `#message-input` is cleared.
12. Pressing Enter in `#message-input` (without Shift) triggers `handleSendMessage()`.
13. The chat area auto-scrolls to the bottom after new messages are rendered.

### Definition of Done

- `renderMessages()` and `handleSendMessage()` are defined in `app.js`.
- User can type a message, press Send or Enter, and see both their message and the AI response.
- Send button is disabled during the request and re-enabled after.
- Full conversation history is sent on each request (verifiable in `sendChatRequest` call arguments).
- Messages persist across conversation switches and page reloads.

### Dependencies

- TICKET-003 (ollama.js `sendChatRequest` must be implemented).
- TICKET-004 (conversation state management must be in place).

---

## TICKET-006: Application Logic — Image Handling

**Priority:** P1 — High  
**Assignee:** Worker B  
**Files:** `ollama-chat-ui/app.js`

### Scope

Implement clipboard image paste, drag-and-drop image input, image preview display, and image removal. This enables multimodal message support and triggers the vision model routing in `ollama.js`.

### Scope Boundaries

- **In Scope:** `handleImagePaste(event)`, `handleImageDrop(event)`, `removeImage()`, `showImagePreview(base64DataUrl)`, dragover event prevention, image state tracking in app.js.
- **Out of Scope:** Multiple image attachments, image generation, file picker/upload button, image compression or resizing.

### Acceptance Criteria

1. `handleImagePaste(event)` listens for `paste` events on `#message-input`. If the clipboard contains an image, it reads it as a base64 data URL and calls `showImagePreview()`.
2. `handleImageDrop(event)` listens for `dragover` and `drop` events on `#chat-area`. `dragover` calls `preventDefault()`. If the dropped file is an image type, it reads it as a base64 data URL and calls `showImagePreview()`.
3. `showImagePreview(base64DataUrl)` sets `#image-preview` `src` to the data URL and removes the `.hidden` class from `#image-preview-container`.
4. `removeImage()` clears the current image attachment state variable, sets `#image-preview` `src` to empty, and adds the `.hidden` class to `#image-preview-container`.
5. `#remove-image-btn` click triggers `removeImage()`.
6. Only one image can be attached at a time. Attaching a new image replaces the previous one.
7. When `handleSendMessage()` is called with an image attached, the `imageBase64` parameter is passed to `sendChatRequest`, triggering `minicpm-v:latest` model selection.
8. After a message is sent, `removeImage()` is called to clear the preview.
9. Image state is stored in a module-level variable (not in the conversation object until send).

### Definition of Done

- All 4 image functions are defined in `app.js`.
- User can paste an image from clipboard and see a preview.
- User can drag-and-drop an image onto the chat area and see a preview.
- User can click the remove button to clear the image preview.
- Sending a message with an image attached routes to `minicpm-v:latest`.
- Sending a message without an image routes to `qwen3:8b`.

### Dependencies

- TICKET-004 (conversation state and `initApp` must set up event listeners).
- TICKET-005 (message send flow must integrate image base64 into the API call).

---

## TICKET-007: Validation Script

**Priority:** P1 — High  
**Assignee:** Worker A  
**Files:** `ollama-chat-ui/validate_site.js`

### Scope

Create an offline Node.js validation script that reads and parses all source files to verify compliance with the generation contract. The script must check HTML structure, CSS coverage, JS function existence, element ID wiring, API contract adherence, and behavioral criteria.

### Scope Boundaries

- **In Scope:** All 11 validation requirements listed in the generation contract: HTML element IDs, CSS selector coverage, JS function existence, element ID wiring in app.js, `sendChatRequest` signature, model detection logic, Ollama endpoint URL, conversation management functions, image handling functions, localStorage references, send button disable logic, dynamic DOM creation.
- **Out of Scope:** Runtime functional testing, browser automation, network calls to Ollama, visual regression testing.

### Acceptance Criteria

1. Script reads `index.html` and verifies all 12 element IDs exist as `id` attributes.
2. Script reads `styles.css` and verifies all element ID selectors and all CSS class selectors from the contract are defined.
3. Script reads `app.js` and verifies all 12 functions from the contract are defined: `initApp`, `loadConversations`, `saveConversations`, `createNewConversation`, `switchConversation`, `renameConversation`, `deleteConversation`, `renderSidebar`, `renderMessages`, `handleSendMessage`, `handleImagePaste`, `handleImageDrop`, `removeImage`, `showImagePreview`.
4. Script reads `app.js` and verifies element IDs referenced via `getElementById` or `querySelector` match those defined in `index.html`.
5. Script reads `ollama.js` and verifies `sendChatRequest` accepts a `messages` parameter.
6. Script reads `ollama.js` and verifies model detection logic references both `minicpm-v:latest` and `qwen3:8b`.
7. Script reads `ollama.js` and verifies the endpoint `http://localhost:11434/api/chat` and `stream: false` are present.
8. Script reads `app.js` and verifies `createNewConversation`, `renameConversation`, `deleteConversation`, `switchConversation` are defined.
9. Script reads `app.js` and verifies `handleImagePaste` and `handleImageDrop` are defined.
10. Script reads `app.js` and verifies `localStorage` is referenced.
11. Script reads `app.js` and verifies send button disable logic exists (setting `disabled` attribute or property on `#send-btn`).
12. Script reads `app.js` and verifies `createElement` calls exist for `.message` and `.conversation-item` class elements.
13. Script outputs a pass/fail summary for each check.
14. Script exits with code 0 if all checks pass, non-zero otherwise.

### Definition of Done

- File `ollama-chat-ui/validate_site.js` committed.
- Running `node validate_site.js` from the project directory produces a clear pass/fail report.
- All 12+ validation checks are implemented and functional.
- Script correctly identifies missing IDs, missing CSS selectors, missing JS functions, and contract violations.

### Dependencies

- TICKET-001 (index.html must exist to validate).
- TICKET-002 (styles.css must exist to validate).
- TICKET-003 (ollama.js must exist to validate).
- TICKET-004 (app.js core must exist to validate).
- TICKET-005 (app.js message flow must exist to validate).
- TICKET-006 (app.js image handling must exist to validate).

---

## TICKET-008: Integration & End-to-End Verification

**Priority:** P1 — High  
**Assignee:** Both  
**Files:** All project files

### Scope

Verify that all components integrate correctly: HTML mounts the JS, JS references the correct element IDs, CSS styles all dynamically-created elements, Ollama API calls succeed with both models, and the full user flow works end-to-end.

### Scope Boundaries

- **In Scope:** Manual walkthrough of all 12 behavioral acceptance criteria from the generation contract, validation script execution, cross-file ID reference verification, localStorage round-trip testing.
- **Out of Scope:** Automated E2E browser testing, performance testing, load testing, accessibility auditing.

### Acceptance Criteria

1. User can type a message and click Send (or press Enter) to send it to Ollama and receive a response.
2. User can paste an image from clipboard; a preview appears before sending.
3. User can drag-and-drop an image onto the chat area; a preview appears.
4. When an image is attached, the request uses `minicpm-v:latest`; otherwise `qwen3:8b`.
5. Full conversation history is sent to Ollama on each request (verified via browser DevTools network tab).
6. User can create a new conversation via the sidebar button.
7. User can rename a conversation via a button on the sidebar item.
8. User can delete a conversation via a button on the sidebar item.
9. Switching conversations displays the correct message history.
10. Conversations persist across page reloads via localStorage.
11. The send button is disabled while an Ollama request is in progress.
12. AI responses are displayed in a distinct styled bubble from user messages.
13. `node validate_site.js` passes all checks with exit code 0.

### Definition of Done

- All 12 behavioral acceptance criteria verified manually with Ollama running locally.
- Validation script passes cleanly.
- No console errors during normal operation.
- No broken element ID references.
- No unstyled dynamic elements.

### Dependencies

- TICKET-001 through TICKET-007 (all implementation tickets must be complete).

---

## TICKET-009: Project README

**Priority:** P2 — Medium  
**Assignee:** Either  
**Files:** `ollama-chat-ui/README.md`

### Scope

Create a project README that explains what the project is, prerequisites, how to run it, and how to use it.

### Scope Boundaries

- **In Scope:** Project description, prerequisites (Ollama, models), quick start instructions, usage guide, file structure overview.
- **Out of Scope:** Detailed architecture (covered in TICKET-010), deployment procedures (covered in TICKET-011), API documentation.

### Acceptance Criteria

1. README contains a project title and one-paragraph description.
2. Prerequisites section lists: Ollama installed and running, `qwen3:8b` model pulled, `minicpm-v:latest` model pulled.
3. Quick start section explains: clone, open `index.html` in browser (or serve via local HTTP server).
4. Usage section describes: sending messages, attaching images, managing conversations.
5. File structure section lists all 5 project files with one-line descriptions.
6. README is valid Markdown.

### Definition of Done

- File `ollama-chat-ui/README.md` committed.
- A new developer can read the README and have the application running within 5 minutes.

### Dependencies

- TICKET-008 (project should be verified working before documenting usage).

---

## TICKET-010: Architecture Documentation

**Priority:** P2 — Medium  
**Assignee:** Either  
**Files:** `ollama-chat-ui/docs/architecture.md`

### Scope

Document the system architecture, data model, dataflow, component responsibilities, and design decisions for future maintainers.

### Scope Boundaries

- **In Scope:** Component diagram/description, data model (conversation object schema), message send flow, conversation management flow, API integration contract, model routing logic, localStorage persistence strategy, constraints and trade-offs.
- **Out of Scope:** Deployment instructions, operational runbook, API reference beyond what's in the contract.

### Acceptance Criteria

1. Document describes all 5 components and their responsibilities.
2. Conversation object schema is documented with field types and multimodal content format.
3. Message send flow is documented step-by-step matching the architecture spec.
4. Conversation management flow (create, switch, rename, delete) is documented.
5. API integration contract (endpoint, method, payload format, model selection) is documented.
6. Design constraints and trade-offs (no streaming, no markdown, single image, desktop-only) are listed.
7. Document is valid Markdown with clear headings and code blocks.

### Definition of Done

- File `ollama-chat-ui/docs/architecture.md` committed.
- Document accurately reflects the implemented system (verified against source code).

### Dependencies

- TICKET-008 (implementation must be finalized and verified).

---

## TICKET-011: Deployment Checklist

**Priority:** P2 — Medium  
**Assignee:** Either  
**Files:** `ollama-chat-ui/docs/deployment_checklist.md`

### Scope

Create a pre-deployment verification checklist ensuring all prerequisites, configurations, and validations are complete before the application is considered ready for use.

### Scope Boundaries

- **In Scope:** Ollama prerequisites checklist, model availability verification, file integrity checks, validation script execution, browser compatibility check, localStorage functionality check.
- **Out of Scope:** CI/CD pipeline configuration, container orchestration, cloud deployment steps.

### Acceptance Criteria

1. Checklist includes: Ollama installed and running on `localhost:11434`.
2. Checklist includes: `qwen3:8b` model available (`ollama list` verification).
3. Checklist includes: `minicpm-v:latest` model available.
4. Checklist includes: All 5 source files present and non-empty.
5. Checklist includes: Validation script passes (`node validate_site.js` exits 0).
6. Checklist includes: Application loads in browser without console errors.
7. Checklist includes: Text message send/receive works end-to-end.
8. Checklist includes: Image message send/receive works end-to-end.
9. Checklist includes: Conversation persistence works across page reload.
10. Document is valid Markdown with checkbox items.

### Definition of Done

- File `ollama-chat-ui/docs/deployment_checklist.md` committed.
- Each checklist item is actionable and verifiable.
- Walking through the checklist on a fresh environment confirms the application is ready.

### Dependencies

- TICKET-008 (all features must be verified working).

---

## TICKET-012: Operational Runbook

**Priority:** P2 — Medium  
**Assignee:** Either  
**Files:** `ollama-chat-ui/docs/runbook.md`

### Scope

Create an operational runbook covering common issues, troubleshooting steps, and recovery procedures for the Ollama Chat UI.

### Scope Boundaries

- **In Scope:** Ollama connectivity troubleshooting, model not found errors, CORS issues, localStorage corruption recovery, image attachment failures, slow response handling, browser compatibility notes.
- **Out of Scope:** Server infrastructure management, monitoring/alerting setup, automated remediation scripts.

### Acceptance Criteria

1. Document covers: "Ollama not reachable" — verify Ollama is running, check port 11434, test with `curl`.
2. Document covers: "Model not found" — how to pull models with `ollama pull qwen3:8b` and `ollama pull minicpm-v:latest`.
3. Document covers: "CORS error" — note that serving from `file://` may require a local HTTP server; provide a simple command (e.g., `python3 -m http.server`).
4. Document covers: "localStorage full or corrupt" — how to clear `ollama-chat-conversations` key in DevTools.
5. Document covers: "Image paste/drop not working" — browser permissions, focus on input field.
6. Document covers: "Send button stuck disabled" — refresh page; check browser console for unhandled promise rejections.
7. Document covers: "Slow or no response" — Ollama model loading time, GPU/CPU resource constraints.
8. Each issue has: symptom, probable cause, resolution steps.
9. Document is valid Markdown.

### Definition of Done

- File `ollama-chat-ui/docs/runbook.md` committed.
- Each troubleshooting scenario has clear symptom-cause-resolution structure.
- A developer encountering any listed issue can resolve it using only the runbook.

### Dependencies

- TICKET-008 (must understand actual failure modes from testing).

---

## Dependency Graph

```
TICKET-001 (HTML) ─────────┐
TICKET-002 (CSS) ──────────┤
                           ├──→ TICKET-004 (App: State) ──→ TICKET-005 (App: Messages) ──→ TICKET-006 (App: Images)
TICKET-003 (Ollama.js) ───┤                                    │                                │
                           │                                    ↓                                ↓
                           │                              TICKET-007 (Validation) ←───────────┘
                           │                                    │
                           └────────────────────────────────────┘
                                                                ↓
                                                          TICKET-008 (Integration)
                                                                ↓
                                                    ┌───────────┼───────────┐
                                                    ↓           ↓           ↓
                                              TICKET-009   TICKET-010  TICKET-011
                                               (README)    (Arch Doc)  (Deploy Checklist)
                                                                ↓
                                                          TICKET-012
                                                          (Runbook)
```

---

## Summary Table

| Ticket | Title | Priority | Assignee | Dependencies |
|--------|-------|----------|----------|-------------|
| TICKET-001 | Static HTML Structure | P0 | Worker A | — |
| TICKET-002 | Complete CSS Styling | P0 | Worker A | TICKET-001 |
| TICKET-003 | Ollama API Communication Layer | P0 | Worker B | — |
| TICKET-004 | App: Core State & Conversation Mgmt | P0 | Worker B | TICKET-001, TICKET-002, TICKET-003 |
| TICKET-005 | App: Message Rendering & Send Flow | P0 | Worker B | TICKET-003, TICKET-004 |
| TICKET-006 | App: Image Handling | P1 | Worker B | TICKET-004, TICKET-005 |
| TICKET-007 | Validation Script | P1 | Worker A | TICKET-001–006 |
| TICKET-008 | Integration & E2E Verification | P1 | Both | TICKET-001–007 |
| TICKET-009 | Project README | P2 | Either | TICKET-008 |
| TICKET-010 | Architecture Documentation | P2 | Either | TICKET-008 |
| TICKET-011 | Deployment Checklist | P2 | Either | TICKET-008 |
| TICKET-012 | Operational Runbook | P2 | Either | TICKET-008 |
