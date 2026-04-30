const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('gameOver');
const restartBtn = document.getElementById('restartBtn');

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake = [
  {x: 10, y: 10}
];
let food = {x: 5, y: 5};
let dx = 0;
let dy = 0;
let score = 0;
let changingDirection = false;
let gameRunning = true;

function drawGame() {
  if (!gameRunning) return;

  setTimeout(function onTick() {
    changingDirection = false;
    clearCanvas();
    moveSnake();
    if (hasGameEnded()) {
      gameRunning = false;
      showGameOver();
      return;
    }
    drawFood();
    drawSnake();
    drawScore();
    drawGame();
  }, 100);
}

function clearCanvas() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = 'black';
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = 'lightgreen';
  snake.forEach(part => {
    ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
    ctx.strokeStyle = 'darkgreen';
    ctx.strokeRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize);
  });
}

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function moveSnake() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);

  const hasEatenFood = head.x === food.x && head.y === food.y;
  if (hasEatenFood) {
    score += 10;
    genFood();
  } else {
    snake.pop();
  }
}

function hasGameEnded() {
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x >= tileCount;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y >= tileCount;

  if (hitLeftWall || hitRightWall || hitTopWall || hitBottomWall) {
    return true;
  }

  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  return false;
}

function drawScore() {
  scoreDisplay.innerText = `Score: ${score}`;
}

function showGameOver() {
  gameOverDisplay.style.display = 'block';
  gameOverDisplay.innerHTML = `<h2>Game Over!</h2><p>Final Score: ${score}</p>`;
  restartBtn.style.display = 'inline-block';
}

function genFood() {
  food = {
    x: Math.floor(Math.random() * tileCount),
    y: Math.floor(Math.random() * tileCount)
  };

  snake.forEach(part => {
    const hasEatenFood = part.x === food.x && part.y === food.y;
    if (hasEatenFood) genFood();
  });
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

function restartGame() {
  snake = [{x: 10, y: 10}];
  dx = 0;
  dy = 0;
  score = 0;
  gameRunning = true;
  changingDirection = false;
  gameOverDisplay.style.display = 'none';
  restartBtn.style.display = 'none';
  genFood();
  drawGame();
}

document.addEventListener('keydown', event => {
  changeDirection(event.key);
});

restartBtn.addEventListener('click', restartGame);

genFood();
drawGame();
