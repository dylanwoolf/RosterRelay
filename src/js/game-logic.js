/**
 * Game Logic
 * Core game rules, validation, and scoring logic
 */

import { teams } from './game-state.js';
import { currentPlayers, strikes, MAX_STRIKES, hardMode } from './game-state.js';
import { setStrikes } from './game-state.js';
import { showModal } from './ui-controller.js';

/**
 * Check all player team placements and provide feedback
 */
export function checkPlacements() {
    if (hardMode) {
        checkPlacementsHardMode();
    } else {
        checkPlacementsNormalMode();
    }
}

/**
 * Check placements in normal mode
 */
function checkPlacementsNormalMode() {
    const dropZones = document.querySelectorAll('.drop-zone');
    let allCorrect = true;
    let allFilled = true;
    let hasIncorrect = false;

    currentPlayers.forEach(player => {
        const playerDropZones = Array.from(dropZones).filter(
            dropZone => dropZone.dataset.playerName === player.name
        );

        playerDropZones.forEach((dropZone, index) => {
            const teamLogo = dropZone.querySelector('img');
            const teamLogoSrc = teamLogo ? teamLogo.src : '';

            // Skip checking if the slot is empty
            if (!teamLogoSrc) {
                allFilled = false;
                dropZone.classList.remove('correct', 'incorrect', 'misplaced');
                return;
            }

            const correctTeam = teams.find(team => team.name === player.teams[index]);
            const correctLogoSrc = correctTeam ? correctTeam.logo : '';

            // Remove any previous classes
            dropZone.classList.remove('correct', 'incorrect', 'misplaced');

            if (teamLogoSrc === correctLogoSrc) {
                // Team is correctly placed and in the correct order
                dropZone.classList.add('correct');
            } else if (player.teams.some(teamName => {
                const team = teams.find(t => t.name === teamName);
                return team && team.logo === teamLogoSrc;
            })) {
                // Team is correct for the player but in the wrong order
                dropZone.classList.add('misplaced');
                allCorrect = false;
            } else {
                // Team is incorrect for the player
                dropZone.classList.add('incorrect');
                allCorrect = false;
                hasIncorrect = true;
            }
        });
    });

    // Add only one strike if there are any incorrect placements
    if (hasIncorrect) {
        addStrike();
    }

    // Provide feedback if all answers are correct
    if (allCorrect && allFilled) {
        showModal("Congratulations! All answers are correct!", true);
    }
}

/**
 * Check placements in hard mode
 */
function checkPlacementsHardMode() {
    const dropZones = document.querySelectorAll('.drop-zone.hard-mode-zone');
    let allCorrect = true;
    let allFilled = true;
    let hasIncorrect = false;

    currentPlayers.forEach(player => {
        const playerDropZone = Array.from(dropZones).find(
            dropZone => dropZone.dataset.playerName === player.name
        );

        if (!playerDropZone) return;

        const placedTeams = playerDropZone.querySelectorAll('.placed-team');
        
        // Remove previous validation classes from teams
        placedTeams.forEach(team => {
            team.classList.remove('correct-team', 'incorrect-team', 'misplaced-team');
        });
        
        const placedLogos = Array.from(placedTeams).map(team => team.querySelector('img').src);

        // Check if player has the correct number of teams
        if (placedLogos.length === 0) {
            allFilled = false;
            playerDropZone.classList.remove('correct', 'incorrect', 'misplaced');
            return;
        }

        // Get the correct team logos in order
        const correctLogos = player.teams.map(teamName => {
            const team = teams.find(t => t.name === teamName);
            return team ? team.logo : '';
        });

        // Check if all placed teams are correct and in the correct order
        const isCorrectCount = placedLogos.length === correctLogos.length;
        const isCorrectOrder = placedLogos.every((logo, index) => logo === correctLogos[index]);

        playerDropZone.classList.remove('correct', 'incorrect', 'misplaced');

        if (isCorrectCount && isCorrectOrder) {
            playerDropZone.classList.add('correct');
            placedTeams.forEach(team => team.classList.add('correct-team'));
        } else if (isCorrectCount && !isCorrectOrder) {
            // Right teams, wrong order
            playerDropZone.classList.add('misplaced');
            allCorrect = false;
            placedTeams.forEach(team => team.classList.add('misplaced-team'));
        } else {
            // Wrong count or wrong teams
            playerDropZone.classList.add('incorrect');
            allCorrect = false;
            hasIncorrect = true;
            placedTeams.forEach(team => team.classList.add('incorrect-team'));
        }
    });

    // Add only one strike if there are any incorrect placements
    if (hasIncorrect) {
        addStrike();
    }

    // Provide feedback if all answers are correct
    if (allCorrect && allFilled) {
        showModal("Congratulations! All answers are correct!", true);
    }
}

/**
 * Add a strike and update the UI
 */
export function addStrike() {
    const dots = document.querySelectorAll('.dot');
    
    if (strikes < MAX_STRIKES) {
        dots[strikes].classList.remove('empty');
        dots[strikes].classList.add('filled');
        setStrikes(strikes + 1);
    }
    
    if (strikes >= MAX_STRIKES) {
        endGame();
    }
}

/**
 * End the game when player runs out of strikes
 */
export function endGame() {
    const submitButton = document.querySelector('#submitButton');
    submitButton.disabled = true;
    showModal("3 strikes, you're out! Game Over!", true);
}

/**
 * Reset strikes to zero
 */
export function resetStrikes() {
    const dots = document.querySelectorAll('.dot');
    setStrikes(0);
    dots.forEach(dot => {
        dot.classList.remove('filled');
        dot.classList.add('empty');
    });
}

/**
 * Enable the submit button
 */
export function enableSubmitButton() {
    const submitButton = document.querySelector('#submitButton');
    submitButton.disabled = false;
}
