# chatgpt-clone

A lightweight, client-side clone of ChatGPT using the OpenAI API, built with vanilla JavaScript, HTML, and CSS.

## Description

This project demonstrates a minimal implementation of a chat interface that integrates with the OpenAI GPT-4o model via the Chat Completions API. It supports streaming responses, markdown rendering, syntax highlighting, and image input via clipboard paste or file upload.

The application runs entirely in the browser—no backend required—and stores your API key locally in `localStorage`.

## Prerequisites

- A modern web browser (Chrome, Firefox, Edge)
- An OpenAI API key
- Node.js (v18+) for running the validation script

## Setup

1. Clone or download this repository.
2. Open `index.html` in your browser.
3. Click the gear icon to open the settings modal.
4. Enter your OpenAI API key and click "Save".
5. Start chatting!

## Features

- Real-time streaming responses
- Markdown rendering with syntax highlighting
- Image input via clipboard paste or file upload
- Responsive chat layout
- Settings modal for API key configuration
- Error handling for common API issues

## Dependencies

All dependencies are loaded via CDN:

- [marked.js](https://cdn.jsdelivr.net/npm/marked/marked.min.js) (v9+)
- [highlight.js](https://cdn.jsdelivr.net/npm/highlight.js@11/highlight.min.js) (v11+)
- [highlight.js GitHub theme](https://cdn.jsdelivr.net/npm/highlight.js@11/styles/github.min.css)

## Architecture

See [`docs/architecture.md`](docs/architecture.md) for a detailed breakdown of the component decomposition, responsibilities, data flow, and constraints.

## Validation

Run the validation script to ensure all components meet the behavioral acceptance criteria:

```bash
node validate_site.js
```

## License

MIT
