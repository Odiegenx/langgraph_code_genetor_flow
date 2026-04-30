const fs = require('fs');
const path = require('path');
const vm = require('vm');

const outputFile = 'site_validation_output.txt';
let output = '';

function logResult(checkName, passed) {
  const status = passed ? 'PASS' : 'FAIL';
  const line = `${status}: ${checkName}\n`;
  output += line;
  console.log(line.trim());
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

// Check 1: Required files exist
const requiredFiles = [
  'index.html',
  'styles.css',
  'snake.html',
  'snake.js',
  'tictactoe.html',
  'tictactoe.js',
  'memory.html',
  'memory.js',
  'validate_site.js',
  'README.md',
  'docs/architecture.md',
  'docs/deployment_checklist.md'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  const exists = fileExists(file);
  if (!exists) allFilesExist = false;
  logResult(`File exists: ${file}`, exists);
}

// Check 2: JS syntax validity
const jsFiles = ['snake.js', 'tictactoe.js', 'memory.js'];
for (const jsFile of jsFiles) {
  const content = readFile(jsFile);
  let validSyntax = false;
  if (content !== null) {
    try {
      new vm.Script(content);
      validSyntax = true;
    } catch (err) {
      // Syntax error caught
    }
  }
  logResult(`JS syntax validity: ${jsFile}`, validSyntax);
}

// Check 3: index.html links
const indexHtmlContent = readFile('index.html');
if (indexHtmlContent !== null) {
  const hasSnakeLink = indexHtmlContent.includes('href="snake.html"');
  const hasTttLink = indexHtmlContent.includes('href="tictactoe.html"');
  const hasMemoryLink = indexHtmlContent.includes('href="memory.html"');
  const allLinksPresent = hasSnakeLink && hasTttLink && hasMemoryLink;
  logResult('index.html links to game pages', allLinksPresent);
} else {
  logResult('index.html links to game pages', false);
}

// Check 4: Game HTML references
const gameHtmlChecks = [
  { file: 'snake.html', scriptSrc: 'snake.js', cssHref: 'styles.css' },
  { file: 'tictactoe.html', scriptSrc: 'tictactoe.js', cssHref: 'styles.css' },
  { file: 'memory.html', scriptSrc: 'memory.js', cssHref: 'styles.css' }
];

for (const check of gameHtmlChecks) {
  const content = readFile(check.file);
  let hasScript = false;
  let hasCss = false;
  if (content !== null) {
    hasScript = content.includes(`<script src="${check.scriptSrc}"></script>`);
    hasCss = content.includes(`<link rel="stylesheet" href="${check.cssHref}">`);
  }
  logResult(`${check.file} includes script and CSS`, hasScript && hasCss);
}

// Check 5: Snake canvas ID
const snakeHtmlContent = readFile('snake.html');
if (snakeHtmlContent !== null) {
  const hasCanvasId = snakeHtmlContent.includes('id="snake-canvas"');
  logResult('snake.html has canvas with id="snake-canvas"', hasCanvasId);
} else {
  logResult('snake.html has canvas with id="snake-canvas"', false);
}

// Check 6: Tic Tac Toe IDs
const tttHtmlContent = readFile('tictactoe.html');
if (tttHtmlContent !== null) {
  const hasBoardId = tttHtmlContent.includes('id="ttt-board"');
  const hasResetId = tttHtmlContent.includes('id="ttt-reset"');
  logResult('tictactoe.html has required IDs', hasBoardId && hasResetId);
} else {
  logResult('tictactoe.html has required IDs', false);
}

// Check 7: Memory Match IDs
const memoryHtmlContent = readFile('memory.html');
if (memoryHtmlContent !== null) {
  const hasBoardId = memoryHtmlContent.includes('id="memory-board"');
  const hasResetId = memoryHtmlContent.includes('id="memory-reset"');
  logResult('memory.html has required IDs', hasBoardId && hasResetId);
} else {
  logResult('memory.html has required IDs', false);
}

// Write output to file
fs.writeFileSync(outputFile, output);
console.log(`\nValidation results written to ${outputFile}`);
