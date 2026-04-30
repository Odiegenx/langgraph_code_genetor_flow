// Tic Tac Toe Game Logic
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function handleCellClick(e) {
  const cell = e.target;
  const index = parseInt(cell.getAttribute('data-index'));
  
  if (gameBoard[index] !== '' || !gameActive) return;
  
  gameBoard[index] = currentPlayer;
  cell.textContent = currentPlayer;
  
  checkResult();
  
  if (gameActive) {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    document.getElementById('status').textContent = `Player ${currentPlayer}'s Turn`;
  }
}

function checkResult() {
  let roundWon = false;
  
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
      roundWon = true;
      break;
    }
  }
  
  if (roundWon) {
    document.getElementById('status').textContent = `Player ${currentPlayer} Wins!`;
    gameActive = false;
    return;
  }
  
  if (!gameBoard.includes('')) {
    document.getElementById('status').textContent = "It's a Draw!";
    gameActive = false;
    return;
  }
}

function resetGame() {
  currentPlayer = 'X';
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  gameActive = true;
  document.getElementById('status').textContent = `Player X's Turn`;
  
  const cells = document.querySelectorAll('.cell');
  cells.forEach(cell => {
    cell.textContent = '';
  });
}

document.querySelectorAll('.cell').forEach(cell => {
  cell.addEventListener('click', handleCellClick);
});

document.getElementById('resetButton').addEventListener('click', resetGame);
