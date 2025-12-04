let players = []; // Declare players array globally
//let score = 0;
let autoScrollInterval = null;
let isDragging = false;
let strikes = 0; // Initialize strikes
const maxStrikes = 3;
const dots = document.querySelectorAll('.dot');
const submitButton = document.querySelector('#submitButton');
let hardMode = false; // Hard mode state

const teams = [
    // Teams in alphabetical order with logos
    { name: "Arizona Diamondbacks", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/ARI.svg" },
    { name: "Atlanta Braves", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/ATL.svg" },
    { name: "Baltimore Orioles", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/BAL.svg" },
    { name: "Boston Red Sox", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/BOS.svg" },
    { name: "Chicago Cubs", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/CHC.svg" },
    { name: "Chicago White Sox", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/CHW.svg" },
    { name: "Cincinnati Reds", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/CIN.svg" },
    { name: "Cleveland Guardians", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/CLE.svg" },
    { name: "Colorado Rockies", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/COL.svg" },
    { name: "Detroit Tigers", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/DET.svg" },
    { name: "Houston Astros", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/HOU.svg" },
    { name: "Kansas City Royals", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/KCR.svg" },
    { name: "Los Angeles Angels", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/ANA.svg" },
    { name: "Los Angeles Dodgers", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/LAD.svg" },
    { name: "Miami Marlins", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/FLA.svg" },
    { name: "Milwaukee Brewers", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/MIL.svg" },
    { name: "Minnesota Twins", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/MIN.svg" },
    { name: "New York Mets", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/NYM.svg" },
    { name: "New York Yankees", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/NYY.svg" },
    { name: "Oakland Athletics", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/OAK.svg" },
    { name: "Philadelphia Phillies", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/PHI.svg" },
    { name: "Pittsburgh Pirates", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/PIT.svg" },
    { name: "San Diego Padres", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/SDP.svg" },
    { name: "San Francisco Giants", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/SFG.svg" },
    { name: "Seattle Mariners", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/SEA.svg" },
    { name: "St. Louis Cardinals", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/STL.svg" },
    { name: "Tampa Bay Rays", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/TBR.svg" },
    { name: "Texas Rangers", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/TEX.svg" },
    { name: "Toronto Blue Jays", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/TOR.svg" },
    { name: "Washington Nationals", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/WSN.svg" }
];

async function loadPlayerData() {
    try {
        const response = await fetch('./players.json');
        //if (!response.ok) {
        //    throw new Error(`HTTP error! status: ${response.status}`);
        //}
        const data = await response.json();
        players = data.players; // Assuming your JSON has a "players" array
        console.log('Players loaded successfully:', players);
        displayPlayers();
        displayTeams();
        setupScrollHandling();
    } catch (error) {
        console.error('Error loading player data:', error);
    }

    //document.getElementById('newPlayersButton').addEventListener('click', displayPlayers);
}

function setupScrollHandling() {
    document.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (!isDragging) return;

        const mouseY = e.clientY;
        const windowHeight = window.innerHeight;
        const scrollSpeed = 15;
        const scrollThreshold = 150; // pixels from top/bottom to trigger scroll

        clearInterval(autoScrollInterval);

        if (mouseY < scrollThreshold) {
            // Scroll up
            autoScrollInterval = setInterval(() => {
                window.scrollBy(0, -scrollSpeed);
            }, 20);
            document.querySelector('.scroll-indicator.top').classList.add('visible');
        } else if (mouseY > windowHeight - scrollThreshold) {
            // Scroll down
            autoScrollInterval = setInterval(() => {
                window.scrollBy(0, scrollSpeed);
            }, 20);
            document.querySelector('.scroll-indicator.bottom').classList.add('visible');
        } else {
            document.querySelectorAll('.scroll-indicator').forEach(indicator => {
                indicator.classList.remove('visible');
            });
        }
    });
}

let currentPlayers = []; // Store the current set of players

function displayPlayers() {
    const container = document.getElementById('playerContainer');
    container.innerHTML = ''; // Clear any existing content
    
    // Get five random players
    currentPlayers = players
        .sort(() => Math.random() - 0.5) // Shuffle the players array
        .slice(0, 5); // Select only the first five

    currentPlayers.forEach(player => {
        const playerRow = document.createElement('div');
        playerRow.className = 'player-row';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'player-name';
        nameDiv.textContent = player.name;
        
        const dropZonesDiv = document.createElement('div');
        dropZonesDiv.className = 'drop-zone-container';
        dropZonesDiv.dataset.playerName = player.name;
        dropZonesDiv.dataset.teamCount = player.teams.length; // Store correct count
        
        if (hardMode) {
            // In hard mode, create one flexible drop zone that can hold multiple teams
            const dropZone = document.createElement('div');
            dropZone.className = 'drop-zone hard-mode-zone';
            dropZone.dataset.playerName = player.name;
            dropZone.addEventListener('dragover', handleDragOver);
            dropZone.addEventListener('dragleave', handleDragLeave);
            dropZone.addEventListener('drop', handleDropHardMode);
            dropZonesDiv.appendChild(dropZone);
        } else {
            // Normal mode: create fixed number of drop zones
            player.teams.forEach(() => {
                const dropZone = document.createElement('div');
                dropZone.className = 'drop-zone';
                dropZone.dataset.playerName = player.name;
                dropZone.addEventListener('dragover', handleDragOver);
                dropZone.addEventListener('dragleave', handleDragLeave);
                dropZone.addEventListener('drop', handleDrop);
                dropZonesDiv.appendChild(dropZone);
            });
        }
        
        playerRow.appendChild(nameDiv);
        playerRow.appendChild(dropZonesDiv);
        container.appendChild(playerRow);
    });
}

function displayPlayersWithoutRefresh() {
    const container = document.getElementById('playerContainer');
    container.innerHTML = ''; // Clear any existing content
    
    // Use the current players without shuffling
    currentPlayers.forEach(player => {
        const playerRow = document.createElement('div');
        playerRow.className = 'player-row';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'player-name';
        nameDiv.textContent = player.name;
        
        const dropZonesDiv = document.createElement('div');
        dropZonesDiv.className = 'drop-zone-container';
        dropZonesDiv.dataset.playerName = player.name;
        dropZonesDiv.dataset.teamCount = player.teams.length; // Store correct count
        
        if (hardMode) {
            // In hard mode, create one flexible drop zone that can hold multiple teams
            const dropZone = document.createElement('div');
            dropZone.className = 'drop-zone hard-mode-zone';
            dropZone.dataset.playerName = player.name;
            dropZone.addEventListener('dragover', handleDragOver);
            dropZone.addEventListener('dragleave', handleDragLeave);
            dropZone.addEventListener('drop', handleDropHardMode);
            dropZonesDiv.appendChild(dropZone);
        } else {
            // Normal mode: create fixed number of drop zones
            player.teams.forEach(() => {
                const dropZone = document.createElement('div');
                dropZone.className = 'drop-zone';
                dropZone.dataset.playerName = player.name;
                dropZone.addEventListener('dragover', handleDragOver);
                dropZone.addEventListener('dragleave', handleDragLeave);
                dropZone.addEventListener('drop', handleDrop);
                dropZonesDiv.appendChild(dropZone);
            });
        }
        
        playerRow.appendChild(nameDiv);
        playerRow.appendChild(dropZonesDiv);
        container.appendChild(playerRow);
    });
}

function displayTeams() {
    const teamList = document.getElementById("teamList");
    teamList.innerHTML = ''; // Clear any existing content
    
    // Make team list a drop zone for removing teams
    teamList.addEventListener('dragover', handleTeamListDragOver);
    teamList.addEventListener('drop', handleTeamListDrop);
    teamList.addEventListener('dragleave', handleTeamListDragLeave);
    
    teams.forEach(team => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-item';
        teamDiv.draggable = true;

        // Create an img element for the team logo
        const teamLogo = document.createElement('img');
        teamLogo.src = team.logo;
        teamLogo.alt = team.name;
        teamLogo.className = 'team-logo';
        teamLogo.draggable = true;

        // Add drag event listeners
        teamDiv.addEventListener('dragstart', handleDragStart);
        teamDiv.addEventListener('dragend', handleDragEnd);
        teamDiv.addEventListener('dragover', handleDragOver);
        
        // Propagate dragstart from the image to the parent div
        teamLogo.addEventListener('dragstart', e => {
            e.stopPropagation(); // Prevent the image's default dragstart
            teamDiv.dispatchEvent(new DragEvent('dragstart', e)); // Trigger the parent div's dragstart
        });

        // Append the logo to the draggable div
        teamDiv.appendChild(teamLogo);
        teamList.appendChild(teamDiv);
    });
}

function handleTeamListDragOver(event) {
    event.preventDefault();
    const teamList = document.getElementById('teamList');
    teamList.classList.add('drag-over-remove');
}

function handleTeamListDragLeave(event) {
    const teamList = document.getElementById('teamList');
    // Only remove class if we're actually leaving the team list (not going to a child element)
    if (!teamList.contains(event.relatedTarget)) {
        teamList.classList.remove('drag-over-remove');
    }
}

function handleTeamListDrop(event) {
    event.preventDefault();
    const teamList = document.getElementById('teamList');
    teamList.classList.remove('drag-over-remove');
    
    try {
        const dragData = JSON.parse(event.dataTransfer.getData('application/json'));
        
        // Only handle if this is a placed team being removed
        if (dragData.isPlacedTeam && window.draggedPlacedTeam) {
            const draggedTeam = window.draggedPlacedTeam;
            const originalDropZone = draggedTeam.closest('.drop-zone');
            
            // Remove the team from the drop zone
            draggedTeam.remove();
            
            // Update the original drop zone's filled state
            if (originalDropZone) {
                if (originalDropZone.classList.contains('hard-mode-zone')) {
                    // Hard mode: check if any teams remain
                    if (originalDropZone.querySelectorAll('.placed-team').length === 0) {
                        originalDropZone.classList.remove('filled');
                    }
                } else {
                    // Normal mode: remove filled class
                    originalDropZone.classList.remove('filled');
                }
            }
            
            // Clear the global reference
            window.draggedPlacedTeam = null;
        }
    } catch (error) {
        console.error('Error handling team list drop:', error);
    }
}

function handleDragStart(event) {
    isDragging = true;
    event.target.classList.add('dragging');

    // Get the team data from the dragged element
    const teamLogo = event.target.querySelector('img');
    const teamName = teamLogo.alt;  // Using the alt text which contains team name
    const logoSrc = teamLogo.src;
    
    // Store both the team name and logo URL in the dataTransfer
    const dragData = {
        name: teamName,
        logo: logoSrc
    };
    event.dataTransfer.setData('application/json', JSON.stringify(dragData));
}

function handleDragEnd(event) {
    isDragging = false;
    event.target.classList.remove('dragging');
    
    clearInterval(autoScrollInterval);
    document.querySelectorAll('.scroll-indicator').forEach(indicator => {
        indicator.classList.remove('visible');
    });
    
    // Remove drag-over class from all drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });
    
    // Remove drag-over class from team list
    const teamList = document.getElementById('teamList');
    if (teamList) {
        teamList.classList.remove('drag-over-remove');
    }
}

function handlePlacedTeamDragStart(event) {
    isDragging = true;
    event.target.classList.add('dragging');
    
    // Get the team data from the placed team
    const teamName = event.target.dataset.teamName;
    const teamLogo = event.target.querySelector('img');
    const logoSrc = teamLogo.src;
    
    // Store the team data in dataTransfer
    const dragData = {
        name: teamName,
        logo: logoSrc,
        isPlacedTeam: true
    };
    event.dataTransfer.setData('application/json', JSON.stringify(dragData));
    
    // Store reference to the dragged element globally
    window.draggedPlacedTeam = event.target;
    
    // Hide the team but don't remove it yet
    event.target.style.visibility = 'hidden';
}

function handlePlacedTeamDragEnd(event) {
    isDragging = false;
    event.target.classList.remove('dragging');
    
    clearInterval(autoScrollInterval);
    document.querySelectorAll('.scroll-indicator').forEach(indicator => {
        indicator.classList.remove('visible');
    });
    
    // Remove drag-over class from all drop zones
    document.querySelectorAll('.drop-zone').forEach(zone => {
        zone.classList.remove('drag-over');
    });
    
    // Remove drag-over class from team list
    const teamList = document.getElementById('teamList');
    if (teamList) {
        teamList.classList.remove('drag-over-remove');
    }
    
    // If the drag was cancelled (not dropped in a valid zone), restore the team
    if (event.target.style.visibility === 'hidden') {
        event.target.style.visibility = 'visible';
        window.draggedPlacedTeam = null;
    }
}


function handleDragOver(event) {
    event.preventDefault();
    const dropZone = event.target.closest('.drop-zone');
    if (dropZone) {
        dropZone.classList.add('drag-over');
    }
}

function handleDragLeave(event) {
    const dropZone = event.target.closest('.drop-zone');
    if (dropZone && !dropZone.contains(event.relatedTarget)) {
        dropZone.classList.remove('drag-over');
    }
}

function handleDrop(event) {
    event.preventDefault();
    const dropZone = event.target.closest('.drop-zone'); // Ensure we get the drop zone even if dropping on child element
    
    if (!dropZone) return; // Exit if not dropped in a valid drop zone
    
    // Remove drag-over styling
    dropZone.classList.remove('drag-over');
    
    try {
        // Get the team data from the dataTransfer
        const dragData = JSON.parse(event.dataTransfer.getData('application/json'));
        
        // Check if this is a placed team being moved
        if (dragData.isPlacedTeam && window.draggedPlacedTeam) {
            // Get the existing team in the target drop zone
            const existingTeam = dropZone.querySelector('.placed-team');
            
            if (existingTeam) {
                // Swap the teams
                const draggedTeam = window.draggedPlacedTeam;
                const originalDropZone = draggedTeam.closest('.drop-zone');
                
                // Move the dragged team to the new drop zone
                dropZone.appendChild(draggedTeam);
                draggedTeam.style.visibility = 'visible';
                draggedTeam.style.opacity = '1';
                draggedTeam.classList.remove('dragging');
                
                // Move the existing team to the original drop zone
                originalDropZone.appendChild(existingTeam);
                
                // Add filled class to both zones
                dropZone.classList.add('filled');
                originalDropZone.classList.add('filled');
            } else {
                // Just move the dragged team to the empty drop zone
                const draggedTeam = window.draggedPlacedTeam;
                const originalDropZone = draggedTeam.closest('.drop-zone');
                
                dropZone.appendChild(draggedTeam);
                draggedTeam.style.visibility = 'visible';
                draggedTeam.style.opacity = '1';
                draggedTeam.classList.remove('dragging');
                
                // Update filled classes
                dropZone.classList.add('filled');
                originalDropZone.classList.remove('filled');
            }
            
            // Clear the global reference
            window.draggedPlacedTeam = null;
        } else {
            // This is a new team from the team list
            // If the drop zone already contains a team, remove it
            const existingTeam = dropZone.querySelector('.placed-team');
            if (existingTeam) {
                existingTeam.remove();
            }
            
            // Create a new div for the placed team
            const teamDiv = document.createElement('div');
            teamDiv.className = 'placed-team';
            teamDiv.dataset.teamName = dragData.name;
            teamDiv.draggable = true;
            
            // Create and set up the team logo image
            const teamLogo = document.createElement('img');
            teamLogo.src = dragData.logo;
            teamLogo.alt = dragData.name;
            teamLogo.className = 'team-logo';
            
            // Add drag event listeners to the placed team
            teamDiv.addEventListener('dragstart', handlePlacedTeamDragStart);
            teamDiv.addEventListener('dragend', handlePlacedTeamDragEnd);
            
            // Add the logo to the team div and the team div to the drop zone
            teamDiv.appendChild(teamLogo);
            dropZone.appendChild(teamDiv);
            
            // Add filled class to show it has a team
            dropZone.classList.add('filled');
        }
        
        // Remove any previous validation classes
        dropZone.classList.remove('correct', 'incorrect', 'misplaced');
    } catch (error) {
        console.error('Error handling drop:', error);
    }
}

function handleDropHardMode(event) {
    event.preventDefault();
    const dropZone = event.target.closest('.drop-zone');
    
    if (!dropZone) return;
    
    // Remove drag-over styling
    dropZone.classList.remove('drag-over');
    
    try {
        const dragData = JSON.parse(event.dataTransfer.getData('application/json'));
        
        // Check if this is a placed team being moved
        if (dragData.isPlacedTeam && window.draggedPlacedTeam) {
            const draggedTeam = window.draggedPlacedTeam;
            const originalDropZone = draggedTeam.closest('.drop-zone');
            
            // Remove validation classes from the dragged team
            draggedTeam.classList.remove('correct-team', 'incorrect-team', 'misplaced-team');
            
            // Move the dragged team to the new drop zone
            dropZone.appendChild(draggedTeam);
            draggedTeam.style.visibility = 'visible';
            draggedTeam.style.opacity = '1';
            draggedTeam.classList.remove('dragging');
            
            // Update filled classes
            if (dropZone.querySelectorAll('.placed-team').length > 0) {
                dropZone.classList.add('filled');
            }
            if (originalDropZone && originalDropZone.querySelectorAll('.placed-team').length === 0) {
                originalDropZone.classList.remove('filled');
            }
            
            window.draggedPlacedTeam = null;
        } else {
            // This is a new team from the team list - add it to the hard mode zone
            const teamDiv = document.createElement('div');
            teamDiv.className = 'placed-team';
            teamDiv.dataset.teamName = dragData.name;
            teamDiv.draggable = true;
            
            const teamLogo = document.createElement('img');
            teamLogo.src = dragData.logo;
            teamLogo.alt = dragData.name;
            teamLogo.className = 'team-logo';
            
            teamDiv.addEventListener('dragstart', handlePlacedTeamDragStart);
            teamDiv.addEventListener('dragend', handlePlacedTeamDragEnd);
            
            teamDiv.appendChild(teamLogo);
            dropZone.appendChild(teamDiv);
            
            dropZone.classList.add('filled');
        }
        
        // Remove any previous validation classes
        dropZone.classList.remove('correct', 'incorrect', 'misplaced');
    } catch (error) {
        console.error('Error handling drop:', error);
    }
}

function checkPlacements() {
    if (hardMode) {
        checkPlacementsHardMode();
    } else {
        checkPlacementsNormalMode();
    }
}

function checkPlacementsNormalMode() {
    const dropZones = document.querySelectorAll('.drop-zone');
    let allCorrect = true; // Flag to track if everything is correct
    let allFilled = true; // Flag to track if all slots are filled
    let hasIncorrect = false; // Flag to track if there are any incorrect placements

    currentPlayers.forEach(player => {
        const playerDropZones = Array.from(dropZones).filter(
            dropZone => dropZone.dataset.playerName === player.name
        );

        playerDropZones.forEach((dropZone, index) => {
            const teamLogo = dropZone.querySelector('img'); // Access the placed logo in the drop zone
            const teamLogoSrc = teamLogo ? teamLogo.src : ''; // Get the logo's src attribute

            // Skip checking if the slot is empty
            if (!teamLogoSrc) {
                allFilled = false; // Mark as not all slots filled
                dropZone.classList.remove('correct', 'incorrect', 'misplaced');
                return;
            }

            const correctTeam = teams.find(team => team.name === player.teams[index]); // Find the correct team
            const correctLogoSrc = correctTeam ? correctTeam.logo : ''; // Correct logo for this position

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
                hasIncorrect = true; // Mark that there's at least one incorrect placement
            }
        });
    });

    // Add only one strike if there are any incorrect placements
    if (hasIncorrect) {
        addStrike();
    }

    // Provide feedback if all answers are correct or not
    if (allCorrect && allFilled) {
        showModal("Congratulations! All answers are correct!", true);
    }
}

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
            // Mark each placed team as correct
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

// Add a strike and update the dots
function addStrike() {
    if (strikes < maxStrikes) {
        dots[strikes].classList.remove('empty');
        dots[strikes].classList.add('filled');
        strikes++;
    }
    if (strikes === maxStrikes) {
        endGame();
    }
}

// End the game when the player runs out of strikes
function endGame() {
    submitButton.disabled = true;
    //alert("3 strikes, you're out! Game Over!");
    showModal("3 strikes, you're out! Game Over!", true);
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadPlayerData();
    //displayPlayers();

    // Event listener for hard mode toggle
    document.getElementById('hardModeToggle').addEventListener('change', (e) => {
        hardMode = e.target.checked;
        // Clear all drop zones and redisplay with same players
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
    });

    // Event listener for "Get New Players" button
    document.getElementById('newPlayersButton').addEventListener('click', () => {
        //resetScore();
        strikes = 0; // Reset strikes
        dots.forEach(dot => {
            dot.classList.remove('filled');
            dot.classList.add('empty');
        });
        submitButton.disabled = false; // Re-enable submit button
        displayPlayers(); // Display five new players
    });

    //Event listener for "Clear" button - clears everything except correct answers
    document.getElementById('clearButton').addEventListener('click', function () {
        // Get all drop zones
        const dropZones = document.querySelectorAll('.drop-zone');
    
        // Loop through each drop zone
        dropZones.forEach((zone) => {
            // Check if this zone is marked as correct
            const isCorrect = zone.classList.contains('correct');
            
            if (!isCorrect) {
                // Remove validation classes from placed teams
                const placedTeams = zone.querySelectorAll('.placed-team');
                placedTeams.forEach(team => {
                    team.classList.remove('correct-team', 'incorrect-team', 'misplaced-team');
                });
                
                // Remove any child elements (e.g., team logos or text)
                while (zone.firstChild) {
                    zone.removeChild(zone.firstChild);
                }
        
                // Reset styles to their default
                zone.classList.remove('incorrect', 'misplaced', 'filled', 'drag-over');
                zone.textContent = ""; // Optional: Clear any text content
            }
        });
    });

    //Event listener for "Restart" button - clears board and strikes, keeps same players
    document.getElementById('restartButton').addEventListener('click', function () {
        // Reset strikes
        strikes = 0;
        dots.forEach(dot => {
            dot.classList.remove('filled');
            dot.classList.add('empty');
        });
        // Re-enable submit button in case it was disabled by game over
        submitButton.disabled = false;
        
        // Get all drop zones
        const dropZones = document.querySelectorAll('.drop-zone');
    
        // Loop through each drop zone
        dropZones.forEach((zone) => {
            // Remove validation classes from placed teams
            const placedTeams = zone.querySelectorAll('.placed-team');
            placedTeams.forEach(team => {
                team.classList.remove('correct-team', 'incorrect-team', 'misplaced-team');
            });
            
            // Remove any child elements (e.g., team logos or text)
            while (zone.firstChild) {
                zone.removeChild(zone.firstChild);
            }
    
            // Reset styles to their default
            zone.classList.remove('correct', 'incorrect', 'misplaced', 'filled', 'drag-over');
            zone.textContent = ""; // Optional: Clear any text content
        });
    });    

    // Event listener for "Submit" button
    document.getElementById('submitButton').addEventListener('click', checkPlacements);
});

// Get the modal element
const modal = document.getElementById('congratulationsModal');
const closeButton = document.getElementById('closeModal');
const modalButtons = document.getElementById('modalButtons');

function showModal(message, showButtons = false) {
  const modalMessage = document.getElementById('modalMessage');
  modalMessage.textContent = message;
  
  // Show or hide buttons based on the showButtons parameter
  if (showButtons) {
    modalButtons.style.display = 'flex';
  } else {
    modalButtons.style.display = 'none';
  }
  
  modal.style.display = 'block';
}

function hideModal() {
  modal.style.display = 'none';
}

// Close the modal when the close button is clicked
closeButton.addEventListener('click', hideModal);

// Close the modal when the user clicks outside the modal
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    hideModal();
  }
});

// Handle "Get New Players" button in modal
document.getElementById('modalNewPlayersButton').addEventListener('click', () => {
  hideModal();
  // Reset strikes
  strikes = 0;
  dots.forEach(dot => {
    dot.classList.remove('filled');
    dot.classList.add('empty');
  });
  submitButton.disabled = false;
  // Get new players
  displayPlayers();
});

// Handle "Restart" button in modal
document.getElementById('modalRestartButton').addEventListener('click', () => {
  hideModal();
  // Reset strikes
  strikes = 0;
  dots.forEach(dot => {
    dot.classList.remove('filled');
    dot.classList.add('empty');
  });
  // Re-enable submit button in case it was disabled by game over
  submitButton.disabled = false;
  // Clear all drop zones (same as Clear All button)
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
    zone.textContent = "";
  });
});
