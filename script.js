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
    /*
    "Arizona Diamondbacks", "Atlanta Braves", "Baltimore Orioles", "Boston Red Sox",
    "Chicago Cubs", "Chicago White Sox", "Cincinnati Reds", "Cleveland Guardians", "Colorado Rockies",
    "Detroit Tigers", "Houston Astros", "Kansas City Royals", "Los Angeles Angels", "Los Angeles Dodgers",
    "Miami Marlins", "Milwaukee Brewers", "Minnesota Twins", "New York Mets", "New York Yankees", "Oakland Atheltics",
    "Philadelphia Phillies", "Pittsburgh Pirates", "San Diego Padres", "San Francisco Giants", "Seattle Mariners",
    "St. Louis Cardinals", "Tampa Bay Rays", "Texas Rangers", "Toronto Blue Jays", "Washington Nationals"
    */
    { name: "Arizona Diamondbacks", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/ARI.svg" },
    { name: "Atlanta Braves", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/ATL.svg" },
    { name: "Baltimore Orioles", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/BAL.svg" },
    { name: "Boston Red Sox", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/BOS.svg" },
    { name: "Chicago Cubs", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/CHC.svg" },
    { name: "Cincinnati Reds", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/CHW.svg" },
    { name: "Cleveland Guardians", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/CLE.svg" },
    { name: "Colorado Rockies", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/COL.svg" },
    { name: "Detroit Tigers", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/DET.svg" },
    { name: "Houston Astros", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/HOU.svg" },
    { name: "Kansas City Royals", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/KCR.svg" },
    { name: "Los Angeles Angeles", logo: "https://cdn.ssref.net/req/202409300/tlogo/br/ig/light/ANA.svg" },
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
    const teamList = document.getElementById("teamList");
    teamList.innerHTML = ''; // Clear any existing content
    
    
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

function handleDragStart(event) {
    isDragging = true;
    event.target.classList.add('dragging');
    event.target.style.opacity = '0.5';

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
    // Get the team name from the draggable element
    //const teamName = event.target.dataset.teamName || event.target.textContent;
    // Pass the team name as drag data
    //event.dataTransfer.setData('text', teamName);
    
    // Get the logo's src attribute and pass it via dataTransfer
    //const logoSrc = event.target.querySelector('img').src;
    //event.dataTransfer.setData('text', logoSrc);

    //event.dataTransfer.setData('text', event.target.textContent);
    //const teamName = event.target.dataset.teamName; // Use the dataset to get the team name
    //event.dataTransfer.setData("text/plain", teamName);
    //event.target.classList.add("dragging");
}

function handleDragEnd(event) {
    isDragging = false;
    event.target.style.opacity = '1'; // Reset opacity to make item appear normal again
    event.target.classList.remove('dragging');
    clearInterval(autoScrollInterval);
    document.querySelectorAll('.scroll-indicator').forEach(indicator => {
        indicator.classList.remove('visible');
    });
}


function handleDragOver(event) {
    event.preventDefault();
    event.target.classList.add('drag-over');
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
        
        // If the drop zone already contains a team, remove it
        const existingTeam = dropZone.querySelector('.placed-team');
        if (existingTeam) {
            existingTeam.remove();
        }
        
        // Create a new div for the placed team
        const teamDiv = document.createElement('div');
        teamDiv.className = 'placed-team';
        teamDiv.dataset.teamName = dragData.name;
        
        // Create and set up the team logo image
        const teamLogo = document.createElement('img');
        teamLogo.src = dragData.logo;
        teamLogo.alt = dragData.name;
        teamLogo.className = 'team-logo';
        
        // Add the logo to the team div and the team div to the drop zone
        teamDiv.appendChild(teamLogo);
        dropZone.appendChild(teamDiv);
        
        // Remove any previous validation classes
        dropZone.classList.remove('correct', 'incorrect', 'misplaced');
    } catch (error) {
        console.error('Error handling drop:', error);
    }
}

function checkPlacements() {
    const dropZones = document.querySelectorAll('.drop-zone');
    let allCorrect = true; // Flag to track if everything is correct
    let hasFilledSlots = false; // Flag to track if there are any filled slots

    players.forEach(player => {
        const playerDropZones = Array.from(dropZones).filter(
            dropZone => dropZone.dataset.playerName === player.name
        );

        playerDropZones.forEach((dropZone, index) => {
            const teamLogo = dropZone.querySelector('img'); // Access the placed logo in the drop zone
            const teamLogoSrc = teamLogo ? teamLogo.src : ''; // Get the logo's src attribute

            // Skip checking if the slot is empty
            if (!teamLogoSrc) {
                dropZone.classList.remove('correct', 'incorrect', 'misplaced');
                return;
            }
            hasFilledSlots = true; // At least one slot is filled

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
                addStrike(); // Add a strike for incorrect placements
            }
        });
    });

    // Provide feedback if all answers are correct or not
    if (allCorrect && hasFilledSlots) {
        showModal("Congratulations! All answers are correct!");
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
