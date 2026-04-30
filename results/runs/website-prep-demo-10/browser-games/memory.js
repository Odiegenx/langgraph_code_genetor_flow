// Game symbols (8 pairs)
const symbols = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍓', '🍑', '🥝'];

// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let lockBoard = false;

// DOM elements
const boardElement = document.getElementById('memory-board');
const movesElement = document.getElementById('memory-moves');
const winMessageElement = document.getElementById('memory-win-message');
const resetButton = document.getElementById('memory-reset');

// Initialize game
function init() {
  resetGame();
  resetButton.addEventListener('click', resetGame);
}

// Reset game
function resetGame() {
  // Reset game state
  cards = [];
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  lockBoard = false;
  
  // Update UI
  movesElement.textContent = moves;
  winMessageElement.textContent = '';
  
  // Create cards
  createCards();
  
  // Shuffle cards
  shuffleCards();
  
  // Render cards
  renderCards();
}

// Create cards array
function createCards() {
  cards = [];
  // Create two of each symbol
  symbols.forEach(symbol => {
    cards.push({symbol, matched: false});
    cards.push({symbol, matched: false});
  });
}

// Shuffle cards using Fisher-Yates algorithm
function shuffleCards() {
  for (let i = cards.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[randomIndex]] = [cards[randomIndex], cards[i]];
  }
}

// Render cards
function renderCards() {
  boardElement.innerHTML = '';
  cards.forEach((card, index) => {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.dataset.index = index;
    
    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');
    
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    cardFront.textContent = '?';
    
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.textContent = card.symbol;
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    cardElement.appendChild(cardInner);
    
    cardElement.addEventListener('click', () => flipCard(cardElement, index));
    boardElement.appendChild(cardElement);
  });
}

// Flip card
function flipCard(cardElement, index) {
  const card = cards[index];
  
  // If board is locked, card is already flipped, or card is matched, ignore
  if (lockBoard || flippedCards.length === 2 || cardElement.classList.contains('flipped') || card.matched) {
    return;
  }
  
  // Flip the card
  cardElement.classList.add('flipped');
  flippedCards.push({element: cardElement, index});
  
  // If two cards are flipped, check for match
  if (flippedCards.length === 2) {
    lockBoard = true;
    moves++;
    movesElement.textContent = moves;
    
    const firstCard = cards[flippedCards[0].index];
    const secondCard = cards[flippedCards[1].index];
    
    if (firstCard.symbol === secondCard.symbol) {
      // Match found
      firstCard.matched = true;
      secondCard.matched = true;
      matchedPairs++;
      
      // Check for win
      if (matchedPairs === symbols.length) {
        winMessageElement.textContent = `You won in ${moves} moves!`;
      }
      
      // Reset flipped cards and unlock board
      flippedCards = [];
      lockBoard = false;
    } else {
      // No match - flip cards back after delay
      setTimeout(() => {
        flippedCards.forEach(cardObj => {
          cardObj.element.classList.remove('flipped');
        });
        flippedCards = [];
        lockBoard = false;
      }, 1000);
    }
  }
}

// Initialize game when page loads
window.onload = init;
