// Game Constants
const GRID_SIZE = 20;
const TILE_SIZE = 20;
const INITIAL_SPEED = 150;

// Game Elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverOverlay = document.getElementById('gameOver');
const restartButton = document.getElementById('restartButton');

// Game State
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 0;
let dy = 0;
let score = 0;
let changingDirection = false;
let gameInterval;

// Initialize Game
function init() {
  placeFood();
  gameInterval = setInterval(main, INITIAL_SPEED);
  document.addEventListener('keydown', changeDirection);
  restartButton.addEventListener('click', restartGame);
}

// Main Game Loop
function main() {
  if (hasGameEnded()) {
    clearInterval(gameInterval);
    gameOverOverlay.classList.remove('hidden');
    return;
  }

  changingDirection = false;
  clearCanvas();
  drawFood();
  advanceSnake();
  drawSnake();
}

// Clear Canvas
function clearCanvas() {
  ctx.fillStyle = '#ecf0f1';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Draw Snake
function drawSnake() {
  snake.forEach(segment => {
    ctx.fillStyle = '#2ecc71';
    ctx.fillRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    ctx.strokeStyle = '#27ae60';
    ctx.strokeRect(segment.x * TILE_SIZE, segment.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  });
}

// Advance Snake Position
function advanceSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  const didEatFood = head.x === food.x && head.y === food.y;
  if (didEatFood) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    placeFood();
  } else {
    snake.pop();
  }
}

// Place Food Randomly
function placeFood() {
  food.x = Math.floor(Math.random() * (canvas.width / TILE_SIZE));
  food.y = Math.floor(Math.random() * (canvas.height / TILE_SIZE));

  // Avoid placing food on snake
  snake.forEach(segment => {
    if (segment.x === food.x && segment.y === food.y) {
      placeFood();
    }
  });
}

// Draw Food
function drawFood() {
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(food.x * TILE_SIZE, food.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  ctx.strokeStyle = '#c0392b';
  ctx.strokeRect(food.x * TILE_SIZE, food.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
}

// Check Game End Conditions
function hasGameEnded() {
  // Wall collision
  if (
    snake[0].x < 0 ||
    snake[0].x >= canvas.width / TILE_SIZE ||
    snake[0].y < 0 ||
    snake[0].y >= canvas.height / TILE_SIZE
  ) {
    return true;
  }

  // Self collision
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  return false;
}

// Change Direction Based on Key Press
function changeDirection(event) {
  if (changingDirection) return;
  changingDirection = true;

  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;
  const goingUp = dy === -1;
  const goingDown = dy === 1;
  const goingRight = dx === 1;
  const goingLeft = dx === -1;

  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -1;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -1;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 1;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 1;
  }
}

// Restart Game
function restartGame() {
  clearInterval(gameInterval);
  snake = [{ x: 10, y: 10 }];
  dx = 0;
  dy = 0;
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  gameOverOverlay.classList.add('hidden');
  init();
}

// Start the game when loaded
window.onload = init;
