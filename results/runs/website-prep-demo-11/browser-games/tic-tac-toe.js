(function() {
  const status = document.getElementById('status');
  const restartBtn = document.getElementById('restart-btn');
  const cells = document.querySelectorAll('.cell');
  
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
    
    if (gameBoard[index] !== '' || !gameActive) {
      return;
    }
    
    // Make player move
    makeMove(index, currentPlayer);
    
    // Check game state
    if (checkWin()) {
      endGame(false);
      return;
    }
    
    if (checkDraw()) {
      endGame(true);
      return;
    }
    
    // Switch to AI player
    currentPlayer = 'O';
    status.textContent = 'AI thinking...';
    
    // AI makes a move after a short delay
    setTimeout(makeAIMove, 500);
  }
  
  function makeMove(index, player) {
    gameBoard[index] = player;
    cells[index].textContent = player;
  }
  
  function makeAIMove() {
    if (!gameActive) return;
    
    // Check for winning move
    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] === '') {
        gameBoard[i] = 'O';
        if (checkWinForPlayer('O')) {
          makeMove(i, 'O');
          endGame(false);
          return;
        }
        gameBoard[i] = '';
      }
    }
    
    // Check for blocking move
    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] === '') {
        gameBoard[i] = 'X';
        if (checkWinForPlayer('X')) {
          makeMove(i, 'O');
          if (checkWin()) {
            endGame(false);
          } else {
            currentPlayer = 'X';
            status.textContent = 'Your turn (X)';
          }
          return;
        }
        gameBoard[i] = '';
      }
    }
    
    // Make a random move
    const availableMoves = [];
    for (let i = 0; i < gameBoard.length; i++) {
      if (gameBoard[i] === '') {
        availableMoves.push(i);
      }
    }
    
    if (availableMoves.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      makeMove(availableMoves[randomIndex], 'O');
      
      if (checkWin()) {
        endGame(false);
      } else if (checkDraw()) {
        endGame(true);
      } else {
        currentPlayer = 'X';
        status.textContent = 'Your turn (X)';
      }
    }
  }
  
  function checkWin() {
    return winningConditions.some(condition => {
      return condition.every(index => {
        return gameBoard[index] === currentPlayer;
      });
    });
  }
  
  function checkWinForPlayer(player) {
    return winningConditions.some(condition => {
      return condition.every(index => {
        return gameBoard[index] === player;
      });
    });
  }
  
  function checkDraw() {
    return gameBoard.every(cell => cell !== '');
  }
  
  function endGame(draw) {
    gameActive = false;
    if (draw) {
      status.textContent = 'Game ended in a draw!';
    } else {
      status.textContent = currentPlayer === 'X' ? 'You win!' : 'AI wins!';
    }
  }
  
  function restartGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    status.textContent = 'Your turn (X)';
    
    cells.forEach(cell => {
      cell.textContent = '';
    });
  }
  
  // Event listeners
  cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
  });
  
  restartBtn.addEventListener('click', restartGame);
})();
