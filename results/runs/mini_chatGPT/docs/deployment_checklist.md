# Deployment Checklist

## Prerequisites

- **Node.js** (v18 or higher) installed for running `validate_site.js`
- Modern web browser supporting:
  - `ReadableStream` API
  - `fetch()` with streaming support
  - ES6 modules and `async/await`
- Access to [OpenAI API](https://platform.openai.com/docs/api-reference) with a valid API key

## Validation Commands

Run the automated validation script to ensure all functionality meets the contract:

```bash
node validate_site.js
```

Expected output:
```
Validation Summary: 43/43 checks passed
✅ All validations passed!
```

## Endpoint and Configuration Notes

- **Primary API Target:** `https://api.openai.com/v1/chat/completions`
  - Model used: `gpt-4o`
  - Streaming enabled via `stream: true`
  - Image input supported using `image_url` content type
- **External CDN Dependencies** (must be reachable at runtime):
  - [Marked.js](https://cdn.jsdelivr.net/npm/marked/marked.min.js)
  - [Highlight.js](https://cdn.jsdelivr.net/npm/highlight.js@11/highlight.min.js)
  - [GitHub Theme CSS](https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github.min.css)
- LocalStorage key used: `openai_api_key`
  - Never transmitted to any server except `api.openai.com`
  - Not persisted beyond the browser's local storage scope

## Security Assumptions

This application is designed as a **local-only static site** with the following security constraints:

- ❗ **No server-side processing** – all logic runs in-browser
- 🔐 **API keys are never sent to third-party domains** except `api.openai.com`
- 🛡️ **No user authentication or session persistence across devices**
- ⚠️ **Do not host this publicly without adding authentication and HTTPS enforcement**
- 🧼 **Clear image previews after sending messages** to avoid accidental data leakage
- 📁 **Only image files accepted** (`accept="image/*"`) – no executable or non-media uploads allowed

> ✅ Recommended practice: Serve over HTTPS even locally if integrating into more complex environments.
