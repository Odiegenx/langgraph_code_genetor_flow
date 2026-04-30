(function () {
  window.initMemoryMatch = function (containerId) {
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
    statusDisplay.textContent = 'Matches: 0/8';
    container.appendChild(statusDisplay);

    // Create game board
    const board = document.createElement('div');
    board.className = 'board';
    board.style.display = 'grid';
    board.style.gridTemplateColumns = 'repeat(4, 100px)';
    board.style.gridGap = '10px';
    board.style.justifyContent = 'center';
    container.appendChild(board);

    // Create reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Game';
    resetButton.style.display = 'block';
    resetButton.style.margin = '20px auto 0';
    resetButton.style.padding = '10px 20px';
    resetButton.onclick = () => initMemoryMatch(containerId);
    container.appendChild(resetButton);

    // Game state
    const symbols = ['🍎', '🍌', '🍇', '🍓', '🍊', '🍋', '🍒', '🍑'];
    let gameSymbols = [...symbols, ...symbols]; // Duplicate for pairs
    let flippedCards = [];
    let matchedPairs = 0;
    let lockBoard = false;

    // Shuffle array
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    // Update status display
    function updateStatus() {
      statusDisplay.textContent = `Matches: ${matchedPairs}/8`;
      if (matchedPairs === 8) {
        statusDisplay.textContent = 'Congratulations! You won!';
      }
    }

    // Flip card
    function flipCard(card) {
      if (lockBoard || card.classList.contains('flipped')) return;
      
      card.classList.add('flipped');
      card.textContent = card.dataset.symbol;
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        lockBoard = true;
        checkForMatch();
      }
    }

    // Check for match
    function checkForMatch() {
      const [firstCard, secondCard] = flippedCards;
      const isMatch = firstCard.dataset.symbol === secondCard.dataset.symbol;
      
      if (isMatch) {
        matchedPairs++;
        updateStatus();
        flippedCards = [];
        lockBoard = false;
        return;
      }

      // Not a match - flip back after delay
      setTimeout(() => {
        firstCard.classList.remove('flipped');
        firstCard.textContent = '?';
        secondCard.classList.remove('flipped');
        secondCard.textContent = '?';
        flippedCards = [];
        lockBoard = false;
      }, 1000);
    }

    // Create cards
    gameSymbols = shuffle(gameSymbols);
    for (let i = 0; i < 16; i++) {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.symbol = gameSymbols[i];
      card.textContent = '?';
      card.style.width = '100px';
      card.style.height = '100px';
      card.style.display = 'flex';
      card.style.alignItems = 'center';
      card.style.justifyContent = 'center';
      card.style.fontSize = '2em';
      card.style.fontWeight = 'bold';
      card.style.border = '2px solid #4a90e2';
      card.style.borderRadius = '8px';
      card.style.cursor = 'pointer';
      card.style.backgroundColor = '#f0f0f0';
      card.addEventListener('click', () => flipCard(card));
      board.appendChild(card);
    }

    // Initialize game
    updateStatus();
  };
})();
