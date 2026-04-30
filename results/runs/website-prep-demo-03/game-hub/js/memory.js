// Memory Match Game Logic
const grid = document.getElementById('memoryGrid');
const timerDisplay = document.getElementById('timer');
const movesDisplay = document.getElementById('moves');
const restartButton = document.getElementById('restartButton');

const symbols = ['🍎', '🍌', '🍒', '🍇', '🍊', '🍓', '🍑', '🍍'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer = 0;
let timerInterval;
let gameStarted = false;

function initializeGame() {
  // Reset game state
  clearInterval(timerInterval);
  grid.innerHTML = '';
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  timer = 0;
  gameStarted = false;
  
  // Update displays
  timerDisplay.textContent = timer;
  movesDisplay.textContent = moves;
  
  // Create card pairs
  cards = [...symbols, ...symbols];
  shuffleArray(cards);
  
  // Create card elements
  cards.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    card.innerHTML = '<div class="card-front">?</div><div class="card-back">' + symbol + '</div>';
    card.addEventListener('click', flipCard);
    grid.appendChild(card);
  });
}

function flipCard() {
  // Start timer on first click
  if (!gameStarted) {
    startTimer();
    gameStarted = true;
  }
  
  // Prevent flipping if already flipped or matched
  if (this.classList.contains('flipped') || this.classList.contains('matched') || flippedCards.length === 2) return;
  
  // Flip card
  this.classList.add('flipped');
  flippedCards.push(this);
  
  // Check for match when two cards are flipped
  if (flippedCards.length === 2) {
    moves++;
    movesDisplay.textContent = moves;
    
    const [card1, card2] = flippedCards;
    const symbol1 = card1.querySelector('.card-back').textContent;
    const symbol2 = card2.querySelector('.card-back').textContent;
    
    if (symbol1 === symbol2) {
      // Match found
      card1.classList.add('matched');
      card2.classList.add('matched');
      flippedCards = [];
      matchedPairs++;
      
      // Check for win
      if (matchedPairs === symbols.length) {
        clearInterval(timerInterval);
        setTimeout(() => {
          alert(`Congratulations! You won in ${timer} seconds with ${moves} moves.`);
        }, 500);
      }
    } else {
      // No match - flip back after delay
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flippedCards = [];
      }, 1000);
    }
  }
}

function startTimer() {
  timerInterval = setInterval(() => {
    timer++;
    timerDisplay.textContent = timer;
  }, 1000);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Initialize game on load
initializeGame();

// Restart button event listener
restartButton.addEventListener('click', initializeGame);
