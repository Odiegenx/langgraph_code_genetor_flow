document.addEventListener('DOMContentLoaded', () => {
    const questionInput = document.getElementById('question-input');
    const modelSelect = document.getElementById('model-select');
    const submitButton = document.getElementById('submit-btn');
    const ingestButton = document.getElementById('ingest-btn');
    const uploadButton = document.getElementById('upload-btn');
    const closeUploadButton = document.getElementById('close-upload-btn');
    const uploadSection = document.getElementById('upload-section');
    const answerSection = document.getElementById('answer-section');
    const answerContent = document.getElementById('answer-content');
    const sourcesList = document.getElementById('sources-list');
    const loading = document.getElementById('loading');
    const ollamaStatus = document.getElementById('ollama-status');
    const indexStatus = document.getElementById('index-status');
    
    // Upload elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadStatus = document.getElementById('upload-status');

    const useRagCheckbox = document.getElementById('use-rag-checkbox');

    updateModels();
    updateStatus();
    initializeUpload();

    uploadButton.addEventListener('click', () => {
        uploadSection.classList.toggle('hidden');
    });

    closeUploadButton.addEventListener('click', () => {
        uploadSection.classList.add('hidden');
    });

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

                body: JSON.stringify({
                    question,
                    model: modelSelect.value,
                    use_rag: useRag
                })

            });

            const data = await response.json();

            if (response.ok) {
                answerContent.textContent = data.model
                    ? `Model: ${data.model}\n\n${data.answer || 'No answer returned.'}`
                    : data.answer || 'No answer returned.';

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
        uploadButton.disabled = isLoading;
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

    function initializeUpload() {
        // Click to browse files
        dropZone.addEventListener('click', () => fileInput.click());
        
        // File input change handler
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                uploadFiles(e.target.files);
            }
        });

        // Drag and drop handlers
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('drag-over');
        });

        dropZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
        });

        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('drag-over');
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                uploadFiles(files);
            }
        });
    }

    async function uploadFiles(files) {
        const formData = new FormData();
        
        // Add files to form data
        for (let file of files) {
            formData.append('files', file);
        }

        setLoading(true, 'Uploading files...');
        showUploadStatus('Uploading files...', 'info');

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                showUploadStatus(data.message, 'success');
                // Clear file input
                fileInput.value = '';
                // Update status to reflect new documents
                setTimeout(updateStatus, 1000);
            } else {
                showUploadStatus(`Upload failed: ${data.error}`, 'error');
            }
        } catch (err) {
            showUploadStatus(`Upload error: ${err.message}`, 'error');
        } finally {
            setLoading(false);
        }
    }

    function showUploadStatus(message, type) {
        uploadStatus.textContent = message;
        uploadStatus.className = type === 'success' ? 'success' : 
                                 type === 'error' ? 'error' : '';
        uploadStatus.classList.remove('hidden');
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                uploadStatus.classList.add('hidden');
            }, 5000);
        }
    }

    setInterval(updateStatus, 10000);
});
