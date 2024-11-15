let players = []; // Declare players array globally
//let score = 0;
let autoScrollInterval = null;
let isDragging = false;
let strikes = 0; // INitialize strikes
const maxStrikes = 3;
const dots = document.querySelectorAll('.dot');
const submitButton = document.querySelector('#submitButton');

const teams = [
    // Teams in alphabetical order
    "Arizona Diamondbacks", "Atlanta Braves", "Baltimore Orioles", "Boston Red Sox",
    "Chicago Cubs", "Chicago White Sox", "Cincinnati Reds", "Cleveland Guardians", "Colorado Rockies",
    "Detroit Tigers", "Houston Astros", "Kansas City Royals", "Los Angeles Angels", "Los Angeles Dodgers",
    "Miami Marlins", "Milwaukee Brewers", "Minnesota Twins", "New York Mets", "New York Yankees", "Oakland Atheltics",
    "Philadelphia Phillies", "Pittsburgh Pirates", "San Diego Padres", "San Francisco Giants", "Seattle Mariners",
    "St. Louis Cardinals", "Tampa Bay Rays", "Texas Rangers", "Toronto Blue Jays", "Washington Nationals"

];

async function loadPlayerData() {
    try {
        const response = await fetch('./data/players.json');
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

function displayPlayers() {
    const container = document.getElementById('playerContainer');
    container.innerHTML = ''; // Clear any existing content
    
    // Get five random players
    const randomPlayers = players
        .sort(() => Math.random() - 0.5) // Shuffle the players array
        .slice(0, 5); // Select only the first five

    randomPlayers.forEach(player => {
        const playerRow = document.createElement('div');
        playerRow.className = 'player-row';
        
        const nameDiv = document.createElement('div');
        nameDiv.className = 'player-name';
        nameDiv.textContent = player.name;
        
        const dropZonesDiv = document.createElement('div');
        dropZonesDiv.className = 'drop-zone-container';
        //dropZone.dataset.playerName = player.name;
        //dropZone.addEventListener('dragover', handleDragOver);
        //dropZone.addEventListener('drop', handleDrop);
        
        player.teams.forEach(() => {
            const dropZone = document.createElement('div');
            dropZone.className = 'drop-zone';
            dropZone.dataset.playerName = player.name;
            dropZone.addEventListener('dragover', handleDragOver);
            dropZone.addEventListener('drop', handleDrop);
            dropZonesDiv.appendChild(dropZone);
        });
        
        
        playerRow.appendChild(nameDiv);
        playerRow.appendChild(dropZonesDiv);
        container.appendChild(playerRow);
    });
}

function displayTeams() {
    const teamList = document.getElementById('teamList');
    teamList.innerHTML = ''; // Clear any existing content
    
    teams.forEach(team => {
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-item';
        teamDiv.textContent = team;
        teamDiv.draggable = true;
        teamDiv.addEventListener('dragstart', handleDragStart);
        teamDiv.addEventListener('dragend', handleDragEnd);
        teamList.appendChild(teamDiv);
    });
}


function handleDragEnd(e) {
    isDragging = false;
    e.target.classList.remove('dragging');
    clearInterval(autoScrollInterval);
    document.querySelectorAll('.scroll-indicator').forEach(indicator => {
        indicator.classList.remove('visible');
    });
}

function handleDragStart(event) {
    isDragging = true;
    event.dataTransfer.setData('text', event.target.textContent);
}

function handleDragOver(event) {
    event.preventDefault();
}

function handleDrop(event) {
    event.preventDefault();
    const teamName = event.dataTransfer.getData('text');

    // Clear any exisitng content in the drop zone to allow only one team per slot
    event.target.innerHTML = '';

    // Create a new div for each team placed in the drop zone
    const teamDiv = document.createElement('div');
    teamDiv.className = 'placed-team';
    teamDiv.textContent = teamName;

    // Add team to the drop zone
    //event.target.textContent = teamName;
    event.target.appendChild(teamDiv);
    // Remove any previous color
    event.target.classList.remove('correct', 'incorrect');
}


// Reset the score to zero
/*
function resetScore() {
    score = 0;
    document.getElementById('score').textContent = score;
}
*/

// Function to check team placements and update colors based on correctness
function checkPlacements() {
    const dropZones = document.querySelectorAll('.drop-zone');
    let allCorrect = true; // Flag to track if everything is correct
    let hasFilledSlots = false; // Flag to teack if there are any filled slots

    // Loop through each player individually
    players.forEach(player => {
        const playerDropZones = Array.from(dropZones).filter(dropZone => dropZone.dataset.playerName === player.name);

        playerDropZones.forEach((dropZone, index) => {
            const teamDiv = dropZone.querySelector('.placed-team'); // Access the placed team in the drop zone
            const teamName = teamDiv ? teamDiv.textContent : ''; // Get the placed team name
            
            // Skip checking if the slot is empty
            if(!teamName) {
                dropZone.classList.remove('correct', 'incorrect', 'misplaced');
                return;
            }
            hasFilledSlots = true; // At least one slot is filled
            
            const correctTeamName = player.teams[index]; // Correct team for this position

            // Remove any previous classes
            dropZone.classList.remove('correct', 'incorrect', 'misplaced');

            if (teamName === correctTeamName) {
                // Team is correctly placed and in the correct order
                dropZone.classList.add('correct');
            } else if (player.teams.includes(teamName)) {
                // Team is correct for the player but in the wrong order
                dropZone.classList.add('misplaced');
                allCorrect = false;
            } else {
                // Team is incorrect for the player
                dropZone.classList.add('incorrect');
                allCorrect = false;
                addStrike(); // Add a strike for incorrect placements
            }
        });
    });

    // Provide feedback if all answers are correct or not
    if (allCorrect && hasFilledSlots) {
        showModal("Congratulations! All answers are correct!");
    } //else {
    //   showModal("Some answers are incorrect. Please try again.");
    //}
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
    alert("3 strikes, you're out! Game Over!");
}

// Update score function
/*
function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;
}
*/

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadPlayerData();
    //displayPlayers();

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

    // Event listener for "Submit" button
    document.getElementById('submitButton').addEventListener('click', checkPlacements);
});

// Get the modal element
const modal = document.getElementById('congratulationsModal');
const closeButton = document.getElementById('closeModal');

function showModal(message) {
  const modalMessage = modal.querySelector('p');
  modalMessage.textContent = message;
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
