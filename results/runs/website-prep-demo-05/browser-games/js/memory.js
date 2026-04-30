const board = document.getElementById('board');
const moveCountElement = document.getElementById('moveCount');
const resetButton = document.getElementById('resetBtn');

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moveCount = 0;
let lockBoard = false;

const symbols = ['★', '★', '❤', '❤', '♫', '♫', '☀', '☀', '♛', '♛', '✿', '✿', '⚡', '⚡', '✉', '✉'];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard() {
  board.innerHTML = '';
  const shuffledSymbols = shuffle([...symbols]);
  
  shuffledSymbols.forEach((symbol, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.symbol = symbol;
    
    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');
    
    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    cardFront.textContent = '?';
    
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.textContent = symbol;
    
    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);
    
    card.addEventListener('click', flipCard);
    board.appendChild(card);
    cards.push(card);
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this === flippedCards[0]) return;
  
  this.classList.add('flipped');
  
  if (!flippedCards[0]) {
    flippedCards[0] = this;
    return;
  }
  
  flippedCards[1] = this;
  moveCount++;
  moveCountElement.textContent = moveCount;
  
  checkForMatch();
}

function checkForMatch() {
  const isMatch = flippedCards[0].dataset.symbol === flippedCards[1].dataset.symbol;
  
  if (isMatch) {
    disableCards();
    matchedPairs++;
    
    if (matchedPairs === symbols.length / 2) {
      setTimeout(() => {
        alert(`Congratulations! You won in ${moveCount} moves.`);
      }, 500);
    }
  } else {
    unflipCards();
  }
}

function disableCards() {
  flippedCards[0].removeEventListener('click', flipCard);
  flippedCards[1].removeEventListener('click', flipCard);
  resetFlippedCards();
}

function unflipCards() {
  lockBoard = true;
  
  setTimeout(() => {
    flippedCards[0].classList.remove('flipped');
    flippedCards[1].classList.remove('flipped');
    resetFlippedCards();
  }, 1000);
}

function resetFlippedCards() {
  [flippedCards[0], flippedCards[1]] = [null, null];
  lockBoard = false;
}

function resetGame() {
  cards = [];
  flippedCards = [];
  matchedPairs = 0;
  moveCount = 0;
  lockBoard = false;
  moveCountElement.textContent = moveCount;
  createBoard();
}

createBoard();
resetButton.addEventListener('click', resetGame);
