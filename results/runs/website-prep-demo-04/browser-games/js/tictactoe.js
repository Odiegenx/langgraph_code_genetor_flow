(function () {
  window.initTicTacToe = function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    // Create game status display
    const statusDisplay = document.createElement('div');
    statusDisplay.id = 'status';
    statusDisplay.style.textAlign = 'center';
    statusDisplay.style.fontSize = '1.2em';
    statusDisplay.style.marginBottom = '10px';
    container.appendChild(statusDisplay);

    // Create game board
    const board = document.createElement('div');
    board.className = 'board';
    board.style.display = 'grid';
    board.style.gridTemplateColumns = 'repeat(3, 100px)';
    board.style.gridGap = '10px';
    board.style.justifyContent = 'center';
    container.appendChild(board);

    // Create reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Game';
    resetButton.style.display = 'block';
    resetButton.style.margin = '20px auto 0';
    resetButton.style.padding = '10px 20px';
    resetButton.onclick = () => initTicTacToe(containerId);
    container.appendChild(resetButton);

    // Game state
    let currentPlayer = 'X';
    let gameBoard = Array(9).fill(null);
    let gameActive = true;

    // Update status display
    function updateStatus() {
      if (gameActive) {
        statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
      }
    }

    // Check for win or draw
    function checkGameResult() {
      const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
      ];

      for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
          statusDisplay.textContent = `Player ${gameBoard[a]} Wins!`;
          gameActive = false;
          return;
        }
      }

      if (!gameBoard.includes(null)) {
        statusDisplay.textContent = "It's a Draw!";
        gameActive = false;
      }
    }

    // Handle cell click
    function handleCellClick(index) {
      if (!gameActive || gameBoard[index]) return;

      gameBoard[index] = currentPlayer;
      const cell = document.getElementById(`cell-${index}`);
      cell.textContent = currentPlayer;
      cell.style.cursor = 'default';

      checkGameResult();
      if (gameActive) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateStatus();
      }
    }

    // Create cells
    for (let i = 0; i < 9; i++) {
      const cell = document.createElement('div');
      cell.id = `cell-${i}`;
      cell.style.width = '100px';
      cell.style.height = '100px';
      cell.style.border = '2px solid #4a90e2';
      cell.style.display = 'flex';
      cell.style.alignItems = 'center';
      cell.style.justifyContent = 'center';
      cell.style.fontSize = '2em';
      cell.style.fontWeight = 'bold';
      cell.style.cursor = 'pointer';
      cell.addEventListener('click', () => handleCellClick(i));
      board.appendChild(cell);
    }

    // Initialize game
    updateStatus();
  };
})();
