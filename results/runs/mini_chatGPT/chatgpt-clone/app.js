// Settings Manager
const settingsButton = document.getElementById('settings-button');
const settingsModal = document.getElementById('settings-modal');
const closeSettings = document.getElementById('close-settings');
const saveKeyButton = document.getElementById('save-key-button');
const apiKeyInput = document.getElementById('api-key-input');

settingsButton.addEventListener('click', () => {
  apiKeyInput.value = localStorage.getItem('openai_api_key') || '';
  settingsModal.style.display = 'flex';
});

closeSettings.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
    settingsModal.style.display = 'none';
  }
});

saveKeyButton.addEventListener('click', () => {
  const key = apiKeyInput.value.trim();
  if (key) {
    localStorage.setItem('openai_api_key', key);
  }
  settingsModal.style.display = 'none';
});

// Message Builder
const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

function createUserMessage(text) {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message user-message';
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.textContent = text;
  
  messageDiv.appendChild(contentDiv);
  chatMessages.appendChild(messageDiv);
  scrollToBottom();
  return messageDiv;
}

function createAssistantMessage() {
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message assistant-message';
  
  const contentDiv = document.createElement('div');
  contentDiv.className = 'message-content';
  contentDiv.innerHTML = '';
  
  messageDiv.appendChild(contentDiv);
  chatMessages.appendChild(messageDiv);
  scrollToBottom();
  return { messageDiv, contentDiv };
}

function createErrorMessage(text) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'message error-message';
  errorDiv.textContent = text;
  chatMessages.appendChild(errorDiv);
  scrollToBottom();
}

function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Image Handler
const imageUploadButton = document.getElementById('image-upload-button');
const imageFileInput = document.getElementById('image-file-input');
const imagePreview = document.getElementById('image-preview');
let currentImageBase64 = null;

imageUploadButton.addEventListener('click', () => {
  imageFileInput.click();
});

imageFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file && file.type.startsWith('image/')) {
    processImageFile(file);
  }
});

messageInput.addEventListener('paste', (e) => {
  const items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const blob = items[i].getAsFile();
      processImageFile(blob);
      break;
    }
  }
});

function processImageFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    currentImageBase64 = e.target.result;
    showImagePreview(currentImageBase64);
  };
  reader.readAsDataURL(file);
}

function showImagePreview(base64) {
  imagePreview.innerHTML = '';
  
  const container = document.createElement('div');
  container.style.position = 'relative';
  
  const img = document.createElement('img');
  img.src = base64;
  img.style.maxHeight = '80px';
  
  const removeBtn = document.createElement('button');
  removeBtn.textContent = '×';
  removeBtn.className = 'remove-preview';
  removeBtn.onclick = clearImagePreview;
  
  container.appendChild(img);
  container.appendChild(removeBtn);
  imagePreview.appendChild(container);
}

function clearImagePreview() {
  imagePreview.innerHTML = '';
  currentImageBase64 = null;
}

// API Client
async function sendMessage(userText) {
  const apiKey = localStorage.getItem('openai_api_key');
  if (!apiKey) {
    createErrorMessage('API key not configured. Please set your OpenAI API key in settings.');
    settingsModal.style.display = 'flex';
    apiKeyInput.value = '';
    return;
  }

  // Disable send button and show loading state
  sendButton.disabled = true;
  const originalButtonText = sendButton.textContent;
  sendButton.textContent = 'Sending...';
  
  try {
    // Create user message
    createUserMessage(userText);
    
    // Create assistant message container
    const { messageDiv, contentDiv } = createAssistantMessage();
    
    // Prepare content parts
    const contentParts = [{ type: 'text', text: userText }];
    if (currentImageBase64) {
      contentParts.push({
        type: 'image_url',
        image_url: { url: currentImageBase64 }
      });
    }
    
    // Prepare messages array with conversation history
    const messages = [];
    const messageElements = chatMessages.querySelectorAll('.message');
    messageElements.forEach(el => {
      if (el.classList.contains('user-message')) {
        const text = el.querySelector('.message-content').textContent;
        messages.push({ role: 'user', content: text });
      } else if (el.classList.contains('assistant-message')) {
        const text = el.querySelector('.message-content').innerHTML;
        // Convert back to plain text for API (this is simplified)
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = text;
        messages.push({ role: 'assistant', content: tempDiv.textContent || tempDiv.innerText });
      }
    });
    
    // Make API call
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        stream: true,
        messages: messages
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`HTTP ${response.status}: ${errorData.error?.message || 'Unknown error'}`);
    }
    
    // Process streaming response
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let accumulatedText = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data:')) {
            const data = line.substring(5).trim();
            
            if (data === '[DONE]') {
              // Finalize message and apply syntax highlighting
              contentDiv.innerHTML = marked.parse(accumulatedText);
              scrollToBottom();
              
              // Apply syntax highlighting to code blocks
              contentDiv.querySelectorAll('pre code, code').forEach(block => {
                hljs.highlightElement(block);
              });
              
              break;
            }
            
            try {
              const parsed = JSON.parse(data);
              const delta = parsed.choices?.[0]?.delta?.content;
              
              if (delta) {
                accumulatedText += delta;
                contentDiv.innerHTML = marked.parse(accumulatedText);
                scrollToBottom();
              }
            } catch (e) {
              // Ignore parsing errors for incomplete JSON
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  } catch (error) {
    console.error('Error:', error);
    
    // Handle different error types
    if (error.message.includes('401')) {
      createErrorMessage('Invalid API key. Please check your OpenAI API key in settings.');
    } else if (error.message.includes('429')) {
      createErrorMessage('Rate limit exceeded. Please wait before sending another message.');
    } else if (error.message.includes('Failed to fetch')) {
      createErrorMessage('Connection failed. Please check your internet connection.');
    } else {
      createErrorMessage(`Error: ${error.message}`);
    }
  } finally {
    // Re-enable send button
    sendButton.disabled = false;
    sendButton.textContent = originalButtonText;
    
    // Clear image preview after sending
    clearImagePreview();
  }
}

// Send Button State & Input Wiring
sendButton.addEventListener('click', async () => {
  const text = messageInput.value.trim();
  if (text || currentImageBase64) {
    messageInput.value = '';
    await sendMessage(text);
  }
});

messageInput.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    const text = messageInput.value.trim();
    if (text || currentImageBase64) {
      messageInput.value = '';
      await sendMessage(text);
    }
  }
});
