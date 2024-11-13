let players = []; // Declare players array globally
let score = 0;
let autoScrollInterval = null;
let isDragging = false;

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
function resetScore() {
    score = 0;
    document.getElementById('score').textContent = score;
}

// Function to check team placements and update colors based on correctness
function checkPlacements() {
    const dropZones = document.querySelectorAll('.drop-zone');
    let allCorrect = true; // Flag to track if everything is correct

    dropZones.forEach(dropZone => {
        const playerName = dropZone.dataset.playerName; // The player's name assigned to this drop zone
        const teamName = dropZone.textContent; // The team name placed in this drop zone
        const player = players.find(p => p.name === playerName); // Find the player object by name
        
        // Check if the team is correctly placed for the player
        if (player && player.teams.includes(teamName)) {
            dropZone.classList.add('correct');
            dropZone.classList.remove('incorrect');
            updateScore(1); // Increase score for correct placement
        } else if (teamName !== "") {
            dropZone.classList.add('incorrect');
            dropZone.classList.remove('correct');
            updateScore(-1); // Decrease score for incorrect placement
            allCorrect = false; // If any answer is incorrect, set the flag to false
        }
        
    });

    // Provide feedback if all answers are correct or not
    //if (allCorrect) {
     //   alert("Congratulations! All answers are correct!");
    //} //else {
        //alert("Some answers are incorrect. Please try again.");
    //}
}


// Update score function
function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadPlayerData();
    //displayPlayers();

    /*
    // Make each team name draggable
    const teams = document.querySelectorAll('.team');
    teams.forEach(team => {
        team.setAttribute('draggable', true);
        team.addEventListener('dragstart', handleDragStart);
    });

    // Set up drop zones for each player
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(dropZone => {
        dropZone.addEventListener('dragover', handleDragOver);
        dropZone.addEventListener('drop', handleDrop);
    });
    */

    // Event listener for "Get New Players" button
    document.getElementById('newPlayersButton').addEventListener('click', () => {
        resetScore();
        displayPlayers(); // Display five new players
    });

    // Event listener for "Submit" button
    document.getElementById('submitButton').addEventListener('click', checkPlacements);
});
