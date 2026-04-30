const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
  {x: 10, y: 10}
];
let food = {};
let dx = 0;
let dy = 0;
let score = 0;
let changingDirection = false;
let gameRunning = true;

function drawSnakePart(snakePart) {
  ctx.fillStyle = '#2ecc71';
  ctx.fillRect(snakePart.x * gridSize, snakePart.y * gridSize, gridSize, gridSize);
  
  ctx.strokeStyle = '#27ae60';
  ctx.strokeRect(snakePart.x * gridSize, snakePart.y * gridSize, gridSize, gridSize);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function moveSnake() {
  if (!gameRunning) return;
  
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  
  // Game over conditions
  if (head.x < 0 || head.y < 0 || head.x >= tileCount || head.y >= tileCount) {
    gameOver(); return;
  }
  
  // Self collision
  for (let i = 0; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver(); return;
    }
  }
  
  snake.unshift(head);
  
  // Check if food is eaten
  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreElement.textContent = score;
    generateFood();
  } else {
    snake.pop();
  }
}

function drawFood() {
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function generateFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };
  
  // Make sure food doesn't appear on snake
  for (let part of snake) {
    if (part.x === food.x && part.y === food.y) {
      generateFood();
      break;
    }
  }
}

function clearCanvas() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function gameLoop() {
  changingDirection = false;
  clearCanvas();
  drawFood();
  moveSnake();
  drawSnake();
}

function changeDirection(direction) {
  if (changingDirection) return;
  changingDirection = true;
  
  const goingUp = dy === -1;
  const goingDown = dy === 1;
  const goingRight = dx === 1;
  const goingLeft = dx === -1;
  
  if (direction === 'ArrowUp' && !goingDown) {
    dx = 0;
    dy = -1;
  }
  
  if (direction === 'ArrowDown' && !goingUp) {
    dx = 0;
    dy = 1;
  }
  
  if (direction === 'ArrowLeft' && !goingRight) {
    dx = -1;
    dy = 0;
  }
  
  if (direction === 'ArrowRight' && !goingLeft) {
    dx = 1;
    dy = 0;
  }
}

function gameOver() {
  gameRunning = false;
  finalScoreElement.textContent = score;
  gameOverElement.style.display = 'flex';
}

function restartGame() {
  snake = [{x: 10, y: 10}];
  dx = 0;
  dy = 0;
  score = 0;
  scoreElement.textContent = score;
  generateFood();
  gameOverElement.style.display = 'none';
  gameRunning = true;
}

generateFood();
setInterval(gameLoop, 100);

document.addEventListener('keydown', (e) => {
  if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
    e.preventDefault();
    changeDirection(e.key);
  }
});
