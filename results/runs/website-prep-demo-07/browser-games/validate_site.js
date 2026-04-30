const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectDir = '.';
const outputFile = 'site_validation_output.txt';

const requiredFiles = [
  'index.html',
  'styles.css',
  'snake.html',
  'snake.css',
  'snake.js',
  'tictactoe.html',
  'tictactoe.css',
  'tictactoe.js',
  'memory.html',
  'memory.css',
  'memory.js',
  'validate_site.js'
];

let results = [];

function logResult(testName, passed, message = '') {
  results.push({ testName, passed, message });
}

function fileExists(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    return null;
  }
}

function validateAllFilesExist() {
  let allExist = true;
  for (const file of requiredFiles) {
    const fullPath = path.join(projectDir, file);
    if (!fileExists(fullPath)) {
      logResult(`File exists: ${file}`, false, `${fullPath} does not exist.`);
      allExist = false;
    } else if (readFile(fullPath).trim() === '') {
      logResult(`File exists: ${file}`, false, `${fullPath} is empty.`);
      allExist = false;
    } else {
      logResult(`File exists: ${file}`, true);
    }
  }
  return allExist;
}

function validateJSSyntax() {
  let allValid = true;
  const jsFiles = requiredFiles.filter(f => f.endsWith('.js'));
  for (const file of jsFiles) {
    const fullPath = path.join(projectDir, file);
    const content = readFile(fullPath);
    if (content === null) continue;
    try {
      new vm.Script(content);
      logResult(`JS Syntax: ${file}`, true);
    } catch (err) {
      logResult(`JS Syntax: ${file}`, false, err.message);
      allValid = false;
    }
  }
  return allValid;
}

function validateIndexAnchors() {
  const indexPath = path.join(projectDir, 'index.html');
  const content = readFile(indexPath);
  if (!content) {
    logResult('Index anchors', false, 'Could not read index.html');
    return false;
  }
  
  const hasSnake = content.includes('href="snake.html"');
  const hasTicTacToe = content.includes('href="tictactoe.html"');
  const hasMemory = content.includes('href="memory.html"');
  
  if (hasSnake && hasTicTacToe && hasMemory) {
    logResult('Index anchors', true);
    return true;
  } else {
    logResult('Index anchors', false, `Missing one or more game links. Found snake: ${hasSnake}, tictactoe: ${hasTicTacToe}, memory: ${hasMemory}`);
    return false;
  }
}

function validateGameHTMLReferences() {
  const games = [
    { html: 'snake.html', css: 'snake.css', js: 'snake.js' },
    { html: 'tictactoe.html', css: 'tictactoe.css', js: 'tictactoe.js' },
    { html: 'memory.html', css: 'memory.css', js: 'memory.js' }
  ];
  
  let allValid = true;
  for (const game of games) {
    const fullPath = path.join(projectDir, game.html);
    const content = readFile(fullPath);
    if (!content) {
      logResult(`Game HTML refs: ${game.html}`, false, `Could not read ${game.html}`);
      allValid = false;
      continue;
    }
    
    const hasStylesCSS = content.includes('<link rel="stylesheet" href="styles.css">');
    const hasGameCSS = content.includes(`<link rel="stylesheet" href="${game.css}">`);
    const hasGameJS = content.includes(`<script src="${game.js}"></script>`);
    
    if (hasStylesCSS && hasGameCSS && hasGameJS) {
      logResult(`Game HTML refs: ${game.html}`, true);
    } else {
      logResult(`Game HTML refs: ${game.html}`, false, 
        `Missing references - styles.css: ${hasStylesCSS}, ${game.css}: ${hasGameCSS}, ${game.js}: ${hasGameJS}`);
      allValid = false;
    }
  }
  return allValid;
}

function validateSharedThemeSelectors() {
  const cssPath = path.join(projectDir, 'styles.css');
  const content = readFile(cssPath);
  if (!content) {
    logResult('Shared theme selectors', false, 'Could not read styles.css');
    return false;
  }
  
  const hasRootVars = content.includes(':root');
  const hasCommonSelectors = content.includes('*') || content.includes('body') || content.includes('.game-card');
  
  if (hasRootVars && hasCommonSelectors) {
    logResult('Shared theme selectors', true);
    return true;
  } else {
    logResult('Shared theme selectors', false, 
      `Missing :root variables: ${hasRootVars}, common selectors: ${hasCommonSelectors}`);
    return false;
  }
}

