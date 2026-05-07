document.addEventListener('DOMContentLoaded', () => {
    const questionInput = document.getElementById('question-input');
    const submitButton = document.getElementById('submit-btn');
    const ingestButton = document.getElementById('ingest-btn');
    const answerSection = document.getElementById('answer-section');
    const answerContent = document.getElementById('answer-content');
    const sourcesList = document.getElementById('sources-list');
    const loading = document.getElementById('loading');
    const ollamaStatus = document.getElementById('ollama-status');
    const indexStatus = document.getElementById('index-status');
    const useRagCheckbox = document.getElementById('use-rag-checkbox');

    updateStatus();

    submitButton.addEventListener('click', async () => {
        const question = questionInput.value.trim();
        if (!question) return;

        setLoading(true);
        answerSection.classList.remove('hidden');
        answerContent.textContent = '';
        sourcesList.innerHTML = '';

        try {
            const useRag = useRagCheckbox.checked;
            const response = await fetch('/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, use_rag: useRag })
            });

            const data = await response.json();

            if (response.ok) {
                answerContent.textContent = data.answer || 'No answer returned.';

                const sourcesHeading = document.querySelector('#answer-section h3');
                if (useRag && data.citations && data.citations.length > 0) {
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

    function setLoading(isLoading, message = '⏳ Processing your question...') {
        loading.textContent = message;
        loading.classList.toggle('hidden', !isLoading);
        submitButton.disabled = isLoading;
        ingestButton.disabled = isLoading;
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
