document.addEventListener('DOMContentLoaded', () => {
    const questionInput = document.getElementById('question-input');
    const modelSelect = document.getElementById('model-select');
    const answerModeSelect = document.getElementById('answer-mode-select');
    const submitButton = document.getElementById('submit-btn');
    const ingestButton = document.getElementById('ingest-btn');
    const answerSection = document.getElementById('answer-section');
    const conversationList = document.getElementById('conversation-list');
    const conversationSessionList = document.getElementById('conversation-session-list');
    const newConversationButton = document.getElementById('new-conversation-btn');
    const sourcesList = document.getElementById('sources-list');
    const loading = document.getElementById('loading');
    const ollamaStatus = document.getElementById('ollama-status');
    const indexStatus = document.getElementById('index-status');
    let conversation = [];
    let conversations = [];
    let activeConversationId = null;
    let activeMessageCount = 0;
    let summaryTriggerMessages = 10;

    updateModels();
    updateStatus();
    loadConversations();

    submitButton.addEventListener('click', async () => {
        const question = questionInput.value.trim();
        if (!question) return;

        const willSummarize = activeMessageCount > summaryTriggerMessages;
        setLoading(
            true,
            willSummarize
                ? 'Summarizing older conversation, then answering...'
                : 'Processing your question...'
        );
        answerSection.classList.remove('hidden');
        const answerMode = answerModeSelect.value;
        sourcesList.innerHTML = '';

        try {
            const response = await fetch('/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },

                body: JSON.stringify({
                    question,
                    conversation_id: activeConversationId,
                    model: modelSelect.value,
                    answer_mode: answerMode
                })

            });

            const data = await response.json();

            if (response.ok) {
                renderConversationPayload(data.conversation || {});
                activeConversationId = data.conversation && data.conversation.conversation_id
                    ? data.conversation.conversation_id
                    : activeConversationId;
                await loadConversations(activeConversationId);
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
                renderTransientMessage('assistant', `Error: ${data.error || 'Failed to get response'}`);
            }
        } catch (err) {
            renderTransientMessage('assistant', `Network error: ${err.message}`);
        } finally {
            setLoading(false);
            updateStatus();
        }
    });

    newConversationButton.addEventListener('click', async () => {
        setLoading(true, 'Creating conversation...');
        try {
            const response = await fetch('/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'New conversation' })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Could not create conversation');
            }
            conversations = data.conversations || [];
            activeConversationId = data.conversation.id;
            renderConversationSessions();
            await loadConversation(activeConversationId);
        } catch (err) {
            renderTransientMessage('assistant', `Could not create conversation: ${err.message}`);
        } finally {
            setLoading(false);
        }
    });

    ingestButton.addEventListener('click', async () => {
        setLoading(true, 'Re-ingesting documents...');
        answerSection.classList.remove('hidden');
        sourcesList.innerHTML = '';

        try {
            const response = await fetch('/ingest', { method: 'POST' });
            const data = await response.json();
            renderTransientMessage('assistant', response.ok
                ? data.message || 'Ingestion completed.'
                : `Ingestion failed: ${data.error || 'Unknown error'}`);
        } catch (err) {
            renderTransientMessage('assistant', `Network error: ${err.message}`);
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

    async function loadConversations(preferredConversationId = null) {
        try {
            const response = await fetch('/conversations');
            const data = await response.json();
            conversations = data.conversations || [];
            if (!conversations.length) {
                renderConversationSessions();
                renderConversation([]);
                return;
            }

            activeConversationId = preferredConversationId
                || activeConversationId
                || conversations[0].id;

            if (!conversations.some(item => item.id === activeConversationId)) {
                activeConversationId = conversations[0].id;
            }

            renderConversationSessions();
            await loadConversation(activeConversationId);
        } catch (err) {
            renderTransientMessage('assistant', `Could not load conversations: ${err.message}`);
        }
    }

    async function loadConversation(conversationId) {
        try {
            const response = await fetch(`/conversation/${encodeURIComponent(conversationId)}`);
            const data = await response.json();
            activeConversationId = data.conversation_id || conversationId;
            renderConversationPayload(data);
            renderConversationSessions();
        } catch (err) {
            renderTransientMessage('assistant', `Could not load conversation: ${err.message}`);
        }
    }

    function setLoading(isLoading, message = 'Processing your question...') {
        loading.textContent = message;
        loading.classList.toggle('hidden', !isLoading);
        submitButton.disabled = isLoading;
        ingestButton.disabled = isLoading;
        modelSelect.disabled = isLoading;
        answerModeSelect.disabled = isLoading;
        newConversationButton.disabled = isLoading;
    }

    function renderConversationSessions() {
        conversationSessionList.innerHTML = '';

        if (!conversations.length) {
            const empty = document.createElement('p');
            empty.className = 'empty-conversation-list';
            empty.textContent = 'No conversations yet.';
            conversationSessionList.appendChild(empty);
            return;
        }

        conversations.forEach(item => {
            const row = document.createElement('div');
            row.className = `conversation-session-row ${item.id === activeConversationId ? 'active' : ''}`;

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'conversation-session';
            button.textContent = item.title || 'New conversation';
            button.title = item.title || 'New conversation';
            button.addEventListener('click', () => {
                if (item.id !== activeConversationId) {
                    sourcesList.innerHTML = '';
                    loadConversation(item.id);
                }
            });

            const archiveButton = document.createElement('button');
            archiveButton.type = 'button';
            archiveButton.className = 'archive-conversation-btn';
            archiveButton.textContent = 'Archive';
            archiveButton.title = `Archive ${item.title || 'conversation'}`;
            archiveButton.addEventListener('click', event => {
                event.stopPropagation();
                archiveConversation(item.id);
            });

            row.appendChild(button);
            row.appendChild(archiveButton);
            conversationSessionList.appendChild(row);
        });
    }

    async function archiveConversation(conversationId) {
        const conversationMeta = conversations.find(item => item.id === conversationId);
        const title = conversationMeta ? conversationMeta.title : 'this conversation';
        if (!confirm(`Archive "${title}"? It will be hidden from the list but kept on disk.`)) {
            return;
        }

        setLoading(true, 'Archiving conversation...');
        try {
            const response = await fetch(`/conversation/${encodeURIComponent(conversationId)}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Could not archive conversation');
            }

            conversations = data.conversations || [];
            activeConversationId = data.active_conversation_id || (conversations[0] && conversations[0].id) || null;
            renderConversationSessions();
            sourcesList.innerHTML = '';

            if (activeConversationId) {
                await loadConversation(activeConversationId);
            } else {
                renderConversation([]);
            }
        } catch (err) {
            renderTransientMessage('assistant', `Could not archive conversation: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }

    function renderConversationPayload(data) {
        if (typeof data.summary_trigger_messages === 'number') {
            summaryTriggerMessages = data.summary_trigger_messages;
        }

        activeMessageCount = typeof data.active_message_count === 'number'
            ? data.active_message_count
            : (data.messages || []).length;

        renderConversation([
            ...(data.archive || []),
            ...(data.messages || [])
        ]);
    }

    function renderConversation(messages) {
        conversation = messages;
        conversationList.innerHTML = '';
        if (!conversation.length) {
            answerSection.classList.add('hidden');
            return;
        }

        answerSection.classList.remove('hidden');
        conversation.forEach(message => {
            appendMessageElement(
                message.role,
                message.content,
                message.model,
                message.answer_mode
            );
        });
    }

    function renderTransientMessage(role, content) {
        answerSection.classList.remove('hidden');
        appendMessageElement(role, content);
    }

    function appendMessageElement(role, content, model = null, answerMode = null) {
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
