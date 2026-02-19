/**
 * Utility Functions
 * Helper functions used throughout the application
 */

/**
 * Load player data from JSON file
 * @returns {Promise<Array>} Array of player objects
 */
export async function loadPlayerData() {
    try {
        const response = await fetch('./src/data/players.json');
        const data = await response.json();
        return data.players;
    } catch (error) {
        console.error('Error loading player data:', error);
        return [];
    }
}

/**
 * Shuffle an array using Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} Shuffled array
 */
export function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

/**
 * Get a random subset of items from an array
 * @param {Array} array - Source array
 * @param {number} count - Number of items to select
 * @returns {Array} Random subset
 */
export function getRandomSubset(array, count) {
    return shuffleArray(array).slice(0, count);
}

/**
 * Clear all child elements from a DOM element
 * @param {HTMLElement} element - Element to clear
 */
export function clearElement(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}

/**
 * Trigger haptic feedback on mobile devices
 * @param {number} duration - Vibration duration in milliseconds
 */
export function vibrate(duration = 50) {
    if (navigator.vibrate) {
        navigator.vibrate(duration);
    }
}

/**
 * Filter players with 2 or fewer teams (for testing mode)
 * @param {Array} players - Array of player objects
 * @returns {Array} Filtered players
 */
export function getTestingPlayers(players) {
    return players.filter(player => player.teams.length <= 2);
}