function validateCSSSelectors(htmlFile, cssFile) {
  const htmlContent = readFile(path.join(projectDir, htmlFile));
  const cssContent = readFile(path.join(projectDir, cssFile));
  
  if (!htmlContent || !cssContent) {
    logResult(`CSS Selectors: ${cssFile}`, false, `Could not read files ${htmlFile} or ${cssFile}`);
    return false;
  }
  
  // Extract classes and IDs from HTML
  const classMatches = htmlContent.match(/class="([^"]+)"/g) || [];
  const idMatches = htmlContent.match(/id="([^"]+)"/g) || [];
  
  const htmlClasses = classMatches.flatMap(m => m.slice(7, -1).split(' '));
  const htmlIds = idMatches.map(m => m.slice(4, -1));
  
  // Extract selectors from CSS
  const selectorRegex = /[.#][a-zA-Z0-9_-]+/g;
  const cssSelectors = [...new Set((cssContent.match(selectorRegex) || []).map(s => s.substring(1)))];
  
  // Check if CSS selectors target actual HTML elements
  const unusedSelectors = cssSelectors.filter(sel => 
    !(htmlClasses.includes(sel) || htmlIds.includes(sel))
  );
  
  if (unusedSelectors.length === 0) {
    logResult(`CSS Selectors: ${cssFile}`, true);
    return true;
  } else {
    logResult(`CSS Selectors: ${cssFile}`, false, 
      `Unused selectors found: ${unusedSelectors.join(', ')}`);
    return false;
  }
}

function validateJSDOMUsage(htmlFile, jsFile) {
  const htmlContent = readFile(path.join(projectDir, htmlFile));
  const jsContent = readFile(path.join(projectDir, jsFile));
  
  if (!htmlContent || !jsContent) {
    logResult(`JS DOM Usage: ${jsFile}`, false, `Could not read files ${htmlFile} or ${jsFile}`);
    return false;
  }
  
  // Extract classes and IDs from HTML
  const classMatches = htmlContent.match(/class="([^"]+)"/g) || [];
  const idMatches = htmlContent.match(/id="([^"]+)"/g) || [];
  
  const htmlClasses = classMatches.flatMap(m => m.slice(7, -1).split(' '));
  const htmlIds = idMatches.map(m => m.slice(4, -1));
  
  // Check for getElementById calls
  const getIdCalls = jsContent.match(/getElementById\(['"]([^'"]+)['"]\)/g) || [];
  const calledIds = getIdCalls.map(call => call.match(/getElementById\(['"]([^'"]+)['"]\)/)[1]);
  
  // Check for querySelector/querySelectorAll calls
  const getQueryCalls = jsContent.match(/querySelector(All)?\(['"]([^'"]+)['"]\)/g) || [];
  const queriedSelectors = getQueryCalls.flatMap(call => {
    const match = call.match(/querySelector(All)?\(['"]([^'"]+)['"]\)/);
    return match ? [match[2]] : [];
  });
  
  // Validate ID usage
  const invalidIds = calledIds.filter(id => !htmlIds.includes(id));
  
  // Validate class/selector usage
  const invalidSelectors = [];
  for (const sel of queriedSelectors) {
    if (sel.startsWith('.')) {
      const className = sel.substring(1);
      if (!htmlClasses.includes(className)) invalidSelectors.push(sel);
    } else if (sel.startsWith('#')) {
      const idName = sel.substring(1);
      if (!htmlIds.includes(idName)) invalidSelectors.push(sel);
    }
  }
  
  if (invalidIds.length === 0 && invalidSelectors.length === 0) {
    logResult(`JS DOM Usage: ${jsFile}`, true);
    return true;
  } else {
    logResult(`JS DOM Usage: ${jsFile}`, false, 
      `Invalid IDs: ${invalidIds.join(', ')}. Invalid selectors: ${invalidSelectors.join(', ')}`);
    return false;
  }
}

function runValidation() {
  validateAllFilesExist();
  validateJSSyntax();
  validateIndexAnchors();
  validateGameHTMLReferences();
  validateSharedThemeSelectors();
  
  // Per-game validations
  validateCSSSelectors('snake.html', 'snake.css');
  validateJSDOMUsage('snake.html', 'snake.js');
  
  validateCSSSelectors('tictactoe.html', 'tictactoe.css');
  validateJSDOMUsage('tictactoe.html', 'tictactoe.js');
  
  validateCSSSelectors('memory.html', 'memory.css');
  validateJSDOMUsage('memory.html', 'memory.js');
  
  // Write output
  let output = '';
  for (const result of results) {
    output += `[${result.passed ? 'PASS' : 'FAIL'}] ${result.testName}`;
    if (result.message) output += ` - ${result.message}`;
    output += '\n';
  }
  
  fs.writeFileSync(outputFile, output);
  console.log(`${outputFile} generated successfully.`);
}

runValidation();
