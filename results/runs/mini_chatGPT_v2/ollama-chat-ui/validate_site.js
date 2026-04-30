const fs = require('fs');
const path = require('path');

const projectDir = '.';
const indexPath = path.join(projectDir, 'index.html');
const cssPath = path.join(projectDir, 'styles.css');
const appJsPath = path.join(projectDir, 'app.js');
const ollamaJsPath = path.join(projectDir, 'ollama.js');

let allPassed = true;

function logResult(passed, message) {
  if (!passed) allPassed = false;
  console.log(`${passed ? 'PASS' : 'FAIL'}: ${message}`);
}

// Expected values from contract
const expectedIds = [
  'sidebar', 'new-chat-btn', 'conversation-list',
  'chat-area', 'messages-container', 'input-area',
  'message-input', 'image-preview-container', 'image-preview',
  'remove-image-btn', 'send-btn'
];

const expectedClasses = [
  '.conversation-item', '.conversation-item.active', '.conversation-item-name',
  '.conversation-item-actions', '.rename-btn', '.delete-btn',
  '.message', '.user-message', '.ai-message',
  '.message-content', '.message-image', '.hidden'
];

const expectedAppFunctions = [
  'initApp', 'loadConversations', 'saveConversations',
  'createNewConversation', 'switchConversation', 'renameConversation',
  'deleteConversation', 'renderSidebar', 'renderMessages',
  'handleSendMessage', 'handleImagePaste', 'handleImageDrop',
  'removeImage', 'showImagePreview'
];

const expectedOllamaFunctions = ['detectModel', 'sendChatRequest'];

try {
  const htmlContent = fs.readFileSync(indexPath, 'utf-8');
  
  // Check HTML IDs
  const idMatches = htmlContent.match(/id="([^"]+)"/g);
  const htmlIds = idMatches ? idMatches.map(m => m.slice(4, -1)) : [];
  
  for (const id of expectedIds) {
    logResult(htmlIds.includes(id), `HTML element ID '${id}' exists`);
  }
  
  // Check CSS Selectors
  const cssContent = fs.readFileSync(cssPath, 'utf-8');
  
  for (const id of expectedIds) {
    const selectorFound = cssContent.includes(`#${id}`);
    logResult(selectorFound, `CSS selector '#${id}' exists`);
  }
  
  for (const cls of expectedClasses) {
    const selectorFound = cssContent.includes(cls);
    logResult(selectorFound, `CSS selector '${cls}' exists`);
  }
  
  // Check JS Functions
  const appJsContent = fs.readFileSync(appJsPath, 'utf-8');
  
  for (const func of expectedAppFunctions) {
    const funcRegex = new RegExp(`function\\s+${func}\\s*\\(`);
    const arrowFuncRegex = new RegExp(`const\\s+${func}\\s*=\\s*`);
    const funcExists = funcRegex.test(appJsContent) || arrowFuncRegex.test(appJsContent);
    logResult(funcExists, `Function '${func}' exists in app.js`);
  }
  
  // Check element ID wiring in app.js
  for (const id of expectedIds) {
    const getIdCall = `getElementById('${id}')`;
    const querySelectorCall = `querySelector('#${id}')`;
    const idUsed = appJsContent.includes(getIdCall) || appJsContent.includes(querySelectorCall);
    logResult(idUsed, `Element ID '${id}' is referenced in app.js`);
  }
  
  // Check localStorage usage
  const localStorageUsed = appJsContent.includes('localStorage');
  logResult(localStorageUsed, `localStorage is used in app.js`);
  
  // Check createElement calls
  const createElementForMessage = appJsContent.includes("createElement('div')") && (appJsContent.includes('.message') || (appJsContent.includes('className') && appJsContent.includes('message')));
  const createElementForConvItem = appJsContent.includes("createElement('div')") && (appJsContent.includes('.conversation-item') || (appJsContent.includes('className') && appJsContent.includes('conversation-item')));
  logResult(createElementForMessage, `Dynamic creation of '.message' elements`);
  logResult(createElementForConvItem, `Dynamic creation of '.conversation-item' elements`);
  
  // Check send button disable logic
  const sendBtnDisableLogic = appJsContent.includes('send-btn') && 
    (appJsContent.includes("disabled = true") || 
     appJsContent.includes("setAttribute('disabled'") || 
     appJsContent.includes("removeAttribute('disabled'"));
  logResult(sendBtnDisableLogic, `Send button disable logic exists`);
  
  // Check ollama.js functions
  const ollamaJsContent = fs.readFileSync(ollamaJsPath, 'utf-8');
  
  for (const func of expectedOllamaFunctions) {
    const funcRegex = new RegExp(`function\\s+${func}\\s*\\(`);
    const arrowFuncRegex = new RegExp(`const\\s+${func}\\s*=\\s*`);
    const funcExists = funcRegex.test(ollamaJsContent) || arrowFuncRegex.test(ollamaJsContent);
    logResult(funcExists, `Function '${func}' exists in ollama.js`);
  }
  
  // Check sendChatRequest signature
  const sendChatRequestParamCheck = ollamaJsContent.includes('(messages') || ollamaJsContent.includes('function sendChatRequest(messages');
  logResult(sendChatRequestParamCheck, `sendChatRequest accepts 'messages' parameter`);
  
  // Check model detection logic
  const minicpmCheck = ollamaJsContent.includes('minicpm-v:latest');
  const qwenCheck = ollamaJsContent.includes('qwen3:8b');
  logResult(minicpmCheck && qwenCheck, `Model detection logic references both models`);
  
  // Check Ollama endpoint and stream setting
  const endpointCheck = ollamaJsContent.includes('http://localhost:11434/api/chat');
  const streamFalseCheck = ollamaJsContent.includes('stream: false');
  logResult(endpointCheck, `Ollama endpoint URL is correct`);
  logResult(streamFalseCheck, `Stream is set to false`);
  
} catch (error) {
  console.error('Validation script failed with error:', error);
  process.exit(1);
}

process.exit(allPassed ? 0 : 1);
