// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let lockBoard = false;

// DOM Elements
const board = document.getElementById('board');
const movesDisplay = document.getElementById('moves');
const matchesDisplay = document.getElementById('matches');
const restartButton = document.getElementById('restart-button');

// Card values (8 pairs)
const cardValues = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍑', '🍓', '🥝'];

// Initialize game
function initGame() {
  // Reset game state
  cards = [];
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  lockBoard = false;
  
  // Update displays
  movesDisplay.textContent = moves;
  matchesDisplay.textContent = matchedPairs;
  
  // Clear board
  board.innerHTML = '';
  
  // Create card pairs
  let gameCards = [...cardValues, ...cardValues];
  
  // Shuffle cards
  gameCards = shuffleArray(gameCards);
  
  // Create card elements
  gameCards.forEach((value, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;
    
    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');
    
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    cardFront.textContent = '?';
    
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.textContent = value;
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    board.appendChild(card);
    
    card.addEventListener('click', flipCard);
    cards.push(card);
  });
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Flip card
function flipCard() {
  if (lockBoard) return;
  if (this === flippedCards[0]) return;
  
  this.classList.add('flipped');
  
  if (flippedCards.length === 0) {
    // First card flipped
    flippedCards.push(this);
    return;
  }
  
  // Second card flipped
  flippedCards.push(this);
  moves++;
  movesDisplay.textContent = moves;
  
  checkForMatch();
}

// Check for match
function checkForMatch() {
  const [firstCard, secondCard] = flippedCards;
  const isMatch = firstCard.dataset.value === secondCard.dataset.value;
  
  if (isMatch) {
    disableCards();
    matchedPairs++;
    matchesDisplay.textContent = matchedPairs;
    
    if (matchedPairs === cardValues.length) {
      setTimeout(() => {
        alert(`Congratulations! You won in ${moves} moves.`);
      }, 500);
    }
  } else {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove('flipped');
      secondCard.classList.remove('flipped');
      lockBoard = false;
    }, 1000);
  }
  
  flippedCards = [];
}

// Disable matched cards
function disableCards() {
  flippedCards.forEach(card => {
    card.removeEventListener('click', flipCard);
  });
}

// Event listener
restartButton.addEventListener('click', initGame);

// Initialize game on load
initGame();
