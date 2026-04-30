(function() {
  const canvas = document.getElementById('snake-canvas');
  const ctx = canvas.getContext('2d');
  const scoreDisplay = document.getElementById('score-display');
  const highScoreDisplay = document.getElementById('high-score');
  const startBtn = document.getElementById('start-btn');
  
  const gridSize = 20;
  const tileCount = canvas.width / gridSize;
  
  let snake = [];
  let food = {};
  let dx = 0;
  let dy = 0;
  let pendingDirection = { dx: 0, dy: 0 };
  let score = 0;
  let highScore = localStorage.getItem('snakeHighScore') || 0;
  let gameInterval;
  let gameRunning = false;
  
  highScoreDisplay.textContent = highScore;
  
  function resetGame() {
    snake = [
      {x: 10, y: 10},
      {x: 9, y: 10},
      {x: 8, y: 10}
    ];
    
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
    
    dx = 1;
    dy = 0;
    pendingDirection = { dx: 1, dy: 0 };
    score = 0;
    scoreDisplay.textContent = score;
  }
  
  function drawGame() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    
    // Draw snake
    ctx.fillStyle = 'lime';
    for (let i = 0; i < snake.length; i++) {
      ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
      
      // Draw eyes on head
      if (i === 0) {
        ctx.fillStyle = 'black';
        // Position eyes based on direction
        if (dx === 1 && dy === 0) { // Right
          ctx.fillRect((snake[i].x * gridSize) + 14, (snake[i].y * gridSize) + 4, 4, 4);
          ctx.fillRect((snake[i].x * gridSize) + 14, (snake[i].y * gridSize) + 12, 4, 4);
        } else if (dx === -1 && dy === 0) { // Left
          ctx.fillRect((snake[i].x * gridSize) + 2, (snake[i].y * gridSize) + 4, 4, 4);
          ctx.fillRect((snake[i].x * gridSize) + 2, (snake[i].y * gridSize) + 12, 4, 4);
        } else if (dx === 0 && dy === -1) { // Up
          ctx.fillRect((snake[i].x * gridSize) + 4, (snake[i].y * gridSize) + 2, 4, 4);
          ctx.fillRect((snake[i].x * gridSize) + 12, (snake[i].y * gridSize) + 2, 4, 4);
        } else if (dx === 0 && dy === 1) { // Down
          ctx.fillRect((snake[i].x * gridSize) + 4, (snake[i].y * gridSize) + 14, 4, 4);
          ctx.fillRect((snake[i].x * gridSize) + 12, (snake[i].y * gridSize) + 14, 4, 4);
        }
        ctx.fillStyle = 'lime';
      }
    }
  }
  
  function moveSnake() {
    // Apply pending direction change
    dx = pendingDirection.dx;
    dy = pendingDirection.dy;
    
    // Create new head
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    
    // Check collision with walls
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
      gameOver();
      return;
    }
    
    // Check collision with self
    for (let i = 0; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y) {
        gameOver();
        return;
      }
    }
    
    // Add new head
    snake.unshift(head);
    
    // Check if food is eaten
    if (head.x === food.x && head.y === food.y) {
      // Increase score
      score++;
      scoreDisplay.textContent = score;
      
      // Generate new food
      food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
      
      // Make sure food doesn't appear on snake
      for (let segment of snake) {
        if (food.x === segment.x && food.y === segment.y) {
          food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
          };
        }
      }
    } else {
      // Remove tail if no food eaten
      snake.pop();
    }
  }
  
  function gameOver() {
    clearInterval(gameInterval);
    gameRunning = false;
    startBtn.textContent = 'Start Game';
    
    // Update high score
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('snakeHighScore', highScore);
      highScoreDisplay.textContent = highScore;
    }
  }
  
  function gameLoop() {
    moveSnake();
    drawGame();
  }
  
  function startGame() {
    if (!gameRunning) {
      resetGame();
      gameRunning = true;
      startBtn.textContent = 'Restart Game';
      gameInterval = setInterval(gameLoop, 100);
    } else {
      // Restart game
      clearInterval(gameInterval);
      resetGame();
      gameRunning = true;
      gameInterval = setInterval(gameLoop, 100);
    }
  }
  
  // Handle keyboard input
  document.addEventListener('keydown', e => {
    // Prevent 180-degree turns
    switch(e.key) {
      case 'ArrowUp':
        if (dy === 0) {
          pendingDirection = { dx: 0, dy: -1 };
        }
        break;
      case 'ArrowDown':
        if (dy === 0) {
          pendingDirection = { dx: 0, dy: 1 };
        }
        break;
      case 'ArrowLeft':
        if (dx === 0) {
          pendingDirection = { dx: -1, dy: 0 };
        }
        break;
      case 'ArrowRight':
        if (dx === 0) {
          pendingDirection = { dx: 1, dy: 0 };
        }
        break;
    }
  });
  
  startBtn.addEventListener('click', startGame);
  
  // Initial draw
  resetGame();
  drawGame();
})();
