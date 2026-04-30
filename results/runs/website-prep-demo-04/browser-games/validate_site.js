const fs = require('fs');
const path = require('path');

const projectDir = 'browser-games';
const requiredFiles = [
  'index.html',
  'css/main.css',
  'js/snake.js',
  'js/tictactoe.js',
  'js/memory.js',
  'validate_site.js'
];

let allPassed = true;
const outputLines = [];

// Check file existence
for (const file of requiredFiles) {
  const fullPath = path.join(projectDir, file);
  if (fs.existsSync(fullPath)) {
    outputLines.push(`PASS: ${file} exists.`);
  } else {
    outputLines.push(`FAIL: ${file} does not exist.`);
    allPassed = false;
  }
}

// Validate JS syntax
const jsFiles = ['js/snake.js', 'js/tictactoe.js', 'js/memory.js'];
for (const file of jsFiles) {
  const fullPath = path.join(projectDir, file);
  if (!fs.existsSync(fullPath)) continue;

  try {
    const code = fs.readFileSync(fullPath, 'utf8');
    new Function(code); // Try parsing as function
    outputLines.push(`PASS: ${file} has valid syntax.`);
  } catch (err) {
    outputLines.push(`FAIL: ${file} has syntax error: ${err.message}`);
    allPassed = false;
  }
}

// Write output
const outputPath = 'site_validation_output.txt';
fs.writeFileSync(outputPath, outputLines.join('\n') + '\n');

// Exit with appropriate code
if (allPassed) {
  process.exit(0);
} else {
  process.exit(1);
}
