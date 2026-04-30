(function() {
  let cards = [], flippedCards = [], matchedPairs = 0, moves = 0;
  const symbols = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍑', '🍓', '🍉'];
  
  function init() {
    const grid = document.getElementById('card-grid');
    grid.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    updateMoves();
    
    // Create pairs
    let cardValues = [...symbols, ...symbols];
    shuffleArray(cardValues);
    
    cardValues.forEach((symbol, index) => {
      const card = document.createElement('div');
      card.className = 'card';
      card.dataset.value = symbol;
      card.dataset.index = index;
      card.innerHTML = '<div class="card-inner"><div class="card-front">?</div><div class="card-back">' + symbol + '</div></div>';
      card.addEventListener('click', flipCard);
      grid.appendChild(card);
      cards.push(card);
    });
  }
  
  function flipCard() {
    if (flippedCards.length === 2 || this.classList.contains('flipped') || this.classList.contains('matched')) {
      return;
    }
    
    this.classList.add('flipped');
    flippedCards.push(this);
    
    if (flippedCards.length === 2) {
      moves++;
      updateMoves();
      setTimeout(checkMatch, 500);
    }
  }
  
  function checkMatch() {
    const [card1, card2] = flippedCards;
    if (card1.dataset.value === card2.dataset.value) {
      card1.classList.add('matched');
      card2.classList.add('matched');
      matchedPairs++;
      if (matchedPairs === symbols.length) {
        setTimeout(() => alert(`Congratulations! You completed the game in ${moves} moves.`), 500);
      }
    } else {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
    }
    flippedCards = [];
  }
  
  function updateMoves() {
    document.getElementById('moves').textContent = `Moves: ${moves}`;
  }
  
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }
  
  // Initialize game when page loads
  window.onload = init;
})();
