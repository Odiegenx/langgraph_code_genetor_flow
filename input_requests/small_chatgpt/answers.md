1. **Frontend framework?** What should the static site be built with?
   - a) Vanilla HTML/CSS/JS (no build step)

2. **Image handling clarification:** `qwen3:8b` is a text-only model and cannot process images. How should images be handled?
   - d) Other: minicpm-v:latest  gennem Ollama (Can we have it so that if its detects a picture minicpm is used. if anything else its qwen3:8b)

3. **Conversation management:** "Works a lot like ChatGPT" — should this include a sidebar with multiple named conversations, or just a single chat session?
   - a) Full sidebar with multiple conversations (create/rename/delete)

4. **Streaming responses:** Should the AI response stream token-by-token (like ChatGPT), or return the full response at once?
   - b) Full response at once (simpler)

5. **"Copy in text" meaning:** When you say "copy in text to it," do you mean:
   - c) Both
