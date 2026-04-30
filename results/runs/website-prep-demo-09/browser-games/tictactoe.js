(function() {
  let boardState, currentPlayer, gameActive;

  function init() {
    boardState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    gameActive = true;
    document.querySelectorAll('.cell').forEach(cell => {
      cell.textContent = '';
      cell.addEventListener('click', handleCellClick);
    });
    document.getElementById('reset-btn').addEventListener('click', resetGame);
    updateStatus();
  }

  function handleCellClick(event) {
    const index = parseInt(event.target.dataset.index);
    if (boardState[index] !== '' || !gameActive) return;
    
    boardState[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    
    if (checkWin()) {
      gameActive = false;
      updateStatus(`Player ${currentPlayer} wins!`);
    } else if (checkDraw()) {
      gameActive = false;
      updateStatus("It's a draw!");
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      updateStatus();
    }
  }

  function checkWin() {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];
    
    return winPatterns.some(pattern => {
      const [a, b, c] = pattern;
      return boardState[a] !== '' && 
             boardState[a] === boardState[b] && 
             boardState[a] === boardState[c];
    });
  }

  function checkDraw() {
    return boardState.every(cell => cell !== '');
  }

  function updateStatus(message) {
    const statusElement = document.getElementById('status');
    if (message) {
      statusElement.textContent = message;
    } else {
      statusElement.textContent = `Player ${currentPlayer}'s turn`;
    }
  }

  function resetGame() {
    init();
  }

  // Initialize game when page loads
  window.onload = init;
})();
