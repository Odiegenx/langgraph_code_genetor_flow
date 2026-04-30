document.addEventListener('DOMContentLoaded', () => {
    const questionForm = document.getElementById('question-form');
    const questionInput = document.getElementById('question-input');
    const answerArea = document.getElementById('answer-area');
    const citationsList = document.getElementById('citations-list');
    const statusIndicator = document.getElementById('status-indicator');
    const loadingSpinner = document.getElementById('loading-spinner');

    // Update status on load
    updateStatus();

    questionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const question = questionInput.value.trim();
        if (!question) return;

        // Show loading state
        loadingSpinner.style.display = 'block';
        answerArea.innerHTML = '';
        citationsList.innerHTML = '';

        try {
            const response = await fetch('/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            });

            const data = await response.json();

            if (response.ok) {
                // Display answer
                answerArea.innerHTML = `<p>${data.answer}</p>`;
                
                // Display citations
                if (data.citations && data.citations.length > 0) {
                    citationsList.innerHTML = '<h4>_sources:</h4><ul>' +
                        data.citations.map(cite => 
                            `<li><strong>${cite.source}</strong> (p.${cite.page}): ${cite.snippet}</li>`
                        ).join('') + '</ul>';
                }
            } else {
                answerArea.innerHTML = `<p class="error">Error: ${data.error || 'Failed to get response'}</p>`;
            }
        } catch (err) {
            answerArea.innerHTML = `<p class="error">Network error: ${err.message}</p>`;
        } finally {
            loadingSpinner.style.display = 'none';
        }
    });

    async function updateStatus() {
        try {
            const response = await fetch('/status');
            const data = await response.json();
            
            statusIndicator.innerHTML = `
                <span>Ollama: ${data.ollama ? '🟢 Connected' : '🔴 Disconnected'}</span>
                <span>Index: ${data.indexed ? '📚 Ready' : '📝 Not Indexed'}</span>
            `;
        } catch (err) {
            statusIndicator.innerHTML = `<span class="error">Status check failed</span>`;
        }
    }

    // Poll status every 10 seconds
    setInterval(updateStatus, 10000);
});
