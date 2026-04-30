// validate_site.js - Node.js validation script for chatgpt-clone

const fs = require('fs');
const path = require('path');

// Configuration - using bare paths since cwd is project_dir
const indexPath = 'index.html';
const cssPath = 'styles.css';
const jsPath = 'app.js';

// Required element IDs from Integration Contract
const requiredElementIds = [
  'chat-messages',
  'message-input',
  'send-button',
  'settings-button',
  'settings-modal',
  'api-key-input',
  'save-key-button',
  'close-settings',
  'image-upload-button',
  'image-file-input',
  'image-preview'
];

// Required CSS classes
const requiredCssClasses = [
  'message user-message',
  'message assistant-message',
  'message-content',
  'error-message',
  'modal-overlay',
  'preview-container'
];

// Required JS patterns
const requiredJsPatterns = [
  /localStorage\.getItem\(['"]openai_api_key['"]\)/,
  /localStorage\.setItem\(['"]openai_api_key['"]/, 
  /https:\/\/api\.openai\.com\/v1\/chat\/completions/,
  /response\.body\.getReader\(\)/,
  /marked\.parse\(/,
  /hljs\.highlightElement\(\w+\)/,
  /clipboardData\.items/,
  /readAsDataURL/,
  /image_url/,
  /stream:\s*true/
];

let passCount = 0;
let totalCount = 0;

function validateFileExists(filePath, description) {
  totalCount++;
  if (fs.existsSync(filePath)) {
    console.log(`✓ ${description} exists`);
    passCount++;
    return true;
  } else {
    console.log(`✗ ${description} does not exist`);
    return false;
  }
}

function validateHtmlContent(htmlContent) {
  console.log('\nValidating HTML content...');
  
  // Check required element IDs
  for (const id of requiredElementIds) {
    totalCount++;
    const regex = new RegExp(`id\s*=\s*['"]${id}['"]`, 'i');
    if (regex.test(htmlContent)) {
      console.log(`✓ Required element ID '${id}' found`);
      passCount++;
    } else {
      console.log(`✗ Required element ID '${id}' not found`);
    }
  }
  
  // Check for CDN dependencies
  totalCount++;
  if (htmlContent.includes('cdn.jsdelivr.net/npm/marked/marked.min.js')) {
    console.log('✓ Marked.js CDN link found');
    passCount++;
  } else {
    console.log('✗ Marked.js CDN link not found');
  }
  
  totalCount++;
  if (htmlContent.includes('cdn.jsdelivr.net/npm/highlight.js@11/highlight.min.js')) {
    console.log('✓ Highlight.js CDN link found');
    passCount++;
  } else {
    console.log('✗ Highlight.js CDN link not found');
  }
  
  totalCount++;
  if (htmlContent.includes('cdn.jsdelivr.net/npm/highlight.js@11/styles/github.min.css')) {
    console.log('✓ Highlight.js CSS theme CDN link found');
    passCount++;
  } else {
    console.log('✗ Highlight.js CSS theme CDN link not found');
  }
  
  // Check for app.js script tag
  totalCount++;
  if (htmlContent.includes('<script src="app.js"></script>') || 
      htmlContent.includes('<script src="app.js"') ||
      htmlContent.includes('src="app.js"')) {
    console.log('✓ app.js script tag found');
    passCount++;
  } else {
    console.log('✗ app.js script tag not found');
  }
  
  // Check for styles.css link tag
  totalCount++;
  if (htmlContent.includes('<link rel="stylesheet" href="styles.css">') || 
      htmlContent.includes('href="styles.css"') && htmlContent.includes('rel="stylesheet"')) {
    console.log('✓ styles.css link tag found');
    passCount++;
  } else {
    console.log('✗ styles.css link tag not found');
  }
}

function validateCssContent(cssContent) {
  console.log('\nValidating CSS content...');
  
  // Check for required CSS classes - updated to handle both descendant and class-only patterns
  for (const className of requiredCssClasses) {
    totalCount++;
    // Handle compound classes like 'message user-message'
    if (className === 'message user-message') {
      // Check for either .message.user-message or .message .user-message or standalone .user-message
      const regex1 = /\.message\s+\.user-message/i;
      const regex2 = /\.message\.user-message/i;
      const regex3 = /\.user-message/i;
      if (regex1.test(cssContent) || regex2.test(cssContent) || regex3.test(cssContent)) {
        console.log(`✓ Required CSS class pattern '.${className}' found`);
        passCount++;
      } else {
        console.log(`✗ Required CSS class pattern '.${className}' not found`);
      }
    } else if (className === 'message assistant-message') {
      // Check for either .message.assistant-message or .message .assistant-message or standalone .assistant-message
      const regex1 = /\.message\s+\.assistant-message/i;
      const regex2 = /\.message\.assistant-message/i;
      const regex3 = /\.assistant-message/i;
      if (regex1.test(cssContent) || regex2.test(cssContent) || regex3.test(cssContent)) {
        console.log(`✓ Required CSS class pattern '.${className}' found`);
        passCount++;
      } else {
        console.log(`✗ Required CSS class pattern '.${className}' not found`);
      }
    } else {
      const classPattern = className.replace(/ /g, '\\s+');
      const regex = new RegExp(`\\.${classPattern}`, 'i');
      
      if (regex.test(cssContent)) {
        console.log(`✓ Required CSS class pattern '.${className}' found`);
        passCount++;
      } else {
        console.log(`✗ Required CSS class pattern '.${className}' not found`);
      }
    }
  }
  
  // Check for flexbox layout
  totalCount++;
  if (cssContent.includes('display: flex') && cssContent.includes('flex-direction: column')) {
    console.log('✓ Flexbox column layout found');
    passCount++;
  } else {
    console.log('✗ Flexbox column layout not found');
  }
  
  // Check for scrollable messages container
  totalCount++;
  if (cssContent.includes('#chat-messages') && 
      (cssContent.includes('overflow-y: auto') || cssContent.includes('overflow-y: scroll'))) {
    console.log('✓ Scrollable chat-messages container found');
    passCount++;
  } else {
    console.log('✗ Scrollable chat-messages container not found');
  }
  
  // Check for message styling
  totalCount++;
  if (cssContent.includes('.user-message') && cssContent.includes('.assistant-message')) {
    console.log('✓ User and assistant message styling found');
    passCount++;
  } else {
    console.log('✗ User and assistant message styling not found');
  }
}

function validateJsContent(jsContent) {
  console.log('\nValidating JavaScript content...');
  
  // Check for required JS patterns
  for (const pattern of requiredJsPatterns) {
    totalCount++;
    if (pattern.test(jsContent)) {
      console.log(`✓ Required JS pattern '${pattern}' found`);
      passCount++;
    } else {
      console.log(`✗ Required JS pattern '${pattern}' not found`);
    }
  }
  
  // Check for localStorage usage
  totalCount++;
  if (jsContent.includes('localStorage.getItem') && jsContent.includes('localStorage.setItem')) {
    console.log('✓ localStorage usage for API key found');
    passCount++;
  } else {
    console.log('✗ localStorage usage for API key not found');
  }
  
  // Check for streaming implementation
  totalCount++;
  if (jsContent.includes('getReader') && jsContent.includes('reader.read')) {
    console.log('✓ ReadableStream API usage for streaming found');
    passCount++;
  } else {
    console.log('✗ ReadableStream API usage for streaming not found');
  }
  
  // Check for markdown rendering
  totalCount++;
  if (jsContent.includes('marked.parse')) {
    console.log('✓ Marked.js markdown rendering found');
    passCount++;
  } else {
    console.log('✗ Marked.js markdown rendering not found');
  }
  
  // Check for code highlighting
  totalCount++;
  if (jsContent.includes('hljs.highlightElement')) {
    console.log('✓ Highlight.js code highlighting found');
    passCount++;
  } else {
    console.log('✗ Highlight.js code highlighting not found');
  }
  
  // Check for image handling
  totalCount++;
  if ((jsContent.includes('clipboardData.items') || jsContent.includes('paste')) && 
      jsContent.includes('readAsDataURL')) {
    console.log('✓ Image handling (paste/FileReader) found');
    passCount++;
  } else {
    console.log('✗ Image handling (paste/FileReader) not found');
  }
}

// Main validation function
async function validateSite() {
  console.log('Running validation for chatgpt-clone...\n');
  
  // Validate file existence
  const htmlExists = validateFileExists(indexPath, 'index.html');
  const cssExists = validateFileExists(cssPath, 'styles.css');
  const jsExists = validateFileExists(jsPath, 'app.js');
  
  if (!htmlExists || !cssExists || !jsExists) {
    console.log('\n❌ Critical files missing. Cannot continue validation.');
    process.exit(1);
  }
  
  // Read file contents
  const htmlContent = fs.readFileSync(indexPath, 'utf8');
  const cssContent = fs.readFileSync(cssPath, 'utf8');
  const jsContent = fs.readFileSync(jsPath, 'utf8');
  
  // Validate HTML
  validateHtmlContent(htmlContent);
  
  // Validate CSS
  validateCssContent(cssContent);
  
  // Validate JS
  validateJsContent(jsContent);
  
  // Summary
  console.log(`\n\nValidation Summary: ${passCount}/${totalCount} checks passed`);
  
  if (passCount === totalCount) {
    console.log('✅ All validations passed!');
    process.exit(0);
  } else {
    console.log('❌ Some validations failed. Please check the issues above.');
    process.exit(1);
  }
}

// Run validation
validateSite().catch(err => {
  console.error('Validation error:', err);
  process.exit(1);
});
