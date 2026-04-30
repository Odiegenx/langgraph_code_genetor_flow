// Memory Match game logic
const gameBoard = document.getElementById('game-board');
const movesDisplay = document.getElementById('moves');
let moves = 0;
let flippedCards = [];
let matchedPairs = 0;
const symbols = ['🍎','🍌','🍒','🍇','🍊','🍑','🍓','🍉'];
let cards = [...symbols, ...symbols];

cards.sort(() => 0.5 - Math.random());

gameBoard.innerHTML = '';
moves = 0;
movesDisplay.innerText = moves;
flippedCards = [];
matchedPairs = 0;

cards.forEach((symbol, index) => {
  const card = document.createElement('div');
  card.classList.add('card');
  card.setAttribute('data-symbol', symbol);
  card.innerText = '?';
  card.addEventListener('click', flipCard);
  gameBoard.appendChild(card);
});

function flipCard() {
  if (flippedCards.length === 2 || this.classList.contains('flipped')) return;
  this.classList.add('flipped');
  this.innerText = this.getAttribute('data-symbol');
  flippedCards.push(this);
  
  if (flippedCards.length === 2) {
    moves++;
    movesDisplay.innerText = moves;
    setTimeout(checkMatch, 500);
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  const isMatch = card1.getAttribute('data-symbol') === card2.getAttribute('data-symbol');
  
  if (isMatch) {
    matchedPairs++;
    flippedCards = [];
    if (matchedPairs === symbols.length) {
      alert(`You won in ${moves} moves!`);
    }
  } else {
    card1.classList.remove('flipped');
    card2.classList.remove('flipped');
    card1.innerText = '?';
    card2.innerText = '?';
    flippedCards = [];
  }
}
