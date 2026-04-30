const fs = require('fs');
const path = require('path');

const projectDir = '.';
const requiredFiles = [
  'index.html',
  'styles.css',
  'app.js',
  'games/snake.js',
  'games/tic_tac_toe.js',
  'games/memory_match.js'
];

const outputFile = 'site_validation_output.txt';
let output = '';

function log(message) {
  console.log(message);
  output += message + '\n';
}

function validate() {
  log('Starting site validation...');
  let hasErrors = false;
  
  // Check if all required files exist
  for (const file of requiredFiles) {
    const fullPath = path.join(projectDir, file);
    if (!fs.existsSync(fullPath)) {
      log(`ERROR: Missing required file: ${fullPath}`);
      hasErrors = true;
    } else {
      log(`✓ Found required file: ${file}`);
    }
  }
  
  // Validate JavaScript files for syntax errors
  const jsFiles = requiredFiles.filter(file => file.endsWith('.js'));
  
  for (const file of jsFiles) {
    const fullPath = path.join(projectDir, file);
    try {
      // Use node --check equivalent by trying to compile the file
      new Function(fs.readFileSync(fullPath, 'utf8'));
      log(`✓ JavaScript syntax OK in: ${file}`);
    } catch (error) {
      log(`ERROR: JavaScript syntax error in ${file}: ${error.message}`);
      hasErrors = true;
    }
  }
  
  // Write output to file
  fs.writeFileSync(outputFile, output);
  
  if (hasErrors) {
    log('\nValidation failed with errors.');
    process.exit(1);
  } else {
    log('\nValidation passed successfully!');
    process.exit(0);
  }
}

validate();
