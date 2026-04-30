// Game constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

// Game state
let snake = [];
let food = {};
let direction = 'RIGHT';
let nextDirection = 'RIGHT';
let score = 0;
let gameInterval;
let gameActive = false;

// DOM Elements
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const scoreDisplay = document.getElementById('score-display');
const finalScore = document.getElementById('final-score');

// Initialize game
function initGame() {
  snake = [
    { x: 10, y: 10 }, // Head
    { x: 9, y: 10 },
    { x: 8, y: 10 }   // Tail
  ];
  generateFood();
  score = 0;
  direction = 'RIGHT';
  nextDirection = 'RIGHT';
  updateScore();
}

// Generate food at random position
function generateFood() {
  const maxCells = canvas.width / CELL_SIZE;
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * maxCells),
      y: Math.floor(Math.random() * maxCells)
    };
  } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
  
  food = newFood;
}

// Draw game elements
function draw() {
  // Clear canvas
  ctx.fillStyle = '#f5f5f5';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw snake
  ctx.fillStyle = '#27ae60';
  snake.forEach((segment, index) => {
    if (index === 0) ctx.fillStyle = '#2ecc71'; // Head color
    else ctx.fillStyle = '#27ae60';            // Body color
    ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    
    // Add inner highlight for visual effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE/2, CELL_SIZE/2);
    ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
  });
  
  // Draw food
  ctx.fillStyle = '#e74c3c';
  ctx.beginPath();
  ctx.arc(
    food.x * CELL_SIZE + CELL_SIZE/2,
    food.y * CELL_SIZE + CELL_SIZE/2,
    CELL_SIZE/2,
    0,
    Math.PI * 2
  );
  ctx.fill();
}

// Update game state
function update() {
  // Update direction
  direction = nextDirection;
  
  // Calculate new head position
  const head = { ...snake[0] };
  switch(direction) {
    case 'UP': head.y--; break;
    case 'DOWN': head.y++; break;
    case 'LEFT': head.x--; break;
    case 'RIGHT': head.x++; break;
  }
  
  // Check wall collision
  const maxCells = canvas.width / CELL_SIZE;
  if (head.x < 0 || head.x >= maxCells || head.y < 0 || head.y >= maxCells) {
    endGame();
    return;
  }
  
  // Check self collision
  if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
    endGame();
    return;
  }
  
  // Add new head
  snake.unshift(head);
  
  // Check food consumption
  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    generateFood();
  } else {
    // Remove tail if no food eaten
    snake.pop();
  }
}

// Main game loop
function gameLoop() {
  update();
  draw();
}

// Update score display
function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

// Start game
function startGame() {
  initGame();
  startScreen.classList.add('hidden');
  gameActive = true;
  gameInterval = setInterval(gameLoop, INITIAL_SPEED);
}

// End game
function endGame() {
  clearInterval(gameInterval);
  gameActive = false;
  finalScore.textContent = score;
  gameOverScreen.classList.remove('hidden');
}

// Restart game
function restartGame() {
  gameOverScreen.classList.add('hidden');
  startGame();
}

// Handle keyboard input
function handleKeydown(e) {
  if (!gameActive) return;
  
  switch(e.key) {
    case 'ArrowUp':
      if (direction !== 'DOWN') nextDirection = 'UP';
      break;
    case 'ArrowDown':
      if (direction !== 'UP') nextDirection = 'DOWN';
      break;
    case 'ArrowLeft':
      if (direction !== 'RIGHT') nextDirection = 'LEFT';
      break;
    case 'ArrowRight':
      if (direction !== 'LEFT') nextDirection = 'RIGHT';
      break;
  }
}

// Event listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);
document.addEventListener('keydown', handleKeydown);

// Initial setup
initGame();
draw();
