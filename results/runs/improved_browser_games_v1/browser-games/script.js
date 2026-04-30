// Shared utility functions

// Navigation helper - goes back to home page
function goHome() {
  window.location.href = 'index.html';
}

// LocalStorage utilities
const StorageUtil = {
  // Save an item to localStorage
  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
      return false;
    }
  },

  // Load an item from localStorage
  load(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
      return defaultValue;
    }
  },

  // Remove an item from localStorage
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error('Failed to remove from localStorage:', e);
      return false;
    }
  }
};

// Utility to generate random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Export for use in modules if needed
window.StorageUtil = StorageUtil;
window.getRandomInt = getRandomInt;
