// validate_site.js - Project validation script
const fs = require('fs');
const path = require('path');

// Validation results
const results = {
  passed: true,
  errors: [],
  warnings: []
};

// Helper functions
function addError(message) {
  results.passed = false;
  results.errors.push(message);
}

function addWarning(message) {
  results.warnings.push(message);
}

// Check file existence
function checkFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    addError(`Missing file: ${filePath}`);
    return false;
  }
  return true;
}

// Validate HTML structure
function validateHTML(htmlPath, requiredElements) {
  if (!checkFileExists(htmlPath)) return;
  
  const content = fs.readFileSync(htmlPath, 'utf8');
  
  requiredElements.forEach(selector => {
    // For class selectors like .game-container, we look for class="game-container"
    if (selector.startsWith('.')) {
      const className = selector.substring(1);
      const regex = new RegExp(`class="[^"]*\\b${className}\\b[^"]*"`, 'i');
      if (!regex.test(content)) {
        addError(`Missing element in ${htmlPath}: ${selector}`);
      }
    } 
    // For id selectors like #game-canvas, we look for id="game-canvas"
    else if (selector.startsWith('#')) {
      const idName = selector.substring(1);
      const regex = new RegExp(`id="${idName}"`, 'i');
      if (!regex.test(content)) {
        addError(`Missing element in ${htmlPath}: ${selector}`);
      }
    }
  });
}

// Validate JavaScript syntax
function validateJSSyntax(jsPath) {
  if (!checkFileExists(jsPath)) return;
  
  try {
    const content = fs.readFileSync(jsPath, 'utf8');
    new Function(content);
  } catch (e) {
    addError(`JavaScript syntax error in ${jsPath}: ${e.message}`);
  }
}

// Validate JS function exports
function validateJSFunctions(jsPath, requiredFunctions) {
  if (!checkFileExists(jsPath)) return;
  
  const content = fs.readFileSync(jsPath, 'utf8');
  
  requiredFunctions.forEach(funcName => {
    const regex = new RegExp(`function\\s+${funcName}\\s*\\(`);
    const altRegex = new RegExp(`${funcName}\\s*=\\s*function`);
    const arrowRegex = new RegExp(`const\\s+${funcName}\\s*=\\s*\\(`);
    
    if (!regex.test(content) && !altRegex.test(content) && !arrowRegex.test(content)) {
      // Check for method definition (init function might be defined this way)
      const methodRegex = new RegExp(`${funcName}\\s*\\(`);
      if (!methodRegex.test(content)) {
        addError(`Missing function ${funcName} in ${jsPath}`);
      }
    }
  });
}

// Main validation logic
function validateProject() {
  // Worker A files
  validateHTML('index.html', ['.game-container', '.game-header', '.game-title', '.game-card']);
  checkFileExists('styles.css');
  validateJSSyntax('game-select.js');
  
  // Worker B files
  validateHTML('snake.html', ['.game-container', '.game-header', '.btn-back', '.game-title', '#game-canvas']);
  validateJSSyntax('snake.js');
  validateJSFunctions('snake.js', ['init']);
  
  validateHTML('tictactoe.html', ['.game-container', '.game-header', '.btn-back', '.game-title', '#board']);
  validateJSSyntax('tictactoe.js');
  validateJSFunctions('tictactoe.js', ['init']);
  
  validateHTML('memory.html', ['.game-container', '.game-header', '.btn-back', '.game-title', '#card-grid']);
  validateJSSyntax('memory.js');
  validateJSFunctions('memory.js', ['init']);
  
  // Check links between files
  const indexPath = 'index.html';
  if (checkFileExists(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    if (!indexContent.includes('snake.html')) addError('Missing link to snake.html in index.html');
    if (!indexContent.includes('tictactoe.html')) addError('Missing link to tictactoe.html in index.html');
    if (!indexContent.includes('memory.html')) addError('Missing link to memory.html in index.html');
  }
  
  // Write results
  const output = [
    `Validation ${results.passed ? 'PASSED' : 'FAILED'}`,
    `Errors (${results.errors.length}):`,
    ...results.errors.map(e => `  - ${e}`),
    `Warnings (${results.warnings.length}):`,
    ...results.warnings.map(w => `  - ${w}`)
  ].join('\n');
  
  fs.writeFileSync('site_validation_output.txt', output);
  console.log(output);
  
  process.exit(results.passed ? 0 : 1);
}

validateProject();
