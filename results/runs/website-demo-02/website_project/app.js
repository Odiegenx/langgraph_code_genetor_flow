// App State
let currentGame = null;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameContainer = document.getElementById('game-container');
const gameArea = document.getElementById('game-area');
const backButton = document.getElementById('back-button');

// Game Start Handlers
function showGame(gameType) {
  // Hide start screen and show game container
  startScreen.classList.add('hidden');
  gameContainer.classList.remove('hidden');

  // Clear previous game
  gameArea.innerHTML = '';
  currentGame = gameType;

  // Initialize selected game
  switch (gameType) {
    case 'snake':
      if (typeof window.startSnakeGame === 'function') {
        window.startSnakeGame(gameArea);
      }
      break;
    case 'tic-tac-toe':
      if (typeof window.startTicTacToe === 'function') {
        window.startTicTacToe(gameArea);
      }
      break;
    case 'memory-match':
      if (typeof window.startMemoryMatch === 'function') {
        window.startMemoryMatch(gameArea);
      }
      break;
    default:
      gameArea.innerHTML = '<p>Game not found.</p>';
  }
}

// Event Listeners
document.querySelectorAll('.game-card').forEach(card => {
  card.addEventListener('click', () => {
    const gameType = card.getAttribute('data-game');
    showGame(gameType);
  });
});

backButton.addEventListener('click', () => {
  // Hide game container and show start screen
  gameContainer.classList.add('hidden');
  startScreen.classList.remove('hidden');

  // Cleanup if needed
  if (currentGame === 'snake' && typeof window.stopSnakeGame === 'function') {
    window.stopSnakeGame();
  } else if (currentGame === 'tic-tac-toe' && typeof window.stopTicTacToe === 'function') {
    window.stopTicTacToe();
  } else if (currentGame === 'memory-match' && typeof window.stopMemoryMatch === 'function') {
    window.stopMemoryMatch();
  }

  currentGame = null;
});
