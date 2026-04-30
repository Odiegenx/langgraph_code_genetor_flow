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
  'js/memory.js'
];

const outputFile = 'site_validation_output.txt';
let validationResults = [];

function validateFileExistence() {
  let allExist = true;
  for (const file of requiredFiles) {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
      validationResults.push(`✓ ${file} exists`);
    } else {
      validationResults.push(`✗ ${file} is missing`);
      allExist = false;
    }
  }
  return allExist;
}

function validateJavaScriptSyntax() {
  let allValid = true;
  const jsFiles = requiredFiles.filter(file => file.endsWith('.js'));
  
  for (const file of jsFiles) {
    const fullPath = path.join(__dirname, file);
    try {
      const content = fs.readFileSync(fullPath, 'utf-8');
      new Function(content);
      validationResults.push(`✓ ${file} has valid syntax`);
    } catch (error) {
      validationResults.push(`✗ ${file} has syntax error: ${error.message}`);
      allValid = false;
    }
  }
  return allValid;
}

function main() {
  validationResults = [];
  const fileCheck = validateFileExistence();
  const syntaxCheck = validateJavaScriptSyntax();
  
  const success = fileCheck && syntaxCheck;
  validationResults.unshift(`Validation ${success ? 'PASSED' : 'FAILED'}\n====================`);
  
  const output = validationResults.join('\n');
  fs.writeFileSync(outputFile, output);
  console.log(`Validation results written to ${outputFile}`);
  
  if (!success) {
    process.exit(1);
  }
}

main();
