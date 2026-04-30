// Snake Game Logic
const canvas = document.getElementById('snakeCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
  {x: 10, y: 10}
];

let dx = 0;
let dy = 0;

let food = {
  x: Math.floor(Math.random() * tileCount),
  y: Math.floor(Math.random() * tileCount)
};

let score = 0;
let gameOver = false;

function drawGame() {
  if (gameOver) return;
  
  // Clear canvas
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw snake
  ctx.fillStyle = 'lime';
  for (let segment of snake) {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
  }
  
  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
  
  // Move snake
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);
  
  // Check collision with walls
  if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
    gameOver = true;
    alert(`Game Over! Your score: ${score}`);
    return;
  }
  
  // Check collision with self
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      gameOver = true;
      alert(`Game Over! Your score: ${score}`);
      return;
    }
  }
  
  // Check food eaten
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').textContent = score;
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  } else {
    snake.pop();
  }
}

function changeDirection(e) {
  switch(e.key) {
    case 'ArrowUp':
      if (dy === 0) { dx = 0; dy = -1; }
      break;
    case 'ArrowDown':
      if (dy === 0) { dx = 0; dy = 1; }
      break;
    case 'ArrowLeft':
      if (dx === 0) { dx = -1; dy = 0; }
      break;
    case 'ArrowRight':
      if (dx === 0) { dx = 1; dy = 0; }
      break;
  }
}

document.addEventListener('keydown', changeDirection);

function gameLoop() {
  drawGame();
  setTimeout(gameLoop, 150);
}

gameLoop();

document.getElementById('restartButton').addEventListener('click', () => {
  location.reload();
});
