// Tic Tac Toe Game Implementation

class TicTacToe {
  constructor() {
    this.board = Array(9).fill('');
    this.currentPlayer = 'X';
    this.gameActive = true;
    this.scores = {
      player: 0,
      ai: 0,
      draws: 0
    };
    
    // DOM Elements
    this.boardElement = document.getElementById('board');
    this.statusElement = document.getElementById('status');
    this.difficultySelect = document.getElementById('difficulty');
    this.resetBtn = document.getElementById('resetBtn');
    this.playerScoreElement = document.getElementById('playerScore');
    this.aiScoreElement = document.getElementById('aiScore');
    this.drawScoreElement = document.getElementById('drawScore');
    
    // Tutorial elements
    this.highlightExamples = document.querySelectorAll('.highlight-example');
    
    this.init();
  }
  
  init() {
    this.createBoard();
    this.setupEventListeners();
    this.loadScores();
    this.updateScoreDisplay();
    this.setupTutorial();
  }
  
  createBoard() {
    this.boardElement.innerHTML = '';
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('data-index', i);
      cell.addEventListener('click', () => this.handleCellClick(i));
      this.boardElement.appendChild(cell);
    }
  }
  
  setupEventListeners() {
    this.resetBtn.addEventListener('click', () => this.resetGame());
    this.difficultySelect.addEventListener('change', () => {
      StorageUtil.save('tictactoe_difficulty', this.difficultySelect.value);
    });
    
    // Load saved difficulty
    const savedDifficulty = StorageUtil.load('tictactoe_difficulty', 'medium');
    this.difficultySelect.value = savedDifficulty;
  }
  
  setupTutorial() {
    this.highlightExamples.forEach(example => {
      example.addEventListener('click', () => {
        // Remove active class from all examples
        this.highlightExamples.forEach(ex => ex.classList.remove('active'));
        
        // Add active class to clicked example
        example.classList.add('active');
        
        // Highlight corresponding cells on the board
        this.highlightCells(example.dataset.highlight);
      });
    });
  }
  
  highlightCells(type) {
    // Remove previous highlights
    document.querySelectorAll('.cell').forEach(cell => {
      cell.classList.remove('win');
    });
    
    // Add highlights based on type
    if (type === 'center') {
      document.querySelector('[data-index="4"]').classList.add('win');
    } else if (type === 'fork') {
      document.querySelector('[data-index="0"]').classList.add('win');
      document.querySelector('[data-index="6"]').classList.add('win');
    } else if (type === 'winning') {
      document.querySelector('[data-index="0"]').classList.add('win');
      document.querySelector('[data-index="1"]').classList.add('win');
    }
  }
  
  handleCellClick(index) {
    if (this.board[index] !== '' || !this.gameActive || this.currentPlayer !== 'X') {
      return;
    }
    
    this.makeMove(index, 'X');
    
    if (this.gameActive) {
      this.currentPlayer = 'O';
      this.statusElement.textContent = "AI is thinking...";
      
      // AI makes a move after a short delay
      setTimeout(() => this.makeAIMove(), 500);
    }
  }
  
  makeMove(index, player) {
    this.board[index] = player;
    const cell = document.querySelector(`[data-index="${index}"]`);
    cell.classList.add(player.toLowerCase());
    
    if (this.checkWin()) {
      this.endGame(`${player === 'X' ? 'Player' : 'AI'} wins!`);
      this.updateScore(player === 'X' ? 'player' : 'ai');
    } else if (this.checkDraw()) {
      this.endGame("It's a draw!");
      this.updateScore('draws');
    }
  }
  
  makeAIMove() {
    if (!this.gameActive) return;
    
    const difficulty = this.difficultySelect.value;
    let move;
    
    switch(difficulty) {
      case 'easy':
        move = this.getEasyMove();
        break;
      case 'medium':
        move = this.getMediumMove();
        break;
      case 'hard':
        move = this.getHardMove();
        break;
      default:
        move = this.getMediumMove();
    }
    
    this.makeMove(move, 'O');
    
    if (this.gameActive) {
      this.currentPlayer = 'X';
      this.statusElement.textContent = "Your turn (X)";
    }
  }
  
  // Easy AI: Random moves with 30% chance of suboptimal play
  getEasyMove() {
    const emptyIndices = this.board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
    
    // 30% chance of making a random (suboptimal) move
    if (Math.random() < 0.3) {
      return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    }
    
    // 70% chance of making a smart move
    // Check for winning move
    for (let i = 0; i < emptyIndices.length; i++) {
      const index = emptyIndices[i];
      this.board[index] = 'O';
      if (this.checkWinForPlayer('O')) {
        this.board[index] = '';
        return index;
      }
      this.board[index] = '';
    }
    
    // Check for blocking move
    for (let i = 0; i < emptyIndices.length; i++) {
      const index = emptyIndices[i];
      this.board[index] = 'X';
      if (this.checkWinForPlayer('X')) {
        this.board[index] = '';
        return index;
      }
      this.board[index] = '';
    }
    
    // Otherwise random
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
  }
  
  // Medium AI: Minimax with depth limit
  getMediumMove() {
    // Limit search depth for performance
    return this.minimax(this.board, 4, false).index;
  }
  
  // Hard AI: Full minimax
  getHardMove() {
    return this.minimax(this.board, 0, false).index;
  }
  
  minimax(board, depth, isMaximizing) {
    const winner = this.checkWinner();
    
    // Base cases
    if (winner === 'X') {
      return { score: -10 };
    } else if (winner === 'O') {
      return { score: 10 };
    } else if (this.checkDraw()) {
      return { score: 0 };
    }
    
    // Depth limit for medium difficulty
    if (depth === 0) {
      return { score: 0 };
    }
    
    if (isMaximizing) {
      let bestScore = -Infinity;
      let bestMove = null;
      
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'O';
          const result = this.minimax(board, depth - 1, false);
          board[i] = '';
          
          if (result.score > bestScore) {
            bestScore = result.score;
            bestMove = i;
          }
        }
      }
      
      return { score: bestScore, index: bestMove };
    } else {
      let bestScore = Infinity;
      let bestMove = null;
      
      for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
          board[i] = 'X';
          const result = this.minimax(board, depth - 1, true);
          board[i] = '';
          
          if (result.score < bestScore) {
            bestScore = result.score;
            bestMove = i;
          }
        }
      }
      
      return { score: bestScore, index: bestMove };
    }
  }
  
  checkWin() {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        // Highlight winning cells
        document.querySelector(`[data-index="${a}"]`).classList.add('win');
        document.querySelector(`[data-index="${b}"]`).classList.add('win');
        document.querySelector(`[data-index="${c}"]`).classList.add('win');
        return true;
      }
    }
    
    return false;
  }
  
  checkWinForPlayer(player) {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (this.board[a] === player && this.board[b] === player && this.board[c] === player) {
        return true;
      }
    }
    
    return false;
  }
  
  checkWinner() {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return this.board[a];
      }
    }
    
    return null;
  }
  
  checkDraw() {
    return this.board.every(cell => cell !== '');
  }
  
  endGame(message) {
    this.gameActive = false;
    this.statusElement.textContent = message;
    this.updateScoreDisplay();
    StorageUtil.save('tictactoe_scores', this.scores);
  }
  
  updateScore(winner) {
    this.scores[winner]++;
  }
  
  updateScoreDisplay() {
    this.playerScoreElement.textContent = this.scores.player;
    this.aiScoreElement.textContent = this.scores.ai;
    this.drawScoreElement.textContent = this.scores.draws;
  }
  
  loadScores() {
    const savedScores = StorageUtil.load('tictactoe_scores', {
      player: 0,
      ai: 0,
      draws: 0
    });
    this.scores = savedScores;
  }
  
  resetGame() {
    this.board = Array(9).fill('');
    this.currentPlayer = 'X';
    this.gameActive = true;
    this.statusElement.textContent = "Your turn (X)";
    this.createBoard();
  }
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', () => {
  new TicTacToe();
});
