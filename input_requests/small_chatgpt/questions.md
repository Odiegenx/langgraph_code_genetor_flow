1. **Frontend framework?** What should the static site be built with?
   - a) Vanilla HTML/CSS/JS (no build step)
   - b) React (Vite)
   - c) Svelte (Vite)
   - d) Other: ___

2. **Image handling clarification:** `qwen3:8b` is a text-only model and cannot process images. How should images be handled?
   - a) Display images inline in chat but don't send them to the model
   - b) Switch to a vision-capable model (e.g., `llava`) for image support
   - c) Drop image support entirely, text only
   - d) Other: ___

3. **Conversation management:** "Works a lot like ChatGPT" — should this include a sidebar with multiple named conversations, or just a single chat session?
   - a) Full sidebar with multiple conversations (create/rename/delete)
   - b) Single chat session only (no sidebar)
   - c) Minimal sidebar (list conversations, no rename/delete)

4. **Streaming responses:** Should the AI response stream token-by-token (like ChatGPT), or return the full response at once?
   - a) Stream token-by-token (requires SSE/ReadableStream)
   - b) Full response at once (simpler)

5. **"Copy in text" meaning:** When you say "copy in text to it," do you mean:
   - a) Paste text directly into the chat input box (standard behavior)
   - b) Upload `.txt`/`.md` files as attachments
   - c) Both
