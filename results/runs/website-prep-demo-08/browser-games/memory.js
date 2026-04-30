// Symbols for the cards (8 pairs)
const symbols = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍑', '🍓', '🍉'];

// Duplicate symbols to create pairs
let cardsArray = [...symbols, ...symbols];

// Game state
let moves = 0;
let flippedCards = [];
const matchedCards = new Set();
let lockBoard = false;

// DOM elements
const board = document.getElementById('board');
const movesDisplay = document.getElementById('moves');
const winMessage = document.getElementById('winMessage');

// Shuffle function using Fisher-Yates algorithm
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Initialize the game
function initGame() {
  // Reset game state
  moves = 0;
  flippedCards = [];
  matchedCards.clear();
  lockBoard = false;
  movesDisplay.textContent = `Moves: ${moves}`;
  winMessage.classList.add('hidden');
  
  // Clear the board
  board.innerHTML = '';
  
  // Shuffle cards
  cardsArray = shuffle([...symbols, ...symbols]);
  
  // Create card elements
  cardsArray.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    
    const cardInner = document.createElement('div');
    cardInner.className = 'card-inner';
    
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    cardFront.textContent = '?';
    
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.textContent = symbol;
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

// Flip card function
function flipCard() {
  if (lockBoard) return;
  if (this === flippedCards[0]) return;
  if (this.classList.contains('matched')) return;
  
  this.classList.add('flipped');
  flippedCards.push(this);
  
  if (flippedCards.length === 2) {
    lockBoard = true;
    moves++;
    movesDisplay.textContent = `Moves: ${moves}`;
    checkForMatch();
  }
}

// Check if flipped cards match
function checkForMatch() {
  const card1 = flippedCards[0];
  const card2 = flippedCards[1];
  
  const isMatch = 
    cardsArray[parseInt(card1.dataset.index)] === 
    cardsArray[parseInt(card2.dataset.index)];
  
  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

// Disable matched cards
function disableCards() {
  flippedCards.forEach(card => {
    card.classList.remove('flipped');
    card.classList.add('matched');
    matchedCards.add(card);
  });
  
  flippedCards = [];
  lockBoard = false;
  
  // Check for win
  if (matchedCards.size === cardsArray.length) {
    setTimeout(() => {
      winMessage.classList.remove('hidden');
    }, 500);
  }
}

// Unflip mismatched cards
function unflipCards() {
  setTimeout(() => {
    flippedCards.forEach(card => card.classList.remove('flipped'));
    flippedCards = [];
    lockBoard = false;
  }, 1000);
}

// Start the game when loaded
window.onload = initGame;
