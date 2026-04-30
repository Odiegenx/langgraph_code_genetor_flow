(function() {
  const memoryBoard = document.querySelector('.memory-board');
  const cards = document.querySelectorAll('.memory-card');
  const movesDisplay = document.getElementById('moves');
  const restartBtn = document.getElementById('restart-btn');
  
  let flippedCards = [];
  let lockBoard = false;
  let moves = 0;
  let matchedPairs = 0;
  
  function initializeGame() {
    moves = 0;
    matchedPairs = 0;
    movesDisplay.textContent = moves;
    
    // Reset cards
    cards.forEach(card => {
      card.classList.remove('flipped', 'matched');
    });
    
    // Shuffle cards
    const cardsArray = Array.from(cards);
    for (let i = cardsArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
    }
    
    memoryBoard.innerHTML = '';
    cardsArray.forEach(card => {
      memoryBoard.appendChild(card);
    });
    
    // Add event listeners
    cards.forEach(card => {
      card.addEventListener('click', flipCard);
    });
  }
  
  function flipCard() {
    if (lockBoard) return;
    if (this === flippedCards[0]) return;
    if (this.classList.contains('matched')) return;
    
    this.classList.add('flipped');
    
    if (flippedCards.length === 0) {
      flippedCards.push(this);
      return;
    }
    
    flippedCards.push(this);
    lockBoard = true;
    
    checkForMatch();
  }
  
  function checkForMatch() {
    const isMatch = flippedCards[0].dataset.card === flippedCards[1].dataset.card;
    
    if (isMatch) {
      disableCards();
      matchedPairs++;
      moves++;
      movesDisplay.textContent = moves;
      
      if (matchedPairs === 8) {
        setTimeout(() => {
          alert(`Congratulations! You won in ${moves} moves!`);
        }, 500);
      }
      
      lockBoard = false;
      flippedCards = [];
    } else {
      moves++;
      movesDisplay.textContent = moves;
      
      setTimeout(() => {
        flippedCards.forEach(card => card.classList.remove('flipped'));
        lockBoard = false;
        flippedCards = [];
      }, 1000);
    }
  }
  
  function disableCards() {
    flippedCards.forEach(card => {
      card.classList.add('matched');
      card.removeEventListener('click', flipCard);
    });
  }
  
  // Initialize the game
  initializeGame();
  
  // Restart button
  restartBtn.addEventListener('click', initializeGame);
})();
