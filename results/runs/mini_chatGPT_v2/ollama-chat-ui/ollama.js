// Detect which model to use based on image presence
function detectModel(imageBase64) {
  return imageBase64 ? 'minicpm-v:latest' : 'qwen3:8b';
}

// Send chat request to Ollama
async function sendChatRequest(messages, imageBase64) {
  // Create a deep copy of messages to avoid mutating the original
  const messagesCopy = JSON.parse(JSON.stringify(messages));
  
  // If we have an image, modify the last user message
  if (imageBase64 && messagesCopy.length > 0) {
    const lastMessage = messagesCopy[messagesCopy.length - 1];
    if (lastMessage.role === 'user') {
      // Convert content to multimodal array if it's a string
      if (typeof lastMessage.content === 'string') {
        lastMessage.content = [
          { type: 'text', text: lastMessage.content },
          { type: 'image_url', image_url: { url: imageBase64 } }
        ];
      }
      // If content is already an array, append the image
      else if (Array.isArray(lastMessage.content)) {
        lastMessage.content.push({ type: 'image_url', image_url: { url: imageBase64 } });
      }
    }
  }
  
  // Determine model
  const model = detectModel(imageBase64);
  
  // Prepare request payload
  const payload = {
    model: model,
    messages: messagesCopy,
    stream: false
  };
  
  // Make API request
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return { content: data.message.content };
}

// Make functions available globally
window.detectModel = detectModel;
window.sendChatRequest = sendChatRequest;
