/**
 * Game Logic
 * Core game rules, validation, and scoring logic
 */

import { teams } from './game-state.js';
import { currentPlayers, strikes, balls, MAX_STRIKES, MAX_BALLS, hardMode, attemptHistory, gameWon, resultsReady, hasSubmittedCurrentState } from './game-state.js';
import { setStrikes, setBalls, addAttempt, resetAttemptHistory, setGameWon, setResultsReady, setHasSubmittedCurrentState } from './game-state.js';
import { showModal } from './ui-controller.js';

/**
 * Check all player team placements and provide feedback
 */
export function checkPlacements() {
    // If results are ready, show the modal again
    if (resultsReady) {
        viewResults();
        return;
    }
    
    // Don't allow checking if game is already won
    if (gameWon) {
        return;
    }
    
    if (hardMode) {
        checkPlacementsHardMode();
    } else {
        checkPlacementsNormalMode();
    }
}

/**
 * View the results modal (can be called multiple times)
 */
export function viewResults() {
    const shareText = attemptHistory.length > 0 ? generateShareableResults() : null;
    let message;
    
    if (gameWon) {
        message = "Congratulations! All answers are correct!";
    } else if (strikes >= MAX_STRIKES) {
        message = "Strike 3! Game Over!";
    } else if (balls >= MAX_BALLS) {
        message = "Take your base!";
    } else {
        message = "Game Over!";
    }
    
    showModal(message, true, shareText);
}

/**
 * Check placements in normal mode
 */
function checkPlacementsNormalMode() {
    const dropZones = document.querySelectorAll('.drop-zone');
    let allCorrect = true;
    let allFilled = true;
    let hasIncorrect = false;
    let hasMisplaced = false;

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
                hasMisplaced = true;
            } else {
                // Team is incorrect for the player
                dropZone.classList.add('incorrect');
                allCorrect = false;
                hasIncorrect = true;
            }
        });
    });

    // Only add penalties if this board state hasn't been submitted before
    if (!hasSubmittedCurrentState) {
        // Show "Foul Ball!" notification if there are both misplaced and incorrect teams
        if (hasMisplaced && hasIncorrect) {
            showFoulBallNotification();
        }
        
        // Add a ball if there are any misplaced teams (but no incorrect ones)
        if (hasMisplaced && !hasIncorrect) {
            addBall();
            addAttempt('ball'); // Record ball attempt
        }

        // Add only one strike if there are any incorrect placements
        if (hasIncorrect) {
            addStrike();
            addAttempt('strike'); // Record strike attempt
        }
        
        // Mark that we've submitted this board state
        setHasSubmittedCurrentState(true);
    }

    // Provide feedback if all answers are correct
    if (allCorrect && allFilled) {
        if (!gameWon) {
            addAttempt('success'); // Record successful attempt
            setGameWon(true); // Mark game as won
            setResultsReady(true); // Enable view results
            updateSubmitButton(); // Change button to "View Results"
            viewResults(); // Automatically show results modal
        }
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
    let hasMisplaced = false;

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
            hasMisplaced = true;
            placedTeams.forEach(team => team.classList.add('misplaced-team'));
        } else {
            // Wrong count or wrong teams
            playerDropZone.classList.add('incorrect');
            allCorrect = false;
            hasIncorrect = true;
            placedTeams.forEach(team => team.classList.add('incorrect-team'));
        }
    });

    // Only add penalties if this board state hasn't been submitted before
    if (!hasSubmittedCurrentState) {
        // Show "Foul Ball!" notification if there are both misplaced and incorrect teams
        if (hasMisplaced && hasIncorrect) {
            showFoulBallNotification();
        }
        
        // Add a ball if there are any misplaced teams (but no incorrect ones)
        if (hasMisplaced && !hasIncorrect) {
            addBall();
            addAttempt('ball'); // Record ball attempt
        }

        // Add only one strike if there are any incorrect placements
        if (hasIncorrect) {
            addStrike();
            addAttempt('strike'); // Record strike attempt
        }
        
        // Mark that we've submitted this board state
        setHasSubmittedCurrentState(true);
    }

    // Provide feedback if all answers are correct
    if (allCorrect && allFilled) {
        if (!gameWon) {
            addAttempt('success'); // Record successful attempt
            setGameWon(true); // Mark game as won
            setResultsReady(true); // Enable view results
            updateSubmitButton(); // Change button to "View Results"
            viewResults(); // Automatically show results modal
        }
    }
}

