/**
 * UI Controller
 * Handles all DOM manipulation and UI updates
 */

import { teams, currentPlayers, hardMode } from './game-state.js';
import { setCurrentPlayers } from './game-state.js';
import { getRandomSubset, clearElement } from './utils.js';
import {
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDropHardMode,
    handlePlacedTeamDragStart,
    handlePlacedTeamDragEnd,
    handleTeamListDragOver,
    handleTeamListDragLeave,
    handleTeamListDrop,
    handleTouchStart,
    handlePlacedTeamTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleTouchCancel
} from './drag-drop.js';

/**
 * Display random players on the game board
 */
export function displayPlayers(players) {
    const container = document.getElementById('playerContainer');
    clearElement(container);
    
    // Get five random players
    const selectedPlayers = getRandomSubset(players, 5);
    setCurrentPlayers(selectedPlayers);

    renderPlayerRows(selectedPlayers, container);
}

/**
 * Display players without refreshing (keeps current players)
 */
export function displayPlayersWithoutRefresh() {
    const container = document.getElementById('playerContainer');
    clearElement(container);
    
    renderPlayerRows(currentPlayers, container);
}

/**
 * Render player rows in the container
 */
function renderPlayerRows(playersList, container) {
    playersList.forEach(player => {
        const playerRow = document.createElement('div');
        playerRow.className = 'player-row';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'player-name';
        nameDiv.textContent = player.name;
        
        const dropZonesDiv = document.createElement('div');
        dropZonesDiv.className = 'drop-zone-container';
        dropZonesDiv.dataset.playerName = player.name;
        dropZonesDiv.dataset.teamCount = player.teams.length;
        
        if (hardMode) {
            createHardModeDropZone(dropZonesDiv, player.name);
        } else {
            createNormalModeDropZones(dropZonesDiv, player);
        }
        
        playerRow.appendChild(nameDiv);
        playerRow.appendChild(dropZonesDiv);
        container.appendChild(playerRow);
    });
}

/**
 * Create drop zones for normal mode
 */
function createNormalModeDropZones(container, player) {
    player.teams.forEach(() => {
        const dropZone = document.createElement('div');
        dropZone.className = 'drop-zone';
        dropZone.dataset.playerName = player.name;
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('dragleave', handleDragLeave);
        dropZone.addEventListener('drop', handleDrop);
        container.appendChild(dropZone);
    });
}

/**
 * Create drop zone for hard mode
 */
function createHardModeDropZone(container, playerName) {
    const dropZone = document.createElement('div');
    dropZone.className = 'drop-zone hard-mode-zone';
    dropZone.dataset.playerName = playerName;
    dropZone.addEventListener('dragover', handleDragOver);
    dropZone.addEventListener('dragleave', handleDragLeave);
    dropZone.addEventListener('drop', handleDropHardMode);
    container.appendChild(dropZone);
}

/**
 * Display all team logos in the team list
 */
export function displayTeams() {
    const teamList = document.getElementById("teamList");
    clearElement(teamList);
    
    // Setup team list as drop zone for removing teams
    teamList.addEventListener('dragover', handleTeamListDragOver);
    teamList.addEventListener('drop', handleTeamListDrop);
    teamList.addEventListener('dragleave', handleTeamListDragLeave);
    
    // Add touch listeners to document
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });
    document.addEventListener('touchcancel', handleTouchCancel, { passive: false });
    
    teams.forEach(team => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-item';
        teamDiv.draggable = true;

        const teamLogo = document.createElement('img');
        teamLogo.src = team.logo;
        teamLogo.alt = team.name;
        teamLogo.className = 'team-logo';
        teamLogo.draggable = true;

        // Add drag event listeners
        teamDiv.addEventListener('dragstart', handleDragStart);
        teamDiv.addEventListener('dragend', handleDragEnd);
        teamDiv.addEventListener('dragover', handleDragOver);
        
        // Add touch event listeners for mobile
        teamDiv.addEventListener('touchstart', handleTouchStart, { passive: false });
        
        // Propagate dragstart from the image to the parent div
        teamLogo.addEventListener('dragstart', e => {
            e.stopPropagation();
            teamDiv.dispatchEvent(new DragEvent('dragstart', e));
        });

        teamDiv.appendChild(teamLogo);
        teamList.appendChild(teamDiv);
    });
}

/**
 * Clear all drop zones except correct answers
 */
export function clearDropZones() {
    const dropZones = document.querySelectorAll('.drop-zone');
    
    dropZones.forEach((zone) => {
        const isCorrect = zone.classList.contains('correct');
        
        if (!isCorrect) {
            const placedTeams = zone.querySelectorAll('.placed-team');
            placedTeams.forEach(team => {
                team.classList.remove('correct-team', 'incorrect-team', 'misplaced-team');
            });
            
            clearElement(zone);
            zone.classList.remove('incorrect', 'misplaced', 'filled', 'drag-over');
            zone.textContent = "";
        }
    });
}

/**
 * Clear all drop zones including correct answers
 */
export function clearAllDropZones() {
    const dropZones = document.querySelectorAll('.drop-zone');
    
    dropZones.forEach((zone) => {
        const placedTeams = zone.querySelectorAll('.placed-team');
        placedTeams.forEach(team => {
            team.classList.remove('correct-team', 'incorrect-team', 'misplaced-team');
        });
        
        clearElement(zone);
        zone.classList.remove('correct', 'incorrect', 'misplaced', 'filled', 'drag-over');
        zone.textContent = "";
    });
}

// ==================== MODAL FUNCTIONS ====================

const modal = document.getElementById('congratulationsModal');
const closeButton = document.getElementById('closeModal');

/**
 * Show modal with message
 */
export function showModal(message, showButtons = false) {
    const modalMessage = document.getElementById('modalMessage');
    const modalButtons = document.getElementById('modalButtons');
    
    modalMessage.textContent = message;
    
    if (showButtons) {
        modalButtons.style.display = 'flex';
    } else {
        modalButtons.style.display = 'none';
    }
    
    modal.style.display = 'block';
}

/**
 * Hide modal
 */
export function hideModal() {
    modal.style.display = 'none';
}

/**
 * Initialize modal event listeners
 */
export function initializeModal() {
    closeButton.addEventListener('click', hideModal);
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            hideModal();
        }
    });
}
