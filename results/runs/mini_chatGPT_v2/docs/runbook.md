# Runbook: Ollama Chat UI

## Starting the Application

1. Ensure Ollama is running on your machine:
   ```bash
   ollama serve
   ```

2. Confirm required models are available:
   ```bash
   ollama list
   ```
   You should see entries for `qwen3:8b` and `minicpm-v:latest`. If missing, pull them using:
   ```bash
   ollama pull qwen3:8b
   ollama pull minicpm-v:latest
   ```

3. Serve the static files (`index.html`, `styles.css`, `app.js`, `ollama.js`) via any local web server. Example with Python:
   ```bash
   python -m http.server 8000 --directory ollama-chat-ui
   ```

4. Open your browser and navigate to `http://localhost:8000`

## Stopping the Application

- Stop the web server process (e.g., Ctrl+C if using Python's built-in server)
- Optionally stop Ollama service if no longer needed

## Troubleshooting Common Issues

### 1. "Failed to fetch" or CORS error when sending a message

- Ensure Ollama is running and accessible at `http://localhost:11434`
- Check that your browser allows localhost fetch requests (some privacy extensions may block this)

### 2. Images not attaching or preview not showing

- Verify you're pasting/dropping actual image files (PNG/JPEG/etc.)
- Check console logs for FileReader errors
- Make sure browser permissions allow clipboard read access

### 3. Conversations not saving between sessions

- Confirm `localStorage` is enabled in your browser settings
- Check DevTools > Application tab > Storage for values under 'ollama-chat-conversations'

### 4. Wrong model being used

- Validate `detectModel()` logic in `ollama.js`
- Ensure `sendChatRequest()` correctly selects model based on presence of image

### 5. Send button remains disabled after request completes

- Look for unhandled exceptions in `handleSendMessage()` in `app.js`
- Confirm `finally` block re-enables the send button regardless of success/failure

### 6. Missing styles or broken layout

- Confirm `styles.css` is loaded properly (check Network tab in DevTools)
- Inspect elements to ensure all defined CSS classes are applied as expected
