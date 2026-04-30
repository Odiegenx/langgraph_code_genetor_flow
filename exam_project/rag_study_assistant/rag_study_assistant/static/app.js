document.addEventListener('DOMContentLoaded', () => {
    const questionForm = document.getElementById('question-form');
    const questionInput = document.getElementById('question-input');
    const answerContent = document.getElementById('answer-content');
    const sourcesList = document.getElementById('sources-list');
    const statusIndicator = document.getElementById('status');
    const answerSection = document.getElementById('answer-section');
    const errorMessage = document.getElementById('error-message');

    questionForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const question = questionInput.value.trim();
        if (!question) return;

        // Reset UI
        answerContent.textContent = '';
        sourcesList.innerHTML = '';
        answerSection.classList.add('hidden');
        errorMessage.classList.add('hidden');
        statusIndicator.classList.remove('hidden');

        try {
            const response = await fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question })
            });

            const data = await response.json();

            if (response.ok) {
                answerContent.textContent = data.answer || 'No answer found.';
                statusIndicator.classList.add('hidden');
                answerSection.classList.remove('hidden');

                // Render sources
                if (data.citations && data.citations.length > 0) {
                    sourcesList.innerHTML = data.citations.map(citation => `
                        <li>
                            <strong>${citation.source}</strong>
                            ${citation.page ? `(Page: ${citation.page})` : ''}
                            <blockquote>${citation.snippet}</blockquote>
                        </li>
                    `).join('');
                }
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (err) {
            statusIndicator.classList.add('hidden');
            errorMessage.classList.remove('hidden');
            answerSection.classList.add('hidden');
        }
    });
});
