// validate_site.js
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'index.html',
  'snake.html',
  'tictactoe.html',
  'memory.html',
  'css/main.css',
  'css/tictactoe.css',
  'css/memory.css',
  'js/snake.js',
  'js/tictactoe.js',
  'js/memory.js',
  'validate_site.js'
];

const jsFiles = [
  'js/snake.js',
  'js/tictactoe.js',
  'js/memory.js',
  'validate_site.js'
];

let results = [];

// Check file existence
requiredFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    results.push(`✓ ${file} exists`);
  } else {
    results.push(`✗ ${file} missing`);
  }
});

// Check JS syntax
jsFiles.forEach(file => {
  const fullPath = path.join(__dirname, file);
  try {
    const content = fs.readFileSync(fullPath, 'utf8');
    new Function(content);
    results.push(`✓ ${file} has valid syntax`);
  } catch (e) {
    results.push(`✗ ${file} has invalid syntax: ${e.message}`);
  }
});

// Write results
const output = results.join('\n');
fs.writeFileSync(path.join(__dirname, 'site_validation_output.txt'), output);
console.log('Validation completed. Results written to site_validation_output.txt');
