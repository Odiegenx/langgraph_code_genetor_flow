const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectDir = '.';
const outputFile = 'site_validation_output.txt';
const requiredFiles = [
  'browser-games/index.html',
  'browser-games/styles.css',
  'browser-games/snake.html',
  'browser-games/snake.css',
  'browser-games/snake.js',
  'browser-games/tictactoe.html',
  'browser-games/tictactoe.css',
  'browser-games/tictactoe.js',
  'browser-games/memory.html',
  'browser-games/memory.css',
  'browser-games/memory.js',
  'browser-games/validate_site.js'
];

let results = [];
let allPassed = true;

function logResult(passed, description) {
  results.push(`${passed ? 'PASS' : 'FAIL'}: ${description}`);
  if (!passed) allPassed = false;
}

function fileExists(filePath) {
  return fs.existsSync(filePath) && fs.statSync(filePath).size > 0;
}

function readFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error(`Error reading file ${filePath}:`, err.message);
    return null;
  }
}

function validateSyntax(jsPath) {
  const code = readFile(jsPath);
  if (code === null) return false;
  try {
    new vm.Script(code);
    return true;
  } catch (e) {
    console.error(`Syntax error in ${jsPath}:`, e.message);
    return false;
  }
}

function validateIndexHtml(htmlContent) {
  const checks = [
    { regex: /href\s*=\s*['"]snake\.html['"]/i, desc: "Links to snake.html" },
    { regex: /href\s*=\s*['"]tictactoe\.html['"]/i, desc: "Links to tictactoe.html" },
    { regex: /href\s*=\s*['"]memory\.html['"]/i, desc: "Links to memory.html" }
  ];
  checks.forEach(check => {
    logResult(check.regex.test(htmlContent), `index.html ${check.desc}`);
  });
}

function validateGamePage(htmlContent, jsPath, cssPath, gameName) {
  const htmlChecks = [
    { regex: new RegExp(`<link[^>]*href\s*=\s*['"]${path.basename(cssPath)}['"]`), desc: `${gameName} HTML links to CSS` },
    { regex: new RegExp(`<script[^>]*src\s*=\s*['"]${path.basename(jsPath)}['"]`), desc: `${gameName} HTML links to JS` }
  ];
  htmlChecks.forEach(check => {
    logResult(check.regex.test(htmlContent), check.desc);
  });
}

function runValidations() {
  // Check that all required files exist and are non-empty
  requiredFiles.forEach(file => {
    logResult(fileExists(file), `File exists and is not empty: ${file}`);
  });

  // Validate JS syntax
  const jsFiles = ['browser-games/snake.js', 'browser-games/tictactoe.js', 'browser-games/memory.js'];
  jsFiles.forEach(jsFile => {
    logResult(validateSyntax(jsFile), `JavaScript file parses without syntax errors: ${jsFile}`);
  });

  // Validate index.html structure
  const indexPath = 'browser-games/index.html';
  if (fileExists(indexPath)) {
    const indexContent = readFile(indexPath);
    validateIndexHtml(indexContent);
  }

  // Validate Snake-specific requirements
  const snakeIndexPath = 'browser-games/snake.html';
  if (fileExists(snakeIndexPath)) {
    const snakeIndexContent = readFile(snakeIndexPath);
    validateGamePage(snakeIndexContent, 'snake.js', 'snake.css', 'Snake');
    logResult(/<canvas/i.test(snakeIndexContent), "snake.html contains a <canvas> element");
  }

  const snakeJsPath = 'browser-games/snake.js';
  if (fileExists(snakeJsPath)) {
    const snakeJsContent = readFile(snakeJsPath);
    logResult(/keydown/i.test(snakeJsContent), "snake.js contains a keydown event listener");
  }

  // Validate TicTacToe-specific requirements (stubbed since we don't have access to those files)
  const tttIndexPath = 'browser-games/tictactoe.html';
  if (fileExists(tttIndexPath)) {
    const tttIndexContent = readFile(tttIndexPath);
    validateGamePage(tttIndexContent, 'tictactoe.js', 'tictactoe.css', 'Tic Tac Toe');
    logResult(/grid.*9/i.test(tttIndexContent) || /class.*cell/i.test(tttIndexContent), "tictactoe.html contains a grid container with at least 9 child elements");
  }

  const tttJsPath = 'browser-games/tictactoe.js';
  if (fileExists(tttJsPath)) {
    const tttJsContent = readFile(tttJsPath);
    logResult(/click/i.test(tttJsContent), "tictactoe.js contains click event handling on cells");
  }

  // Validate Memory-specific requirements (stubbed)
  const memIndexPath = 'browser-games/memory.html';
  if (fileExists(memIndexPath)) {
    const memIndexContent = readFile(memIndexPath);
    validateGamePage(memIndexContent, 'memory.js', 'memory.css', 'Memory Match');
    logResult(/card.*grid|grid.*card/i.test(memIndexContent), "memory.html contains a card grid container");
  }

  const memJsPath = 'browser-games/memory.js';
  if (fileExists(memJsPath)) {
    const memJsContent = readFile(memJsPath);
    logResult(/flip|match/i.test(memJsContent), "memory.js contains card-flip/match logic");
  }

  // Write output
  fs.writeFileSync(outputFile, results.join('\n') + '\n', 'utf8');
  console.log(`Validation complete. Results written to ${outputFile}.`);
  process.exit(allPassed ? 0 : 1);
}

runValidations();
