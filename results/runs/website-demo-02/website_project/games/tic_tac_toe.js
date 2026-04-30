(() => {
  let currentPlayer = 'X';
  let gameBoard = ['', '', '', '', '', '', '', '', ''];
  let gameActive = true;

  function createGameBoard(container) {
    const board = document.createElement('div');
    board.className = 'tic-tac-toe-board';
    board.style.display = 'grid';
    board.style.gridTemplateColumns = 'repeat(3, 100px)';
    board.style.gridGap = '10px';
    board.style.justifyContent = 'center';
    board.style.margin = '20px 0';
    
    // Create cells
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.style.width = '100px';
      cell.style.height = '100px';
      cell.style.backgroundColor = '#f0f0f0';
      cell.style.display = 'flex';
      cell.style.alignItems = 'center';
      cell.style.justifyContent = 'center';
      cell.style.fontSize = '2em';
      cell.style.fontWeight = 'bold';
      cell.style.cursor = 'pointer';
      cell.style.borderRadius = '5px';
      cell.setAttribute('data-index', i);
      
      cell.addEventListener('click', () => handleCellClick(i, cell));
      board.appendChild(cell);
    }
    
    container.appendChild(board);
    
    const status = document.createElement('div');
    status.id = 'status';
    status.style.textAlign = 'center';
    status.style.fontSize = '1.2em';
    status.style.margin = '20px 0';
    status.textContent = `Player ${currentPlayer}'s turn`;
    container.appendChild(status);
    
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart Game';
    restartButton.style.padding = '10px 20px';
    restartButton.style.fontSize = '1em';
    restartButton.addEventListener('click', () => resetGame(container));
    container.appendChild(restartButton);
    
    return { status };
  }

  function handleCellClick(index, cell) {
    if (gameBoard[index] !== '' || !gameActive) return;
    
    gameBoard[index] = currentPlayer;
    cell.textContent = currentPlayer;
    
    if (checkWin()) {
      endGame(false);
    } else if (gameBoard.every(cell => cell !== '')) {
      endGame(true);
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
      return pattern.every(index => gameBoard[index] === currentPlayer);
    });
  }

  function updateStatus() {
    const status = document.getElementById('status');
    if (status) {
      status.textContent = `Player ${currentPlayer}'s turn`;
    }
  }

  function endGame(isDraw) {
    gameActive = false;
    const status = document.getElementById('status');
    if (status) {
      status.textContent = isDraw ? "It's a draw!" : `Player ${currentPlayer} wins!`;
    }
  }

  function resetGame(container) {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    
    // Clear the board
    const cells = container.querySelectorAll('.cell');
    cells.forEach(cell => {
      cell.textContent = '';
    });
    
    updateStatus();
  }

  window.startTicTacToe = function(container) {
    container.innerHTML = '<h2 style="margin-bottom: 15px;">Tic Tac Toe</h2><p style="margin-bottom: 15px;">Players take turns placing X and O marks. First to get 3 in a row wins!</p>';
    createGameBoard(container);
  };

  window.stopTicTacToe = function() {
    // Cleanup if needed
  };
})();
