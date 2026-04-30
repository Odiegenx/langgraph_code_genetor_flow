(function () {
  window.initSnake = function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    // Create score display
    const scoreDisplay = document.createElement('div');
    scoreDisplay.id = 'score';
    scoreDisplay.style.marginTop = '10px';
    scoreDisplay.style.textAlign = 'center';
    scoreDisplay.style.fontSize = '1.2em';
    container.appendChild(scoreDisplay);

    // Game constants
    const gridSize = 20;
    const tileCount = canvas.width / gridSize;

    // Game state
    let snake = [
      { x: 10, y: 10 }
    ];
    let food = {};
    let dx = 0;
    let dy = 0;
    let score = 0;
    let changingDirection = false;
    let gameRunning = true;

    // Generate random food position
    function randomFood() {
      food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
    }

    // Draw game elements
    function drawGame() {
      // Clear canvas
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw snake
      ctx.fillStyle = 'green';
      for (let segment of snake) {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
      }

      // Draw food
      ctx.fillStyle = 'red';
      ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
    }

    // Update game state
    function updateGame() {
      if (!gameRunning) return;

      // Move snake
      const head = { x: snake[0].x + dx, y: snake[0].y + dy };
      snake.unshift(head);

      // Check collision with walls
      if (
        head.x < 0 ||
        head.y < 0 ||
        head.x >= tileCount ||
        head.y >= tileCount
      ) {
        gameOver();
        return;
      }

      // Check collision with self
      for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
          gameOver();
          return;
        }
      }

      // Check if food eaten
      if (head.x === food.x && head.y === food.y) {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        randomFood();
      } else {
        snake.pop();
      }
    }

    // Game over handler
    function gameOver() {
      gameRunning = false;
      const gameOverDiv = document.createElement('div');
      gameOverDiv.textContent = 'Game Over!';
      gameOverDiv.style.color = 'red';
      gameOverDiv.style.textAlign = 'center';
      gameOverDiv.style.fontSize = '2em';
      gameOverDiv.style.marginTop = '20px';
      container.appendChild(gameOverDiv);

      const restartBtn = document.createElement('button');
      restartBtn.textContent = 'Play Again';
      restartBtn.style.display = 'block';
      restartBtn.style.margin = '10px auto';
      restartBtn.style.padding = '10px 20px';
      restartBtn.onclick = () => {
        window.initSnake(containerId);
      };
      container.appendChild(restartBtn);
    }

    // Main game loop
    function gameLoop() {
      changingDirection = false;
      updateGame();
      drawGame();
      if (gameRunning) {
        setTimeout(gameLoop, 150);
      }
    }

    // Handle keyboard input
    function changeDirection(e) {
      if (changingDirection) return;
      changingDirection = true;

      const LEFT_KEY = 37;
      const RIGHT_KEY = 39;
      const UP_KEY = 38;
      const DOWN_KEY = 40;

      const keyPressed = e.keyCode;

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

    // Initialize game
    document.addEventListener('keydown', changeDirection);
    randomFood();
    scoreDisplay.textContent = `Score: ${score}`;
    gameLoop();
  };
})();
