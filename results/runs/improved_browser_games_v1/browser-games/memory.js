// Memory Game Implementation

let selectedSet = '';
let difficulty = 0; // Number of pairs
let startTime;
let moves = 0;
let timerInterval;
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;

const pictureSets = {
  fruits: ['🍎', '🍌', '🍒', '🍇', '🍓', '🍑', '🍍', '🥝', '🥭', '🥥', '🍉', '🍋', '🍊', '🍐', '🥑', '🥦', '🥬', '🥒', '🌽', '🥕', '🧄', '🧅', '🥔', '🍠'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🐦', '🐤', '🦆', '🦅', '🦉', '🦇', '🐺']
};

function startGame(set) {
  selectedSet = set;
  document.querySelectorAll('.options button').forEach(btn => btn.classList.remove('selected'));
  event.target.classList.add('selected');
  checkStartButton();
}

function setDifficulty(pairs) {
  difficulty = pairs;
  document.querySelectorAll('.options button').forEach(btn => btn.classList.remove('selected'));
  event.target.classList.add('selected');
  checkStartButton();
}

function checkStartButton() {
  const startButton = document.getElementById('startButton');
  if (selectedSet && difficulty > 0) {
    startButton.disabled = false;
  } else {
    startButton.disabled = true;
  }
}

function initGame() {
  // Hide setup screen and show game area
  document.getElementById('setupScreen').style.display = 'none';
  document.getElementById('gameArea').style.display = 'block';
  
  // Reset game state
  moves = 0;
  matchedPairs = 0;
  flippedCards = [];
  canFlip = true;
  document.getElementById('moves').textContent = moves;
  
  // Get emojis for the selected set
  const emojis = [...pictureSets[selectedSet]];
  
  // Shuffle and take required number of pairs
  shuffleArray(emojis);
  const gameEmojis = emojis.slice(0, difficulty);
  const cardValues = [...gameEmojis, ...gameEmojis];
  shuffleArray(cardValues);
  
  // Create card grid
  const cardGrid = document.getElementById('cardGrid');
  cardGrid.innerHTML = '';
  
  // Calculate grid columns based on difficulty
  let columns;
  if (difficulty <= 6) columns = 4;
  else if (difficulty <= 12) columns = 6;
  else columns = 8;
  
  cardGrid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  
  cardValues.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-inner">
        <div class="card-front">?</div>
        <div class="card-back">${emoji}</div>
      </div>
    `;
    card.dataset.value = emoji;
    card.addEventListener('click', flipCard);
    cardGrid.appendChild(card);
  });
  
  // Start timer
  startTime = new Date();
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
  updateTimer();
  
  // Load high score
  const highScoreKey = `memory_highscore_${difficulty*2}`;
  const highScore = StorageUtil.load(highScoreKey, null);
  document.getElementById('highScore').textContent = highScore ? formatScore(highScore) : '-';
}

function flipCard() {
  if (!canFlip) return;
  if (this.classList.contains('flipped') || this.classList.contains('matched')) return;
  if (flippedCards.length >= 2) return;
  
  this.classList.add('flipped');
  flippedCards.push(this);
  
  if (flippedCards.length === 2) {
    canFlip = false;
    moves++;
    document.getElementById('moves').textContent = moves;
    
    const card1 = flippedCards[0];
    const card2 = flippedCards[1];
    
    if (card1.dataset.value === card2.dataset.value) {
      // Match found
      setTimeout(() => {
        card1.classList.add('matched');
        card2.classList.add('matched');
        flippedCards = [];
        matchedPairs++;
        
        if (matchedPairs === difficulty) {
          endGame();
        }
        canFlip = true;
      }, 500);
    } else {
      // No match
      setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        flippedCards = [];
        canFlip = true;
      }, 1000);
    }
  }
}

function updateTimer() {
  const now = new Date();
  const elapsed = Math.floor((now - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const seconds = (elapsed % 60).toString().padStart(2, '0');
  document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function endGame() {
  clearInterval(timerInterval);
  
  // Calculate time taken
  const endTime = new Date();
  const timeTaken = Math.floor((endTime - startTime) / 1000);
  const minutes = Math.floor(timeTaken / 60);
  const seconds = timeTaken % 60;
  
  // Calculate score: lower time and moves are better
  // Score = 10000 - (timeInSeconds * 10) - (moves * 50)
  const score = Math.max(0, 10000 - (timeTaken * 10) - (moves * 50));
  
  // Update UI
  document.getElementById('completionTime').textContent = 
    `${minutes} minute${minutes !== 1 ? 's' : ''} and ${seconds} second${seconds !== 1 ? 's' : ''}`;
  document.getElementById('completionMoves').textContent = moves;
  document.getElementById('finalScoreDisplay').textContent = score;
  
  // Check and update high score
  const highScoreKey = `memory_highscore_${difficulty*2}`;
  const currentHighScore = StorageUtil.load(highScoreKey, 0);
  document.getElementById('currentHighScore').textContent = currentHighScore;
  
  if (score > currentHighScore) {
    StorageUtil.save(highScoreKey, score);
    document.getElementById('currentHighScore').textContent = `${score} (New High Score!)`;
  }
  
  // Show completion modal
  document.getElementById('completionModal').style.display = 'block';
}

function resetGame() {
  document.getElementById('completionModal').style.display = 'none';
  document.getElementById('setupScreen').style.display = 'block';
  document.getElementById('gameArea').style.display = 'none';
  clearInterval(timerInterval);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function formatScore(score) {
  return score.toLocaleString();
}
