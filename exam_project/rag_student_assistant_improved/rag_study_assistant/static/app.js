document.addEventListener('DOMContentLoaded', () => {
    const questionInput = document.getElementById('question-input');
    const modelSelect = document.getElementById('model-select');
    const submitButton = document.getElementById('submit-btn');
    const ingestButton = document.getElementById('ingest-btn');
    const answerSection = document.getElementById('answer-section');
    const answerContent = document.getElementById('answer-content');
    const sourcesList = document.getElementById('sources-list');
    const loading = document.getElementById('loading');
    const ollamaStatus = document.getElementById('ollama-status');
    const indexStatus = document.getElementById('index-status');

    updateModels();
    updateStatus();

    submitButton.addEventListener('click', async () => {
        const question = questionInput.value.trim();
        if (!question) return;

        setLoading(true);
        answerSection.classList.remove('hidden');
        answerContent.textContent = '';
        sourcesList.innerHTML = '';

        try {
            const response = await fetch('/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question,
                    model: modelSelect.value
                })
            });

            const data = await response.json();

            if (response.ok) {
                answerContent.textContent = data.model
                    ? `Model: ${data.model}\n\n${data.answer || 'No answer returned.'}`
                    : data.answer || 'No answer returned.';

                if (data.citations && data.citations.length > 0) {
                    sourcesList.innerHTML = data.citations.map(cite =>
                        `<li><strong>${escapeHtml(cite.source || 'Unknown source')}</strong> ` +
                        `(Page: ${escapeHtml(String(cite.page || 'n/a'))})<br>` +
                        `${escapeHtml(cite.snippet || '')}</li>`
                    ).join('');
                }
            } else {
                answerContent.textContent = `Error: ${data.error || 'Failed to get response'}`;
            }
        } catch (err) {
            answerContent.textContent = `Network error: ${err.message}`;
        } finally {
            setLoading(false);
            updateStatus();
        }
    });

    ingestButton.addEventListener('click', async () => {
        setLoading(true, 'Re-ingesting documents...');
        answerSection.classList.remove('hidden');
        answerContent.textContent = '';
        sourcesList.innerHTML = '';

        try {
            const response = await fetch('/ingest', { method: 'POST' });
            const data = await response.json();
            answerContent.textContent = response.ok
                ? data.message || 'Ingestion completed.'
                : `Ingestion failed: ${data.error || 'Unknown error'}`;
        } catch (err) {
            answerContent.textContent = `Network error: ${err.message}`;
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
        ingestButton.disabled = isLoading;
        modelSelect.disabled = isLoading;
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
