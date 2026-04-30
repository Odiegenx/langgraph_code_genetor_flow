(function() {
  let canvas, ctx, snake, apple, direction, nextDirection, score, speed, gameInterval;

  function init() {
    canvas = document.getElementById('game-canvas');
    ctx = canvas.getContext('2d');
    score = 0;
    speed = 150;
    direction = 'right';
    nextDirection = 'right';
    snake = [
      {x: 5, y: 7},
      {x: 4, y: 7},
      {x: 3, y: 7}
    ];
    spawnApple();
    document.addEventListener('keydown', changeDirection);
    gameInterval = setInterval(gameLoop, speed);
    updateScore();
  }

  function gameLoop() {
    direction = nextDirection;
    moveSnake();
    if (checkCollision()) {
      clearInterval(gameInterval);
      alert('Game Over! Final Score: ' + score);
      return;
    }
    if (ateApple()) {
      score++;
      updateScore();
      spawnApple();
    } else {
      snake.pop();
    }
    draw();
  }

  function moveSnake() {
    const head = {...snake[0]};
    switch(direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }
    snake.unshift(head);
  }

  function changeDirection(e) {
    switch(e.key) {
      case 'ArrowUp':
        if (direction !== 'down') nextDirection = 'up';
        break;
      case 'ArrowDown':
        if (direction !== 'up') nextDirection = 'down';
        break;
      case 'ArrowLeft':
        if (direction !== 'right') nextDirection = 'left';
        break;
      case 'ArrowRight':
        if (direction !== 'left') nextDirection = 'right';
        break;
    }
  }

  function spawnApple() {
    apple = {
      x: Math.floor(Math.random() * (canvas.width / 20)),
      y: Math.floor(Math.random() * (canvas.height / 20))
    };
    // Ensure apple doesn't spawn on snake
    for (let segment of snake) {
      if (segment.x === apple.x && segment.y === apple.y) {
        return spawnApple();
      }
    }
  }

  function ateApple() {
    return snake[0].x === apple.x && snake[0].y === apple.y;
  }

  function checkCollision() {
    const head = snake[0];
    // Wall collision
    if (head.x < 0 || head.x >= canvas.width/20 || head.y < 0 || head.y >= canvas.height/20) {
      return true;
    }
    // Self collision
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        return true;
      }
    }
    return false;
  }

  function draw() {
    // Clear canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    ctx.fillStyle = '#4a90e2';
    for (let segment of snake) {
      ctx.fillRect(segment.x * 20, segment.y * 20, 20, 20);
    }
    
    // Draw apple
    ctx.fillStyle = '#e94b3c';
    ctx.fillRect(apple.x * 20, apple.y * 20, 20, 20);
  }

  function updateScore() {
    document.getElementById('score').textContent = 'Score: ' + score;
  }

  // Initialize game when page loads
  window.onload = init;
})();
