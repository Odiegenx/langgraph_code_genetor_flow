document.addEventListener('DOMContentLoaded', () => {
    const questionInput = document.getElementById('question-input');
    const modelSelect = document.getElementById('model-select');
    const answerModeSelect = document.getElementById('answer-mode-select');
    const submitButton = document.getElementById('submit-btn');
    const clearChatButton = document.getElementById('clear-chat-btn');
    const ingestButton = document.getElementById('ingest-btn');
    const answerSection = document.getElementById('answer-section');
    const conversationList = document.getElementById('conversation-list');
    const sourcesList = document.getElementById('sources-list');
    const loading = document.getElementById('loading');
    const ollamaStatus = document.getElementById('ollama-status');
    const indexStatus = document.getElementById('index-status');
    const conversation = [];

    updateModels();
    updateStatus();

    submitButton.addEventListener('click', async () => {
        const question = questionInput.value.trim();
        if (!question) return;

        setLoading(true);
        answerSection.classList.remove('hidden');
        const answerMode = answerModeSelect.value;
        appendMessage('user', question);
        sourcesList.innerHTML = '';

        try {
            const response = await fetch('/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },

                body: JSON.stringify({
                    question,
                    model: modelSelect.value,
                    answer_mode: answerMode,
                    conversation: conversation.slice(-6)
                })

            });

            const data = await response.json();

            if (response.ok) {
                appendMessage(
                    'assistant',
                    data.answer || 'No answer returned.',
                    data.model,
                    data.answer_mode || answerMode
                );
                questionInput.value = '';

                const sourcesHeading = document.querySelector('#answer-section h3');
                if (data.citations && data.citations.length > 0) {
                    sourcesHeading.classList.remove('hidden');
                    sourcesList.classList.remove('hidden');
                    sourcesList.innerHTML = data.citations.map(cite =>
                        `<li><strong>${escapeHtml(cite.source || 'Unknown source')}</strong> ` +
                        `(Page: ${escapeHtml(String(cite.page || 'n/a'))})<br>` +
                        `${escapeHtml(cite.snippet || '')}</li>`
                    ).join('');
                } else {
                    sourcesHeading.classList.add('hidden');
                    sourcesList.classList.add('hidden');
                }
            } else {
                appendMessage('assistant', `Error: ${data.error || 'Failed to get response'}`);
            }
        } catch (err) {
            appendMessage('assistant', `Network error: ${err.message}`);
        } finally {
            setLoading(false);
            updateStatus();
        }
    });

    clearChatButton.addEventListener('click', () => {
        conversation.length = 0;
        conversationList.innerHTML = '';
        sourcesList.innerHTML = '';
        answerSection.classList.add('hidden');
    });

    ingestButton.addEventListener('click', async () => {
        setLoading(true, 'Re-ingesting documents...');
        answerSection.classList.remove('hidden');
        sourcesList.innerHTML = '';

        try {
            const response = await fetch('/ingest', { method: 'POST' });
            const data = await response.json();
            appendMessage('assistant', response.ok
                ? data.message || 'Ingestion completed.'
                : `Ingestion failed: ${data.error || 'Unknown error'}`);
        } catch (err) {
            appendMessage('assistant', `Network error: ${err.message}`);
        } finally {
            setLoading(false);
            updateStatus();
        }
    });

    async function updateStatus() {
        try {
            const response = await fetch('/status');
            const data = await response.json();

            ollamaStatus.textContent = 'Not checked here. Answers require Ollama on localhost:11434.';
            indexStatus.textContent = data.index_ready
                ? `Ready. Documents folder: ${data.documents_available ? 'has files' : 'empty'}`
                : `Missing. Documents folder: ${data.documents_available ? 'has files' : 'empty'}`;
        } catch (err) {
            ollamaStatus.textContent = 'Unknown';
            indexStatus.textContent = `Status check failed: ${err.message}`;
        }
    }

    async function updateModels() {
        try {
            const response = await fetch('/models');
            const data = await response.json();
            const models = data.models && data.models.length > 0
                ? data.models
                : [data.default_model].filter(Boolean);

            modelSelect.innerHTML = models.map(model =>
                `<option value="${escapeHtml(model)}">${escapeHtml(model)}</option>`
            ).join('');

            if (data.default_model && models.includes(data.default_model)) {
                modelSelect.value = data.default_model;
            }

            if (data.error) {
                ollamaStatus.textContent = `Could not load model list. Using ${data.default_model}.`;
            }
        } catch (err) {
            modelSelect.innerHTML = '<option value="">Default model</option>';
            ollamaStatus.textContent = `Could not load model list: ${err.message}`;
        }
    }

    function setLoading(isLoading, message = '⏳ Processing your question...') {
        loading.textContent = message;
        loading.classList.toggle('hidden', !isLoading);
        submitButton.disabled = isLoading;
        clearChatButton.disabled = isLoading;
        ingestButton.disabled = isLoading;
        modelSelect.disabled = isLoading;
        answerModeSelect.disabled = isLoading;
    }

    function appendMessage(role, content, model = null, answerMode = null) {
        conversation.push({ role, content });
        answerSection.classList.remove('hidden');

        const message = document.createElement('article');
        message.className = `chat-message ${role}`;

        const metaParts = [role === 'user' ? 'You' : 'Assistant'];
        if (model) metaParts.push(`Model: ${model}`);
        if (answerMode) metaParts.push(`Mode: ${formatAnswerMode(answerMode)}`);

        const meta = document.createElement('div');
        meta.className = 'message-meta';
        meta.textContent = metaParts.join(' | ');

        const body = document.createElement('div');
        body.className = 'message-body';
        body.textContent = content;

        message.appendChild(meta);
        message.appendChild(body);
        conversationList.appendChild(message);
    }

    function formatAnswerMode(value) {
        if (value === 'rag') return 'RAG only';
        if (value === 'model') return 'Model only';
        if (value === 'hybrid') return 'Hybrid';
        return value;
    }

    function escapeHtml(value) {
        return value.replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[char]));
    }

    setInterval(updateStatus, 10000);
});
