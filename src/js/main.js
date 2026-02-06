/**
 * Main Application Entry Point
 * Initializes the game and sets up event listeners
 */

import { players } from './game-state.js';
import { setPlayers, setHardMode } from './game-state.js';
import { loadPlayerData } from './utils.js';
import {
    displayPlayers,
    displayPlayersWithoutRefresh,
    displayTeams,
    clearDropZones,
    clearAllDropZones,
    initializeModal,
    hideModal
} from './ui-controller.js';
import { checkPlacements, resetStrikes, enableSubmitButton } from './game-logic.js';
import { setupScrollHandling } from './drag-drop.js';

/**
 * Initialize the application
 */
async function initialize() {
    console.log('Initializing Roster Relay...');
    
    // Load player data
    const loadedPlayers = await loadPlayerData();
    setPlayers(loadedPlayers);
    console.log('Players loaded successfully:', loadedPlayers.length, 'players');
    
    // Display initial game state
    displayPlayers(players);
    displayTeams();
    setupScrollHandling();
    
    // Initialize modal
    initializeModal();
    
    // Setup all event listeners
    setupEventListeners();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Hard mode toggle
    document.getElementById('hardModeToggle').addEventListener('change', handleHardModeToggle);
    
    // Button event listeners
    document.getElementById('newPlayersButton').addEventListener('click', handleNewPlayers);
    document.getElementById('clearButton').addEventListener('click', handleClear);
    document.getElementById('restartButton').addEventListener('click', handleRestart);
    document.getElementById('submitButton').addEventListener('click', handleSubmit);
    
    // Modal button event listeners
    document.getElementById('modalNewPlayersButton').addEventListener('click', handleModalNewPlayers);
    document.getElementById('modalRestartButton').addEventListener('click', handleModalRestart);
}

/**
 * Handle hard mode toggle
 */
function handleHardModeToggle(e) {
    setHardMode(e.target.checked);
    
    // Clear all drop zones
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach((zone) => {
        const placedTeams = zone.querySelectorAll('.placed-team');
        placedTeams.forEach(team => {
            team.classList.remove('correct-team', 'incorrect-team', 'misplaced-team');
        });
        while (zone.firstChild) {
            zone.removeChild(zone.firstChild);
        }
        zone.classList.remove('correct', 'incorrect', 'misplaced', 'filled', 'drag-over');
    });
    
    // Redisplay the same players in the new mode
    displayPlayersWithoutRefresh();
}

/**
 * Handle "Get New Players" button
 */
function handleNewPlayers() {
    resetStrikes();
    enableSubmitButton();
    displayPlayers(players);
}

/**
 * Handle "Clear" button - clears everything except correct answers
 */
function handleClear() {
    clearDropZones();
}

/**
 * Handle "Restart" button - clears board and strikes, keeps same players
 */
function handleRestart() {
    resetStrikes();
    enableSubmitButton();
    clearAllDropZones();
}

/**
 * Handle "Submit" button
 */
function handleSubmit() {
    checkPlacements();
}

/**
 * Handle "Get New Players" button in modal
 */
function handleModalNewPlayers() {
    hideModal();
    resetStrikes();
    enableSubmitButton();
    displayPlayers(players);
}

/**
 * Handle "Restart" button in modal
 */
function handleModalRestart() {
    hideModal();
    resetStrikes();
    enableSubmitButton();
    clearAllDropZones();
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', initialize);
