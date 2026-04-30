const fs = require('fs');
const path = require('path');

async function runValidation() {
  let puppeteer;
  try {
    puppeteer = await import('puppeteer');
  } catch (err) {
    console.log('Puppeteer not found, installing...');
    const { execSync } = require('child_process');
    execSync('npm install', { stdio: 'inherit' });
    puppeteer = await import('puppeteer');
  }

  const browser = await puppeteer.default.launch();
  const results = [];

  const baseUrl = `file://${path.join(__dirname)}`;

  async function testPage(urlPath, testName, assertions) {
    const pageUrl = `${baseUrl}/${urlPath}`;
    const page = await browser.newPage();
    let passed = true;
    let errorMessage = '';

    page.on('pageerror', err => {
      passed = false;
      errorMessage += `\nJS Error: ${err.message}`;
    });

    try {
      await page.goto(pageUrl, { waitUntil: 'networkidle0' });
      await assertions(page);
    } catch (err) {
      passed = false;
      errorMessage += `\nAssertion Error: ${err.message}`;
    } finally {
      await page.close();
      results.push({ test: testName, passed, error: errorMessage });
    }
  }

  // Test index.html
  await testPage('index.html', 'Index Page Load', async (page) => {
    const h1 = await page.$('h1');
    if (!h1) throw new Error('Missing <h1>');
    
    const links = await page.$$('a[href]');
    const hrefs = await Promise.all(links.map(link => link.evaluate(el => el.getAttribute('href'))));
    const requiredLinks = ['snake.html', 'tic-tac-toe.html', 'memory.html'];
    for (const link of requiredLinks) {
      if (!hrefs.includes(link)) throw new Error(`Missing link to ${link}`);
    }
    
    const cssLink = await page.$('link[href="styles.css"]');
    if (!cssLink) throw new Error('Missing link to styles.css');
  });

  // Test snake.html
  await testPage('snake.html', 'Snake Page Elements', async (page) => {
    const canvas = await page.$('#snake-canvas');
    if (!canvas) throw new Error('Missing #snake-canvas');
    
    const startBtn = await page.$('#start-btn');
    if (!startBtn) throw new Error('Missing #start-btn');
    
    const scoreDisplay = await page.$('#score-display');
    if (!scoreDisplay) throw new Error('Missing #score-display');
    
    const highScore = await page.$('#high-score');
    if (!highScore) throw new Error('Missing #high-score');
    
    const homeLink = await page.$('a[href="index.html"]');
    if (!homeLink) throw new Error('Missing home link to index.html');
    
    const stylesCss = await page.$('link[href="styles.css"]');
    if (!stylesCss) throw new Error('Missing link to styles.css');
    
    const snakeCss = await page.$('link[href="snake.css"]');
    if (!snakeCss) throw new Error('Missing link to snake.css');
  });

  // Test tic-tac-toe.html
  await testPage('tic-tac-toe.html', 'Tic Tac Toe Page Elements', async (page) => {
    const cells = await page.$$('.cell[data-index]');
    if (cells.length !== 9) throw new Error('Expected 9 .cell elements with data-index');
    
    const status = await page.$('#status');
    if (!status) throw new Error('Missing #status');
    
    const restartBtn = await page.$('#restart-btn');
    if (!restartBtn) throw new Error('Missing #restart-btn');
    
    const homeLink = await page.$('a[href="index.html"]');
    if (!homeLink) throw new Error('Missing home link to index.html');
    
    const stylesCss = await page.$('link[href="styles.css"]');
    if (!stylesCss) throw new Error('Missing link to styles.css');
    
    const tttCss = await page.$('link[href="tic-tac-toe.css"]');
    if (!tttCss) throw new Error('Missing link to tic-tac-toe.css');
  });

  // Test memory.html
  await testPage('memory.html', 'Memory Page Elements', async (page) => {
    const cards = await page.$$('.memory-card[data-card]');
    if (cards.length < 16) throw new Error('Expected at least 16 .memory-card elements with data-card');
    
    const moves = await page.$('#moves');
    if (!moves) throw new Error('Missing #moves');
    
    const restartBtn = await page.$('#restart-btn');
    if (!restartBtn) throw new Error('Missing #restart-btn');
    
    const homeLink = await page.$('a[href="index.html"]');
    if (!homeLink) throw new Error('Missing home link to index.html');
    
    const stylesCss = await page.$('link[href="styles.css"]');
    if (!stylesCss) throw new Error('Missing link to styles.css');
    
    const memoryCss = await page.$('link[href="memory.css"]');
    if (!memoryCss) throw new Error('Missing link to memory.css');
  });

  await browser.close();

  const output = results.map(r => `${r.test}: ${r.passed ? 'PASS' : 'FAIL'}${r.error ? '\n  ' + r.error : ''}`).join('\n');
  fs.writeFileSync(path.join(__dirname, 'site_validation_output.txt'), output);
  
  const allPassed = results.every(r => r.passed);
  process.exit(allPassed ? 0 : 1);
}

runValidation();
