// Snake Game Implementation

class SnakeGame {
  constructor() {
    this.canvas = document.getElementById('gameCanvas');
    this.ctx = this.canvas.getContext('2d');
    this.scoreElement = document.getElementById('score');
    this.statusElement = document.getElementById('status');
    this.pauseBtn = document.getElementById('pauseBtn');
    this.restartBtn = document.getElementById('restartBtn');
    this.gameOverModal = document.getElementById('gameOverModal');
    this.finalScoreElement = document.getElementById('finalScore');
    this.playAgainBtn = document.getElementById('playAgainBtn');
    
    this.gridSize = 20;
    this.tileCount = this.canvas.width / this.gridSize;
    
    this.snake = [];
    this.food = {};
    this.velocityX = 0;
    this.velocityY = 0;
    this.nextVelocityX = 0;
    this.nextVelocityY = 0;
    this.score = 0;
    this.gameSpeed = 150; // milliseconds
    this.gameInterval = null;
    this.paused = false;
    this.gameRunning = false;
    
    this.fruitTypes = [
      { emoji: '🍎', color: '#ff6b6b' },
      { emoji: '🍐', color: '#c4e17f' },
      { emoji: '🍊', color: '#ffa726' }
    ];
    
    this.init();
  }
  
  init() {
    this.setupEventListeners();
    this.reset();
    this.draw(); // Initial draw
  }
  
  setupEventListeners() {
    document.addEventListener('keydown', (e) => this.handleKeydown(e));
    this.pauseBtn.addEventListener('click', () => this.togglePause());
    this.restartBtn.addEventListener('click', () => this.reset());
    this.playAgainBtn.addEventListener('click', () => {
      this.gameOverModal.style.display = 'none';
      this.reset();
    });
  }
  
  handleKeydown(e) {
    // Prevent default behavior for arrow keys to stop page scrolling
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
    
    if (!this.gameRunning && !this.paused) return;
    
    switch(e.key) {
      case 'ArrowUp':
        if (this.velocityY === 0) {
          this.nextVelocityX = 0;
          this.nextVelocityY = -1;
        }
        break;
      case 'ArrowDown':
        if (this.velocityY === 0) {
          this.nextVelocityX = 0;
          this.nextVelocityY = 1;
        }
        break;
      case 'ArrowLeft':
        if (this.velocityX === 0) {
          this.nextVelocityX = -1;
          this.nextVelocityY = 0;
        }
        break;
      case 'ArrowRight':
        if (this.velocityX === 0) {
          this.nextVelocityX = 1;
          this.nextVelocityY = 0;
        }
        break;
      case ' ':
        this.togglePause();
        break;
    }
  }
  
  togglePause() {
    if (!this.gameRunning) return;
    
    this.paused = !this.paused;
    this.statusElement.textContent = this.paused ? 'Paused' : 'Playing';
    this.pauseBtn.textContent = this.paused ? 'Resume' : 'Pause';
    
    if (this.paused) {
      clearInterval(this.gameInterval);
    } else {
      this.startGameLoop();
    }
  }
  
  reset() {
    // Clear any existing interval
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
    }
    
    // Reset game state
    this.snake = [
      {x: 10, y: 10}, // Head
      {x: 9, y: 10},
      {x: 8, y: 10}  // Tail
    ];
    this.velocityX = 1;
    this.velocityY = 0;
    this.nextVelocityX = this.velocityX;
    this.nextVelocityY = this.velocityY;
    this.score = 0;
    this.scoreElement.textContent = this.score;
    this.statusElement.textContent = 'Playing';
    this.paused = false;
    this.gameRunning = true;
    
    this.generateFood();
    this.startGameLoop();
  }
  
  startGameLoop() {
    this.gameInterval = setInterval(() => {
      this.update();
      this.draw();
    }, this.gameSpeed);
  }
  
  update() {
    if (this.paused || !this.gameRunning) return;
    
    // Apply next velocity
    this.velocityX = this.nextVelocityX;
    this.velocityY = this.nextVelocityY;
    
    // Move snake
    const head = {x: this.snake[0].x + this.velocityX, y: this.snake[0].y + this.velocityY};
    
    // Check collision with walls
    if (head.x < 0 || head.y < 0 || head.x >= this.tileCount || head.y >= this.tileCount) {
      this.gameOver();
      return;
    }
    
    // Check collision with self
    for (let i = 0; i < this.snake.length; i++) {
      if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
        this.gameOver();
        return;
      }
    }
    
    this.snake.unshift(head);
    
    // Check if food is eaten
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score++;
      this.scoreElement.textContent = this.score;
      this.generateFood();
    } else {
      this.snake.pop();
    }
  }
  
  draw() {
    // Clear canvas
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw snake
    this.snake.forEach((segment, index) => {
      if (index === 0) { // Head
        this.ctx.fillStyle = '#4CAF50';
      } else { // Body
        // Gradient effect
        const gradient = this.ctx.createLinearGradient(
          segment.x * this.gridSize, 
          segment.y * this.gridSize, 
          segment.x * this.gridSize + this.gridSize, 
          segment.y * this.gridSize + this.gridSize
        );
        gradient.addColorStop(0, '#4CAF50');
        gradient.addColorStop(1, '#8BC34A');
        this.ctx.fillStyle = gradient;
      }
      
      // Rounded corners
      this.ctx.beginPath();
      this.ctx.roundRect(
        segment.x * this.gridSize, 
        segment.y * this.gridSize, 
        this.gridSize, 
        this.gridSize, 
        5 // radius
      );
      this.ctx.fill();
    });
    
    // Draw food
    const fruit = this.fruitTypes[this.food.type];
    this.ctx.font = `${this.gridSize}px Arial`;
    this.ctx.fillText(fruit.emoji, this.food.x * this.gridSize, this.food.y * this.gridSize + this.gridSize - 2);
  }
  
  generateFood() {
    let newFood;
    let overlapping;
    
    do {
      overlapping = false;
      newFood = {
        x: Math.floor(Math.random() * this.tileCount),
        y: Math.floor(Math.random() * this.tileCount),
        type: Math.floor(Math.random() * this.fruitTypes.length)
      };
      
      // Check if food overlaps with snake
      for (let segment of this.snake) {
        if (segment.x === newFood.x && segment.y === newFood.y) {
          overlapping = true;
          break;
        }
      }
    } while (overlapping);
    
    this.food = newFood;
  }
  
  gameOver() {
    this.gameRunning = false;
    clearInterval(this.gameInterval);
    this.statusElement.textContent = 'Game Over';
    
    // Show modal
    this.finalScoreElement.textContent = this.score;
    this.gameOverModal.style.display = 'block';
  }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
  new SnakeGame();
});
