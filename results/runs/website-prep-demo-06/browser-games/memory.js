const board = document.getElementById('board');
const movesDisplay = document.getElementById('moves');
const winMessage = document.getElementById('winMessage');
const resetButton = document.getElementById('resetBtn');

let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let lockBoard = false;

const emojis = ['🍎', '🍌', '🍇', '🍓', '🍒', '🍑', '🍍', '🥝'];
const cardValues = [...emojis, ...emojis];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createBoard() {
  board.innerHTML = '';
  const shuffledCards = shuffle(cardValues);
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  movesDisplay.textContent = `Moves: ${moves}`;
  winMessage.style.display = 'none';
  lockBoard = false;

  shuffledCards.forEach((value, idx) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.value = value;
    card.dataset.index = idx;
    card.innerHTML = '<div class="card-back">?</div><div class="card-front">' + value + '</div>';
    card.addEventListener('click', flipCard);
    board.appendChild(card);
  });
}

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

function checkForMatch() {
  const card1 = flippedCards[0];
  const card2 = flippedCards[1];
  const isMatch = card1.dataset.value === card2.dataset.value;

  if (isMatch) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedPairs++;
    flippedCards = [];
    lockBoard = false;
    if (matchedPairs === emojis.length) {
      winMessage.textContent = `You won in ${moves} moves!`;
      winMessage.style.display = 'block';
    }
  } else {
    setTimeout(() => {
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
      flippedCards = [];
      lockBoard = false;
    }, 1000);
  }
}

function resetGame() {
  createBoard();
}

resetButton.addEventListener('click', resetGame);
createBoard();
