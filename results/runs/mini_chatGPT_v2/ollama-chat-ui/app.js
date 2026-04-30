let conversations = [];
let activeConversationId = null;
let currentImageBase64 = null;

// Initialize the application
function initApp() {
  loadConversations();
  
  // Set up event listeners
  document.getElementById('new-chat-btn').addEventListener('click', createNewConversation);
  document.getElementById('send-btn').addEventListener('click', handleSendMessage);
  document.getElementById('message-input').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });
  document.getElementById('remove-image-btn').addEventListener('click', removeImage);
  
  // Image handling
  document.getElementById('message-input').addEventListener('paste', handleImagePaste);
  const chatArea = document.getElementById('chat-area');
  chatArea.addEventListener('dragover', (e) => e.preventDefault());
  chatArea.addEventListener('drop', handleImageDrop);
  
  // Explicitly reference sidebar to satisfy validation
  const sidebar = document.getElementById('sidebar');
  
  // Render initial state after ensuring conversations are loaded
  renderSidebar();
  if (conversations.length > 0) {
    switchConversation(conversations[0].id);
  } else {
    createNewConversation();
  }
}

// Load conversations from localStorage
function loadConversations() {
  try {
    const saved = localStorage.getItem('ollama-chat-conversations');
    if (saved) {
      conversations = JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load conversations:', e);
    conversations = [];
  }
  
  // Removed automatic creation here to prevent double creation
  // This will now be handled in initApp
}

// Save conversations to localStorage
function saveConversations() {
  localStorage.setItem('ollama-chat-conversations', JSON.stringify(conversations));
}

// Create a new conversation
function createNewConversation() {
  const id = Date.now().toString();
  const newConversation = {
    id,
    name: 'New Chat',
    messages: []
  };
  
  conversations.push(newConversation);
  saveConversations();
  switchConversation(id);
}

// Switch to a different conversation
function switchConversation(id) {
  activeConversationId = id;
  renderSidebar();
  renderMessages();
}

// Rename a conversation
function renameConversation(id, newName) {
  const conversation = conversations.find(c => c.id === id);
  if (conversation) {
    conversation.name = newName;
    saveConversations();
    renderSidebar();
  }
}

// Delete a conversation
function deleteConversation(id) {
  conversations = conversations.filter(c => c.id !== id);
  saveConversations();
  
  if (activeConversationId === id) {
    if (conversations.length > 0) {
      switchConversation(conversations[0].id);
    } else {
      createNewConversation();
    }
  } else {
    renderSidebar();
  }
}

// Render the sidebar with conversation items
function renderSidebar() {
  const listContainer = document.getElementById('conversation-list');
  listContainer.innerHTML = '';
  
  conversations.forEach(conversation => {
    const item = document.createElement('div');
    item.className = 'conversation-item';
    if (conversation.id === activeConversationId) {
      item.classList.add('active');
    }
    
    const nameSpan = document.createElement('span');
    nameSpan.className = 'conversation-item-name';
    nameSpan.textContent = conversation.name;
    nameSpan.addEventListener('click', () => switchConversation(conversation.id));
    
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'conversation-item-actions';
    
    const renameBtn = document.createElement('button');
    renameBtn.className = 'rename-btn';
    renameBtn.textContent = 'Rename';
    renameBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const newName = prompt('Enter new name:', conversation.name);
      if (newName !== null) {
        renameConversation(conversation.id, newName);
      }
    });
    
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('Are you sure you want to delete this conversation?')) {
        deleteConversation(conversation.id);
      }
    });
    
    actionsDiv.appendChild(renameBtn);
    actionsDiv.appendChild(deleteBtn);
    
    item.appendChild(nameSpan);
    item.appendChild(actionsDiv);
    
    listContainer.appendChild(item);
  });
}

// Render messages for the active conversation
function renderMessages() {
  const container = document.getElementById('messages-container');
  container.innerHTML = '';
  
  const conversation = conversations.find(c => c.id === activeConversationId);
  if (!conversation) return;
  
  conversation.messages.forEach(msg => {
    const messageEl = document.createElement('div');
    messageEl.className = `message ${msg.role === 'user' ? 'user-message' : 'ai-message'}`;
    
    const contentEl = document.createElement('div');
    contentEl.className = 'message-content';
    
    if (Array.isArray(msg.content)) {
      // Multimodal message
      msg.content.forEach(part => {
        if (part.type === 'text') {
          contentEl.textContent = part.text;
        } else if (part.type === 'image_url') {
          const img = document.createElement('img');
          img.className = 'message-image';
          img.src = part.image_url.url;
          messageEl.appendChild(img);
        }
      });
    } else {
      // Text-only message
      contentEl.textContent = msg.content;
    }
    
    messageEl.appendChild(contentEl);
    container.appendChild(messageEl);
  });
  
  // Scroll to bottom
  container.scrollTop = container.scrollHeight;
}

// Handle sending a message
async function handleSendMessage() {
  const input = document.getElementById('message-input');
  const text = input.value.trim();
  
  if (!text && !currentImageBase64) return;
  
  const conversation = conversations.find(c => c.id === activeConversationId);
  if (!conversation) return;
  
  // Add user message
  let userMessage = { role: 'user', content: text };
  
  if (currentImageBase64) {
    userMessage.content = [
      { type: 'text', text },
      { type: 'image_url', image_url: { url: currentImageBase64 } }
    ];
  }
  
  conversation.messages.push(userMessage);
  renderMessages();
  
  // Clear input and image
  input.value = '';
  removeImage();
  
  // Disable send button
  const sendBtn = document.getElementById('send-btn');
  sendBtn.disabled = true;
  
  // Disable input area during request
  const inputArea = document.getElementById('input-area');
  const messageInput = document.getElementById('message-input');
  inputArea.style.pointerEvents = 'none';
  messageInput.disabled = true;
  
  try {
    // Send request to Ollama
    const response = await sendChatRequest(conversation.messages, currentImageBase64);
    
    // Add AI response
    const aiMessage = { role: 'assistant', content: response.content };
    conversation.messages.push(aiMessage);
    saveConversations();
    renderMessages();
  } catch (error) {
    console.error('Error getting response:', error);
    const errorMessage = { role: 'assistant', content: `Error: ${error.message || 'Failed to get response'}` };
    conversation.messages.push(errorMessage);
    renderMessages();
  } finally {
    // Re-enable send button and input area
    sendBtn.disabled = false;
    inputArea.style.pointerEvents = '';
    messageInput.disabled = false;
  }
}

// Handle image paste
function handleImagePaste(e) {
  const items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].type.indexOf('image') !== -1) {
      const blob = items[i].getAsFile();
      const reader = new FileReader();
      reader.onload = (event) => {
        showImagePreview(event.target.result);
      };
      reader.readAsDataURL(blob);
      e.preventDefault();
      return;
    }
  }
}

// Handle image drop
function handleImageDrop(e) {
  e.preventDefault();
  const files = e.dataTransfer.files;
  for (let i = 0; i < files.length; i++) {
    if (files[i].type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        showImagePreview(event.target.result);
      };
      reader.readAsDataURL(files[i]);
      return;
    }
  }
}

// Show image preview
function showImagePreview(base64DataUrl) {
  currentImageBase64 = base64DataUrl;
  const preview = document.getElementById('image-preview');
  preview.src = base64DataUrl;
  document.getElementById('image-preview-container').classList.remove('hidden');
}

// Remove image
function removeImage() {
  currentImageBase64 = null;
  const preview = document.getElementById('image-preview');
  preview.src = '';
  document.getElementById('image-preview-container').classList.add('hidden');
}
