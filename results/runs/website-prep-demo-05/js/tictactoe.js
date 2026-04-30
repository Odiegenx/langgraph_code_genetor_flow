// Tic Tac Toe game logic
const boardElement = document.getElementById('board');
const statusElement = document.getElementById('status');
let currentPlayer = 'X';
let gameState = ['', '', '', '', '', '', '', '', ''];
const winConditions = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

function createBoard() {
  boardElement.innerHTML = '';
  gameState = ['', '', '', '', '', '', '', '', ''];
  statusElement.innerText = "Player X's Turn";
  currentPlayer = 'X';
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.setAttribute('data-index', i);
    cell.addEventListener('click', handleCellClick);
    boardElement.appendChild(cell);
  }
}

function handleCellClick(event) {
  const index = parseInt(event.target.getAttribute('data-index'));
  if (gameState[index] !== '' || checkWin() || checkDraw()) return;
  gameState[index] = currentPlayer;
  event.target.innerText = currentPlayer;
  if (checkWin()) {
    statusElement.innerText = `Player ${currentPlayer} Wins!`;
  } else if (checkDraw()) {
    statusElement.innerText = 'Draw!';
  } else {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusElement.innerText = `Player ${currentPlayer}'s Turn`;
  }
}

function checkWin() {
  return winConditions.some(condition => {
    return condition.every(index => {
      return gameState[index] === currentPlayer;
    });
  });
}

function checkDraw() {
  return gameState.every(cell => cell !== '');
}

function resetGame() {
  createBoard();
}

createBoard();