/**
 * Add a strike and update the UI
 */
export function addStrike() {
    const strikeDots = document.querySelectorAll('.strike-dot');
    
    if (strikes < MAX_STRIKES) {
        strikeDots[strikes].classList.remove('empty');
        strikeDots[strikes].classList.add('filled');
        setStrikes(strikes + 1);
    }
    
    if (strikes >= MAX_STRIKES) {
        endGame();
    }
}

/**
 * Add a ball and update the UI
 */
export function addBall() {
    const ballDots = document.querySelectorAll('.ball-dot');
    
    if (balls < MAX_BALLS) {
        ballDots[balls].classList.remove('empty');
        ballDots[balls].classList.add('filled');
        setBalls(balls + 1);
    }
    
    if (balls >= MAX_BALLS) {
        endGame();
    }
}

/**
 * End the game when player runs out of strikes or balls
 */
export function endGame() {
    setResultsReady(true); // Enable view results
    updateSubmitButton(); // Change button to "View Results"
    viewResults(); // Automatically show results modal
}

/**
 * Reset strikes and balls to zero
 */
export function resetStrikes() {
    const strikeDots = document.querySelectorAll('.strike-dot');
    const ballDots = document.querySelectorAll('.ball-dot');
    
    setStrikes(0);
    setBalls(0);
    resetAttemptHistory();
    setGameWon(false); // Reset game won state
    setResultsReady(false); // Reset results ready state
    setHasSubmittedCurrentState(false); // Reset submission state
    
    strikeDots.forEach(dot => {
        dot.classList.remove('filled');
        dot.classList.add('empty');
    });
    
    ballDots.forEach(dot => {
        dot.classList.remove('filled');
        dot.classList.add('empty');
    });
    
    updateSubmitButton(); // Reset button to "Submit"
}

/**
 * Enable the submit button
 */
export function enableSubmitButton() {
    const submitButton = document.querySelector('#submitButton');
    submitButton.disabled = false;
    updateSubmitButton(); // Reset button text
}

/**
 * Update submit button text based on game state
 */
function updateSubmitButton() {
    const submitButton = document.querySelector('#submitButton');
    if (resultsReady) {
        submitButton.textContent = 'View Results';
        submitButton.classList.add('view-results');
    } else {
        submitButton.textContent = 'Submit';
        submitButton.classList.remove('view-results');
    }
}

/**
 * Generate shareable results in Wordle-style format
 */
function generateShareableResults() {
    const mode = hardMode ? " (Hard Mode)" : "";
    
    // Build the result string with ball-strike count (baseball style)
    let result = `Roster Relay${mode} (${balls}-${strikes})\n\n`;
    
    // Add attempt emojis
    attemptHistory.forEach((attemptType) => {
        if (attemptType === 'success') {
            result += '✅'; // Success
        } else if (attemptType === 'strike') {
            result += '⚾'; // Strike (baseball)
        } else if (attemptType === 'ball') {
            result += '🟡'; // Ball (yellow circle)
        }
    });
    
    return result;
}

/**
 * Show the "Foul Ball!" notification with fade animation
 */
function showFoulBallNotification() {
    const notification = document.getElementById('foulBallNotification');
    
    // Remove existing show class if present
    notification.classList.remove('show');
    
    // Force reflow to restart animation
    void notification.offsetWidth;
    
    // Add show class to trigger animation
    notification.classList.add('show');
    
    // Remove the show class after animation completes (2 seconds)
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}
