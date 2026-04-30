// Game state
let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let gameActive = true;

// DOM Elements
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetButton = document.getElementById('reset-button');

// Winning conditions
const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// Messages
const winningMessage = () => `Player ${currentPlayer} wins!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `Player ${currentPlayer}'s turn`;

// Initialize game
statusDisplay.innerHTML = currentPlayerTurn();

// Handle cell click
function handleCellClick(clickedCellEvent) {
  const clickedCell = clickedCellEvent.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

  // Check if cell is already played or game is inactive
  if (board[clickedCellIndex] !== '' || !gameActive) {
    return;
  }

  // Update board and UI
  board[clickedCellIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;

  // Check for win or draw
  if (checkWin()) {
    statusDisplay.innerHTML = winningMessage();
    gameActive = false;
    return;
  }

  if (checkDraw()) {
    statusDisplay.innerHTML = drawMessage();
    gameActive = false;
    return;
  }

  // Switch player
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  statusDisplay.innerHTML = currentPlayerTurn();
}

// Check for win
function checkWin() {
  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return true;
    }
  }
  return false;
}

// Check for draw
function checkDraw() {
  return !board.includes('');
}

// Reset game
function resetGame() {
  board = ['', '', '', '', '', '', '', '', ''];
  currentPlayer = 'X';
  gameActive = true;
  statusDisplay.innerHTML = currentPlayerTurn();
  cells.forEach(cell => (cell.textContent = ''));
}

// Event listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetButton.addEventListener('click', resetGame);
