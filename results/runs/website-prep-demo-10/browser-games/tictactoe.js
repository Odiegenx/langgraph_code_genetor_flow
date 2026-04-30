// Game state
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

// DOM elements
const boardElement = document.getElementById('ttt-board');
const currentPlayerElement = document.getElementById('ttt-current-player');
const resultMessageElement = document.getElementById('ttt-result-message');
const resetButton = document.getElementById('ttt-reset');

// Winning combinations
const winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// Initialize the game
function init() {
  createBoard();
  resetButton.addEventListener('click', resetGame);
}

// Create the game board
function createBoard() {
  boardElement.innerHTML = '';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('ttt-cell');
    cell.setAttribute('data-index', i);
    cell.addEventListener('click', handleCellClick);
    boardElement.appendChild(cell);
  }
}

// Handle cell click
function handleCellClick(event) {
  const index = parseInt(event.target.getAttribute('data-index'));
  
  // If cell is already taken or game is inactive, ignore
  if (gameBoard[index] !== '' || !gameActive) return;
  
  // Update board state
  gameBoard[index] = currentPlayer;
  event.target.textContent = currentPlayer;
  
  // Check for win or draw
  if (checkWin()) {
    resultMessageElement.textContent = `Player ${currentPlayer} wins!`;
    gameActive = false;
  } else if (checkDraw()) {
    resultMessageElement.textContent = "It's a draw!";
    gameActive = false;
  } else {
    // Switch player
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    currentPlayerElement.textContent = currentPlayer;
  }
}

// Check for win
function checkWin() {
  return winPatterns.some(pattern => {
    return pattern.every(index => gameBoard[index] === currentPlayer);
  });
}

// Check for draw
function checkDraw() {
  return gameBoard.every(cell => cell !== '');
}

// Reset game
function resetGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  currentPlayer = 'X';
  currentPlayerElement.textContent = currentPlayer;
  resultMessageElement.textContent = '';
  createBoard();
}

// Initialize the game when page loads
window.onload = init;
