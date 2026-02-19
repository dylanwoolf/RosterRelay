/**
 * UI Controller
 * Handles all DOM manipulation and UI updates
 */

import { teams, currentPlayers, hardMode, testingMode } from './game-state.js';
import { setCurrentPlayers, markBoardChanged } from './game-state.js';
import { getRandomSubset, clearElement, getTestingPlayers } from './utils.js';
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
    
    // Filter players if in testing mode
    const availablePlayers = testingMode ? getTestingPlayers(players) : players;
    
    // Get five random players
    const selectedPlayers = getRandomSubset(availablePlayers, 5);
    setCurrentPlayers(selectedPlayers);

    renderPlayerRows(selectedPlayers, container);
    
    // Auto-fill correct answers in testing mode
    if (testingMode) {
        setTimeout(() => autoFillCorrectAnswers(), 100);
    }
}

/**
 * Display players without refreshing (keeps current players)
 */
export function displayPlayersWithoutRefresh() {
    const container = document.getElementById('playerContainer');
    clearElement(container);
    
    renderPlayerRows(currentPlayers, container);
    
    // Auto-fill correct answers in testing mode
    if (testingMode) {
        setTimeout(() => autoFillCorrectAnswers(), 100);
    }
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
            // Clear all validation and state classes
            zone.classList.remove('correct', 'incorrect', 'misplaced', 'filled', 'drag-over');
            zone.textContent = "";
        }
    });
    // Mark board as changed when clearing
    markBoardChanged();
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
    // Mark board as changed when clearing
    markBoardChanged();
}

// ==================== MODAL FUNCTIONS ====================

const modal = document.getElementById('congratulationsModal');
const closeButton = document.getElementById('closeModal');

/**
 * Show modal with message
 */
export function showModal(message, showButtons = false, shareText = null) {
    const modalMessage = document.getElementById('modalMessage');
    const modalButtons = document.getElementById('modalButtons');
    
    // Check if this is a success message
    const isSuccess = message.toLowerCase().includes('correct') || message.toLowerCase().includes('congratulations');
    
    // Always get share elements
    const shareDisplay = document.getElementById('shareDisplay');
    const shareTextElement = document.getElementById('shareText');
    const copyButton = document.getElementById('copyResultsButton');
    
    // Set the message with subtitle for success
    if (isSuccess) {
        modalMessage.innerHTML = message + '<span class="modal-subtitle">Perfect score! 🏆</span>';
    } else {
        modalMessage.textContent = message;
    }
    
    // Show share text if provided (for all end-game scenarios)
    if (shareText) {
        shareTextElement.textContent = shareText;
        shareDisplay.style.display = 'block';
        
        // Setup copy button
        copyButton.onclick = () => copyResults(shareText, copyButton);
    } else {
        shareDisplay.style.display = 'none';
    }
    
    if (showButtons) {
        modalButtons.style.display = 'flex';
    } else {
        modalButtons.style.display = 'none';
    }
    
    modal.style.display = 'block';
}

/**
 * Copy results to clipboard
 */
async function copyResults(text, button) {
    try {
        await navigator.clipboard.writeText(text);
        const originalText = button.textContent;
        button.textContent = 'Copied! ✓';
        button.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
        
        setTimeout(() => {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
        button.textContent = 'Failed to copy';
        setTimeout(() => {
            button.textContent = 'Copy Results';
        }, 2000);
    }
}

/**
 * Hide modal
 */
export function hideModal() {
    modal.style.display = 'none';
    
    // Hide share display when closing
    const shareDisplay = document.getElementById('shareDisplay');
    if (shareDisplay) {
        shareDisplay.style.display = 'none';
    }
    
    // After closing, ensure View Results button stays visible if results are ready
    // (This allows users to reopen the modal if they dismissed it)
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

/**
 * Auto-fill all drop zones with correct answers (testing mode only)
 */
function autoFillCorrectAnswers() {
    currentPlayers.forEach(player => {
        const dropZones = document.querySelectorAll(`.drop-zone[data-player-name="${player.name}"]`);
        
        if (hardMode) {
            // Hard mode: fill the single drop zone with all teams
            const hardModeZone = dropZones[0];
            if (hardModeZone && hardModeZone.classList.contains('hard-mode-zone')) {
                player.teams.forEach(teamName => {
                    const team = teams.find(t => t.name === teamName);
                    if (team) {
                        createPlacedTeam(hardModeZone, team.name, team.logo);
                    }
                });
                hardModeZone.classList.add('filled');
            }
        } else {
            // Normal mode: fill each drop zone with correct team
            dropZones.forEach((dropZone, index) => {
                if (index < player.teams.length) {
                    const teamName = player.teams[index];
                    const team = teams.find(t => t.name === teamName);
                    if (team) {
                        createPlacedTeam(dropZone, team.name, team.logo);
                        dropZone.classList.add('filled');
                    }
                }
            });
        }
    });
}

/**
 * Create a placed team element
 */
function createPlacedTeam(dropZone, teamName, teamLogo) {
    const teamDiv = document.createElement('div');
    teamDiv.className = 'placed-team';
    teamDiv.dataset.teamName = teamName;
    teamDiv.draggable = true;
    
    const teamLogoImg = document.createElement('img');
    teamLogoImg.src = teamLogo;
    teamLogoImg.alt = teamName;
    teamLogoImg.className = 'team-logo';
    
    teamDiv.addEventListener('dragstart', handlePlacedTeamDragStart);
    teamDiv.addEventListener('dragend', handlePlacedTeamDragEnd);
    teamDiv.addEventListener('touchstart', handlePlacedTeamTouchStart, { passive: false });
    
    teamDiv.appendChild(teamLogoImg);
    dropZone.appendChild(teamDiv);
}
