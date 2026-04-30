// Game constants
const GRID_SIZE = 20;
const CELL_SIZE = 20;

// Game state
let snake = [{x: 10, y: 10}];
let food = generateFood();
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameOver = false;
let gameSpeed = 150; // milliseconds
let gameInterval;

// DOM elements
const canvas = document.getElementById('snake-canvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('snake-score');
const gameOverElement = document.getElementById('snake-game-over');
const restartButton = document.getElementById('snake-restart');

// Initialize game
function init() {
  resetGame();
  draw();
  document.addEventListener('keydown', changeDirection);
  restartButton.addEventListener('click', resetGame);
  gameInterval = setInterval(move, gameSpeed);
}

// Reset game state
function resetGame() {
  clearInterval(gameInterval);
  snake = [{x: 10, y: 10}];
  food = generateFood();
  direction = 'right';
  nextDirection = 'right';
  score = 0;
  gameOver = false;
  scoreElement.textContent = score;
  gameOverElement.style.display = 'none';
  gameInterval = setInterval(move, gameSpeed);
}

// Generate food at random position
function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    // Make sure food doesn't appear on snake
    var onSnake = false;
    for (let segment of snake) {
      if (segment.x === newFood.x && segment.y === newFood.y) {
        onSnake = true;
        break;
      }
    }
  } while (onSnake);
  
  return newFood;
}

// Change direction based on key press
function changeDirection(event) {
  const keyPressed = event.key;
  const UP_KEY = 'ArrowUp';
  const DOWN_KEY = 'ArrowDown';
  const LEFT_KEY = 'ArrowLeft';
  const RIGHT_KEY = 'ArrowRight';
  
  // Prevent 180 degree turns
  if (keyPressed === UP_KEY && direction !== 'down') {
    nextDirection = 'up';
  } else if (keyPressed === DOWN_KEY && direction !== 'up') {
    nextDirection = 'down';
  } else if (keyPressed === LEFT_KEY && direction !== 'right') {
    nextDirection = 'left';
  } else if (keyPressed === RIGHT_KEY && direction !== 'left') {
    nextDirection = 'right';
  }
}

// Move snake
function move() {
  if (gameOver) return;
  
  direction = nextDirection;
  
  // Create new head based on direction
  const head = {...snake[0]};
  switch(direction) {
    case 'up':
      head.y -= 1;
      break;
    case 'down':
      head.y += 1;
      break;
    case 'left':
      head.x -= 1;
      break;
    case 'right':
      head.x += 1;
      break;
  }
  
  // Check collision with walls
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    endGame();
    return;
  }
  
  // Check collision with self
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      endGame();
      return;
    }
  }
  
  // Add new head to snake
  snake.unshift(head);
  
  // Check if food is eaten
  if (head.x === food.x && head.y === food.y) {
    // Increase score
    score++;
    scoreElement.textContent = score;
    // Generate new food
    food = generateFood();
  } else {
    // Remove tail if no food eaten
    snake.pop();
  }
  
  // Redraw game
  draw();
}

// Draw game state
function draw() {
  // Clear canvas
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw snake
  ctx.fillStyle = 'green';
  for (let segment of snake) {
    ctx.fillRect(segment.x * CELL_SIZE, segment.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  }
  
  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * CELL_SIZE, food.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

// End game
function endGame() {
  gameOver = true;
  clearInterval(gameInterval);
  gameOverElement.style.display = 'block';
}

// Start the game when page loads
window.onload = init;
