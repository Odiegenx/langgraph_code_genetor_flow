(() => {
  let cards = [];
  let flippedCards = [];
  let matchedPairs = 0;
  let attempts = 0;
  let lockBoard = false;
  
  const symbols = ['★', '☆', '♡', '♢', '♤', '♧', '☀', '☁', '☂', '☃', '☄', '☎'];

  function createGameBoard(container) {
    const gameWrapper = document.createElement('div');
    
    const stats = document.createElement('div');
    stats.id = 'memory-stats';
    stats.style.display = 'flex';
    stats.style.justifyContent = 'space-between';
    stats.style.marginBottom = '20px';
    stats.style.fontSize = '1.1em';
    
    const attemptsDisplay = document.createElement('span');
    attemptsDisplay.id = 'attempts';
    attemptsDisplay.textContent = 'Attempts: 0';
    
    const matchesDisplay = document.createElement('span');
    matchesDisplay.id = 'matches';
    matchesDisplay.textContent = 'Matches: 0/8';
    
    stats.appendChild(attemptsDisplay);
    stats.appendChild(matchesDisplay);
    gameWrapper.appendChild(stats);
    
    const board = document.createElement('div');
    board.className = 'memory-board';
    board.style.display = 'grid';
    board.style.gridTemplateColumns = 'repeat(4, 1fr)';
    board.style.gap = '10px';
    board.style.maxWidth = '400px';
    board.style.margin = '0 auto';
    
    initializeCards();
    
    cards.forEach((card, index) => {
      const cardElement = document.createElement('div');
      cardElement.className = 'memory-card';
      cardElement.style.width = '100%';
      cardElement.style.height = '100px';
      cardElement.style.backgroundColor = '#3498db';
      cardElement.style.borderRadius = '5px';
      cardElement.style.display = 'flex';
      cardElement.style.alignItems = 'center';
      cardElement.style.justifyContent = 'center';
      cardElement.style.fontSize = '2em';
      cardElement.style.cursor = 'pointer';
      cardElement.style.transformStyle = 'preserve-3d';
      cardElement.style.transition = 'transform 0.3s';
      cardElement.setAttribute('data-index', index);
      
      const cardInner = document.createElement('div');
      cardInner.style.width = '100%';
      cardInner.style.height = '100%';
      cardInner.style.position = 'relative';
      cardInner.style.transformStyle = 'preserve-3d';
      cardInner.style.transition = 'transform 0.6s';
      
      const cardFront = document.createElement('div');
      cardFront.className = 'card-front';
      cardFront.style.position = 'absolute';
      cardFront.style.width = '100%';
      cardFront.style.height = '100%';
      cardFront.style.backfaceVisibility = 'hidden';
      cardFront.style.backgroundColor = '#3498db';
      cardFront.style.borderRadius = '5px';
      cardFront.style.display = 'flex';
      cardFront.style.alignItems = 'center';
      cardFront.style.justifyContent = 'center';
      cardFront.innerHTML = '?';
      
      const cardBack = document.createElement('div');
      cardBack.className = 'card-back';
      cardBack.style.position = 'absolute';
      cardBack.style.width = '100%';
      cardBack.style.height = '100%';
      cardBack.style.backfaceVisibility = 'hidden';
      cardBack.style.transform = 'rotateY(180deg)';
      cardBack.style.backgroundColor = '#ecf0f1';
      cardBack.style.borderRadius = '5px';
      cardBack.style.display = 'flex';
      cardBack.style.alignItems = 'center';
      cardBack.style.justifyContent = 'center';
      cardBack.textContent = card.symbol;
      
      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);
      cardElement.appendChild(cardInner);
      
      cardElement.addEventListener('click', () => flipCard(cardElement, index));
      board.appendChild(cardElement);
    });
    
    gameWrapper.appendChild(board);
    
    const restartButton = document.createElement('button');
    restartButton.textContent = 'Restart Game';
    restartButton.style.marginTop = '20px';
    restartButton.style.padding = '10px 20px';
    restartButton.style.fontSize = '1em';
    restartButton.addEventListener('click', () => resetGame(container));
    gameWrapper.appendChild(restartButton);
    
    container.appendChild(gameWrapper);
  }

  function initializeCards() {
    // Take first 8 symbols and duplicate them
    const gameSymbols = [...symbols.slice(0, 8), ...symbols.slice(0, 8)];
    
    // Shuffle the cards
    cards = gameSymbols
      .map(symbol => ({ symbol }))
      .sort(() => Math.random() - 0.5);
    
    flippedCards = [];
    matchedPairs = 0;
    attempts = 0;
    lockBoard = false;
    
    updateStats();
  }

  function flipCard(cardElement, index) {
    if (lockBoard) return;
    if (flippedCards.length === 2) return;
    if (cardElement.classList.contains('flipped')) return;
    
    cardElement.style.transform = 'rotateY(180deg)';
    cardElement.classList.add('flipped');
    flippedCards.push({element: cardElement, index});
    
    if (flippedCards.length === 2) {
      lockBoard = true;
      attempts++;
      updateStats();
      
      const [firstCard, secondCard] = flippedCards;
      const isFirstMatch = cards[firstCard.index].symbol === cards[secondCard.index].symbol;
      
      if (isFirstMatch) {
        matchedPairs++;
        updateStats();
        flippedCards = [];
        lockBoard = false;
        
        if (matchedPairs === 8) {
          setTimeout(() => {
            alert(`Congratulations! You won in ${attempts} attempts!`);
          }, 500);
        }
      } else {
        setTimeout(() => {
          firstCard.element.style.transform = '';
          firstCard.element.classList.remove('flipped');
          secondCard.element.style.transform = '';
          secondCard.element.classList.remove('flipped');
          flippedCards = [];
          lockBoard = false;
        }, 1000);
      }
    }
  }

  function updateStats() {
    const attemptsEl = document.getElementById('attempts');
    const matchesEl = document.getElementById('matches');
    
    if (attemptsEl) attemptsEl.textContent = `Attempts: ${attempts}`;
    if (matchesEl) matchesEl.textContent = `Matches: ${matchedPairs}/8`;
  }

  function resetGame(container) {
    container.querySelector('.memory-board').remove();
    if (document.getElementById('memory-stats')) {
      document.getElementById('memory-stats').remove();
    }
    
    // Remove restart button
    const buttons = container.querySelectorAll('button');
    buttons.forEach(button => button.remove());
    
    // Reinitialize the game
    createGameBoard(container);
  }

  window.startMemoryMatch = function(container) {
    container.innerHTML = '<h2 style="margin-bottom: 15px;">Memory Match</h2><p style="margin-bottom: 15px;">Find matching pairs of symbols. Flip two cards at a time to find matches!</p>';
    createGameBoard(container);
  };

  window.stopMemoryMatch = function() {
    // Cleanup if needed
  };
})();
