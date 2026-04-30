(() => {
  let gameInterval;
  let snake = [];
  let direction = 'right';
  let nextDirection = 'right';
  let food = {};
  let score = 0;
  let gameActive = false;
  let gridSize = 20;
  let cellSize = 20;

  function createGameBoard(container) {
    const canvas = document.createElement('canvas');
    canvas.width = gridSize * cellSize;
    canvas.height = gridSize * cellSize;
    canvas.id = 'snake-canvas';
    container.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    
    const scoreDisplay = document.createElement('div');
    scoreDisplay.id = 'snake-score';
    scoreDisplay.style.marginTop = '10px';
    scoreDisplay.style.fontSize = '18px';
    scoreDisplay.style.fontWeight = 'bold';
    container.appendChild(scoreDisplay);
    
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart Game';
    restartButton.style.marginTop = '10px';
    restartButton.style.padding = '8px 16px';
    restartButton.addEventListener('click', () => {
      clearInterval(gameInterval);
      initGame(container);
    });
    container.appendChild(restartButton);
    
    return { canvas, ctx, scoreDisplay };
  }

  function initGame(container) {
    const { canvas, ctx, scoreDisplay } = createGameBoard(container);
    
    snake = [
      {x: 10, y: 10},
      {x: 9, y: 10},
      {x: 8, y: 10}
    ];
    
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    gameActive = true;
    
    generateFood();
    updateScore(scoreDisplay);
    
    document.addEventListener('keydown', changeDirection);
    
    gameInterval = setInterval(() => {
      if (!gameActive) return;
      moveSnake();
      if (checkCollision()) {
        gameOver(container);
        return;
      }
      drawGame(ctx, canvas);
    }, 150);
  }

  function generateFood() {
    food = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize)
    };
    
    // Make sure food doesn't appear on snake
    for (let segment of snake) {
      if (segment.x === food.x && segment.y === food.y) {
        generateFood();
        break;
      }
    }
  }

  function changeDirection(event) {
    const keyPressed = event.key;
    
    if (keyPressed === 'ArrowUp' && direction !== 'down') {
      nextDirection = 'up';
    } else if (keyPressed === 'ArrowDown' && direction !== 'up') {
      nextDirection = 'down';
    } else if (keyPressed === 'ArrowLeft' && direction !== 'right') {
      nextDirection = 'left';
    } else if (keyPressed === 'ArrowRight' && direction !== 'left') {
      nextDirection = 'right';
    }
  }

  function moveSnake() {
    direction = nextDirection;
    
    const head = {x: snake[0].x, y: snake[0].y};
    
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
    
    snake.unshift(head);
    
    // Check if snake ate food
    if (head.x === food.x && head.y === food.y) {
      score++;
      generateFood();
    } else {
      snake.pop();
    }
  }

  function checkCollision() {
    const head = snake[0];
    
    // Wall collision
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
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

  function drawGame(ctx, canvas) {
    // Clear canvas
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#2e8b57' : '#3cb371'; // Head is darker
      ctx.fillRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
      
      // Border for each segment
      ctx.strokeStyle = '#1a5d38';
      ctx.strokeRect(segment.x * cellSize, segment.y * cellSize, cellSize, cellSize);
    });
    
    // Draw food
    ctx.fillStyle = '#ff4500';
    ctx.beginPath();
    ctx.arc(
      food.x * cellSize + cellSize/2,
      food.y * cellSize + cellSize/2,
      cellSize/2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  function updateScore(scoreDisplay) {
    scoreDisplay.textContent = `Score: ${score}`;
  }

  function gameOver(container) {
    gameActive = false;
    clearInterval(gameInterval);
    document.removeEventListener('keydown', changeDirection);
    
    const ctx = container.querySelector('#snake-canvas').getContext('2d');
    const canvas = container.querySelector('#snake-canvas');
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = '30px Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width/2, canvas.height/2 - 15);
    
    ctx.font = '20px Arial';
    ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2 + 20);
  }

  window.startSnakeGame = function(container) {
    container.innerHTML = '<h2 style="margin-bottom: 15px;">Snake Game</h2><p style="margin-bottom: 15px;">Use arrow keys to control the snake. Eat the red food to grow and earn points!</p>';
    initGame(container);
  };

  window.stopSnakeGame = function() {
    if (gameInterval) {
      clearInterval(gameInterval);
    }
    document.removeEventListener('keydown', changeDirection);
  };
})();
