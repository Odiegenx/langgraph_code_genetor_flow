// Validation Script
const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'index.html',
  'snake.html',
  'tictactoe.html',
  'memory.html',
  'css/styles.css',
  'js/snake.js',
  'js/tictactoe.js',
  'js/memory.js'
];

const projectDir = '.';
let allValid = true;

// Check file existence
for (const filePath of requiredFiles) {
  const fullPath = path.join(projectDir, filePath);
  if (!fs.existsSync(fullPath)) {
    console.error(`Missing file: ${filePath}`);
    allValid = false;
  }
}

// Check JavaScript syntax
const jsFiles = requiredFiles.filter(file => file.endsWith('.js'));
for (const jsFile of jsFiles) {
  const fullPath = path.join(projectDir, jsFile);
  if (fs.existsSync(fullPath)) {
    try {
      const code = fs.readFileSync(fullPath, 'utf8');
      new Function(code); // Attempt to parse the code
    } catch (error) {
      console.error(`Syntax error in ${jsFile}: ${error.message}`);
      allValid = false;
    }
  }
}

if (allValid) {
  console.log('Validation complete: All files present and JavaScript syntax valid');
} else {
  process.exit(1);
}
