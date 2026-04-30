// Snake game logic
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
let score = 0;
let snake = [{x: 200, y: 200}];
let dx = 0;
let dy = 0;
let food = {x: 300, y: 300};
let changingDirection = false;

document.addEventListener("keydown", changeDirection);

function main() {
  if (hasGameEnded()) return;
  changingDirection = false;
  setTimeout(function onTick() {
    clearCanvas();
    drawFood();
    advanceSnake();
    drawSnake();
    main();
  }, 100);
}

function clearCanvas() {
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, 10, 10);
}

function advanceSnake() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);
  const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
  if (didEatFood) {
    score += 10;
    document.getElementById('score').innerText = score;
    genFood();
  } else {
    snake.pop();
  }
}

function drawSnake() {
  snake.forEach(part => {
    ctx.fillStyle = 'green';
    ctx.fillRect(part.x, part.y, 10, 10);
  });
}

function hasGameEnded() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) return true;
  }
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > canvas.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > canvas.height - 10;
  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

function changeDirection(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;
  if (changingDirection) return;
  changingDirection = true;
  const keyPressed = event.keyCode;
  const goingUp = dy === -10;
  const goingDown = dy === 10;
  const goingRight = dx === 10;
  const goingLeft = dx === -10;
  if (keyPressed === LEFT_KEY && !goingRight) {
    dx = -10;
    dy = 0;
  }
  if (keyPressed === UP_KEY && !goingDown) {
    dx = 0;
    dy = -10;
  }
  if (keyPressed === RIGHT_KEY && !goingLeft) {
    dx = 10;
    dy = 0;
  }
  if (keyPressed === DOWN_KEY && !goingUp) {
    dx = 0;
    dy = 10;
  }
}

function genFood() {
  food.x = Math.floor(Math.random() * 39) * 10;
  food.y = Math.floor(Math.random() * 39) * 10;
}

genFood();
main();
