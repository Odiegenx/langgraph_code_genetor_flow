// game-select.js - Handles hover effects and navigation for game cards
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
      // Add keyboard accessibility
      card.setAttribute('tabindex', '0');
      
      // Mouse and keyboard interaction handlers
      card.addEventListener('click', () => {
        const gamePath = card.getAttribute('data-game');
        if (gamePath) {
          window.location.href = gamePath;
        }
      });

      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const gamePath = card.getAttribute('data-game');
          if (gamePath) {
            window.location.href = gamePath;
          }
        }
      });
    });
  });
})();
