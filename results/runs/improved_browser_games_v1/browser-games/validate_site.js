// Node.js Validation Script

const fs = require('fs');
const path = require('path');

// Project root directory
const projectDir = '.';

// Required files
const requiredFiles = [
  'index.html',
  'styles.css',
  'script.js',
  'snake.html',
  'snake.css',
  'snake.js',
  'tictactoe.html',
  'tictactoe.css',
  'tictactoe.js',
  'memory.html',
  'memory.css',
  'memory.js',
  'validate_site.js',
  'README.md',
  'docs/runbook.md',
  'docs/deployment_checklist.md'
];

// Validation results
let results = [];
let allPassed = true;

// Helper function to add result
function addResult(check, passed, message) {
  results.push({
    check: check,
    passed: passed,
    message: message
  });
  
  if (!passed) {
    allPassed = false;
  }
}

// Check if file exists
function checkFileExists(filePath) {
  const fullPath = path.join(projectDir, filePath);
  return fs.existsSync(fullPath);
}

// Read file content
function readFileContent(filePath) {
  const fullPath = path.join(projectDir, filePath);
  if (fs.existsSync(fullPath)) {
    return fs.readFileSync(fullPath, 'utf8');
  }
  return null;
}

// Validate file structure
function validateFileStructure() {
  for (const file of requiredFiles) {
    const exists = checkFileExists(file);
    addResult(
      `File Structure: ${file}`,
      exists,
      exists ? `Found ${file}` : `Missing ${file}`
    );
  }
}

// Validate HTML files have proper CSS/JS links
function validateHTMLLinks() {
  const htmlFiles = [
    'index.html',
    'snake.html',
    'tictactoe.html',
    'memory.html'
  ];
  
  for (const htmlFile of htmlFiles) {
    const content = readFileContent(htmlFile);
    if (content) {
      const hasStyles = content.includes('<link rel="stylesheet"');
      const hasScript = content.includes('<script src=');
      
      addResult(
        `HTML Links: ${htmlFile} CSS`,
        hasStyles,
        hasStyles ? `Has CSS links` : `Missing CSS links in ${htmlFile}`
      );
      
      // Special case for index.html - it's okay if it doesn't have script.js
      if (htmlFile === 'index.html') {
        addResult(
          `HTML Links: ${htmlFile} JS`,
          true,
          `Optional for index.html`
        );
      } else {
        addResult(
          `HTML Links: ${htmlFile} JS`,
          hasScript,
          hasScript ? `Has JS links` : `Missing JS links in ${htmlFile}`
        );
      }
    }
  }
}

// Check for prohibited assets
function validateNoProhibitedAssets() {
  // Check for references to binary assets
  const prohibitedExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg', '.mp3', '.wav', '.ogg'];
  
  const jsFiles = [
    'script.js',
    'snake.js',
    'tictactoe.js',
    'memory.js'
  ];
  
  for (const jsFile of jsFiles) {
    const content = readFileContent(jsFile);
    if (content) {
      let hasProhibitedAsset = false;
      let prohibitedAsset = '';
      
      for (const ext of prohibitedExtensions) {
        if (content.includes(ext)) {
          hasProhibitedAsset = true;
          prohibitedAsset = ext;
          break;
        }
      }
      
      addResult(
        `Prohibited Assets: ${jsFile}`,
        !hasProhibitedAsset,
        hasProhibitedAsset ? 
          `Contains reference to prohibited asset (${prohibitedAsset})` : 
          `No prohibited assets found in ${jsFile}`
      );
    }
  }
}

// Check Snake implementation
function validateSnakeImplementation() {
  const snakeJS = readFileContent('snake.js');
  if (snakeJS) {
    const hasPreventDefault = snakeJS.includes('preventDefault()');
    const hasKeyDownListener = snakeJS.includes('keydown');
    
    addResult(
      'Snake: Arrow key event listeners',
      hasKeyDownListener,
      hasKeyDownListener ? 'Found keydown event listener' : 'Missing keydown event listener'
    );
    
    addResult(
      'Snake: preventDefault() for arrow keys',
      hasPreventDefault,
      hasPreventDefault ? 'Found preventDefault() call' : 'Missing preventDefault() call'
    );
  }
}

// Check Tic Tac Toe AI implementations
function validateTicTacToeAI() {
  const tttJS = readFileContent('tictactoe.js');
  if (tttJS) {
    const hasEasyAI = tttJS.includes('getEasyMove') || tttJS.includes('random') || tttJS.includes('Math.random');
    const hasMediumAI = tttJS.includes('getMediumMove') || tttJS.includes('minimax') && tttJS.includes('depth');
    const hasHardAI = tttJS.includes('getHardMove') || tttJS.includes('minimax') && !tttJS.includes('depth');
    
    addResult(
      'Tic Tac Toe: Easy AI implementation',
      hasEasyAI,
      hasEasyAI ? 'Found Easy AI implementation' : 'Missing Easy AI implementation'
    );
    
    addResult(
      'Tic Tac Toe: Medium AI implementation',
      hasMediumAI,
      hasMediumAI ? 'Found Medium AI implementation' : 'Missing Medium AI implementation'
    );
    
    addResult(
      'Tic Tac Toe: Hard AI implementation',
      hasHardAI,
      hasHardAI ? 'Found Hard AI implementation' : 'Missing Hard AI implementation'
    );
  }
}

// Check Memory game localStorage usage
function validateMemoryLocalStorage() {
  const memoryJS = readFileContent('memory.js');
  if (memoryJS) {
    const hasLocalStorage = memoryJS.includes('localStorage') || memoryJS.includes('StorageUtil');
    const hasHighScoreKeys = memoryJS.includes('memory_highscore_12') || 
                            memoryJS.includes('memory_highscore_24') || 
                            memoryJS.includes('memory_highscore_48');
    
    addResult(
      'Memory: localStorage usage',
      hasLocalStorage,
      hasLocalStorage ? 'Found localStorage usage' : 'Missing localStorage usage'
    );
    
    addResult(
      'Memory: High score keys',
      hasHighScoreKeys,
      hasHighScoreKeys ? 'Found high score keys' : 'Missing high score keys'
    );
  }
}

// Main validation function
function runValidation() {
  results = [];
  allPassed = true;
  
  validateFileStructure();
  validateHTMLLinks();
  validateNoProhibitedAssets();
  validateSnakeImplementation();
  validateTicTacToeAI();
  validateMemoryLocalStorage();
  
  // Generate output
  let output = 'Browser Games Validation Results\n';
  output += '='.repeat(40) + '\n\n';
  
  let passedCount = 0;
  for (const result of results) {
    output += `[${result.passed ? 'PASS' : 'FAIL'}] ${result.check}\n`;
    output += `  ${result.message}\n\n`;
    if (result.passed) passedCount++;
  }
  
  output += '='.repeat(40) + '\n';
  output += `Results: ${passedCount}/${results.length} checks passed\n`;
  output += allPassed ? 'Overall Status: PASS\n' : 'Overall Status: FAIL\n';
  
  // Write output to file
  fs.writeFileSync('site_validation_output.txt', output);
  
  // Log to console
  console.log(output);
  
  // Exit with appropriate code
  process.exit(allPassed ? 0 : 1);
}

// Run validation
runValidation();
