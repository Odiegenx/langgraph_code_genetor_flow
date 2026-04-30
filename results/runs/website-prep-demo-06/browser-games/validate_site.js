// validate_site.js
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const projectDir = '.'; // Run from browser-games/

const requiredFiles = [
  'index.html',
  'styles.css',
  'snake.html',
  'snake.js',
  'tictactoe.html',
  'tictactoe.js',
  'memory.html',
  'memory.js',
  'validate_site.js'
];

const jsFilesToValidate = [
  'snake.js',
  'tictactoe.js',
  'memory.js',
  'validate_site.js'
];

let report = [];
let allPassed = true;

// Check file existence
report.push('=== File Existence Check ===');
for (const file of requiredFiles) {
  const fullPath = path.join(projectDir, file);
  if (fs.existsSync(fullPath)) {
    report.push(`✓ ${file} exists.`);
  } else {
    report.push(`✗ ${file} is missing.`);
    allPassed = false;
  }
}

report.push('\n=== JavaScript Syntax Validation ===');

// Validate JS syntax using vm.createScript
for (const jsFile of jsFilesToValidate) {
  const fullPath = path.join(projectDir, jsFile);
  if (!fs.existsSync(fullPath)) {
    report.push(`⚠ Skipping syntax check for ${jsFile} (file not found)`);
    continue;
  }

  try {
    const code = fs.readFileSync(fullPath, 'utf8');
    vm.createScript(code);
    report.push(`✓ ${jsFile} syntax is valid.`);
  } catch (err) {
    report.push(`✗ ${jsFile} has syntax error: ${err.message}`);
    allPassed = false;
  }
}

const output = report.join('\n');
const outputPath = path.join(projectDir, 'site_validation_output.txt');
fs.writeFileSync(outputPath, output);

console.log(output);

if (allPassed) {
  console.log('\n✅ All checks passed.');
  process.exit(0);
} else {
  console.log('\n❌ Some checks failed.');
  process.exit(1);
}
