let players = []; // Declare players array globally
let score = 0;
let autoScrollInterval = null;
let isDragging = false;

const teams = [
    /* AL EAST */
    //"New York Yankees", "Boston Red Sox", "Tampa Bay Rays", "Baltimore Orioles", "Toronto Blue Jays",
    /* AL CENTRAL */
    //"Cleveland Guardians", "Chicago White Sox", "Kansas City Royals", "Detroit Tigers", "Minnesota Twins",
    /* AL WEST */
    //"Houston Astros", "Texas Rangers", "Oakland Athletics", "Seattle Mariners", "Los Angeles Angels",
    /* NL EAST */
    //"New York Mets", "Philadelphia Phillies", "Miami Marlins", "Washington Nationals", "Atlanta Braves",
    /* NL CENTRAL */
    //"Milwaukee Brewers", "Chicago Cubs", "St. Louis Cardinals", "Pittsburgh Pirates", "Cincinnati Reds",
    /* NL WEST */
    //"Los Angeles Dodgers", "San Diego Padres", "Colorado Rockies", "San Francisco Giants", "Arizona Diamondbacks"
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
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        players = data.players; // Assuming your JSON has a "players" array
        console.log('Players loaded successfully:', players);
        displayPlayers();
        displayTeams();
        setupScrollHandling();
    } catch (error) {
        console.error('Error loading player data:', error);
        document.getElementById('playerContainer').innerHTML = 
            '<div class="error">Error loading player data. Please check the console for details.</div>';
    }

    document.getElementById('newPlayersButton').addEventListener('click', displayPlayers);
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
        dropZonesDiv.className = 'drop-zones';
        
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

function handleDragStart(e) {
    isDragging = true;
    e.target.classList.add('dragging');
    e.dataTransfer.setData('text/plain', e.target.textContent);
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    isDragging = false;
    e.target.classList.remove('dragging');
    clearInterval(autoScrollInterval);
    document.querySelectorAll('.scroll-indicator').forEach(indicator => {
        indicator.classList.remove('visible');
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
}

function handleDrop(e) {
    e.preventDefault();
    const teamName = e.dataTransfer.getData('text/plain');
    const dropZone = e.target;
    
    if (!dropZone.classList.contains('drop-zone')) return;
    if (dropZone.classList.contains('filled')) return;
    
    const playerName = dropZone.dataset.playerName;
    const player = players.find(p => p.name === playerName);
    
    if (player && player.teams.includes(teamName)) {
        dropZone.textContent = teamName;
        dropZone.classList.add('filled');
        updateScore(1);
    } else {
        updateScore(-1);
    }
}



// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    loadPlayerData();

    // Event listener for "Get New Players" button
    document.getElementById('newPlayersButton').addEventListener('click', () => {
        resetScore();
        displayPlayers(); // Display five new players
    });

    // Event listener for "Submit" button
    document.getElementById('submitButton').addEventListener('click', checkPlacements);
});

// Reset the score to zero
function resetScore() {
    score = 0;
    document.getElementById('score').textContent = score;
}

// Function to check team placements and update colors based on correctness
function checkPlacements() {
    const dropZones = document.querySelectorAll('.drop-zone');

    dropZones.forEach(dropZone => {
        const playerName = dropZone.dataset.playerName;
        const teamName = dropZone.textContent;
        const player = players.find(p => p.name === playerName);

        if(player && player.teams.includes(teamName)) {
            // Team is correctly placed
            dropZone.classList.add('correct');
            dropZone.classList.remove('incorrect');
            updateScore(1);
        } else if (teamName !== "") {
            // Team is incorrectly placed
            dropZone.classList.add('incorrect');
            dropZone.classList.remove('correct');
            updateScore(-1);
        }
    })
}

// Update score function
function updateScore(points) {
    score += points;
    document.getElementById('score').textContent = score;
}