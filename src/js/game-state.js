/**
 * Game State Management
 * Manages all game state variables and constants
 */

// Game state variables
export let players = [];
export let currentPlayers = [];
export let strikes = 0;
export let hardMode = false;
export let testingMode = false;
export let attemptHistory = []; // Track each submission attempt
export let gameWon = false; // Track if game has been won
export let resultsReady = false; // Track if results are ready to view

// Drag state
export let isDragging = false;
export let autoScrollInterval = null;

// Touch drag state
export let touchDragData = null;
export let touchDragElement = null;
export let touchGhostElement = null;
export let touchStartElement = null;
export let touchLongPressTimer = null;
export let touchStartX = 0;
export let touchStartY = 0;

// Constants
export const MAX_STRIKES = 3;
export const LONG_PRESS_DURATION = 200; // ms to hold before drag starts
export const TOUCH_MOVE_THRESHOLD = 10; // pixels of movement allowed during long press

// MLB Teams data with logos
export const teams = [
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

// State setters
export function setPlayers(newPlayers) {
    players = newPlayers;
}

export function setCurrentPlayers(newCurrentPlayers) {
    currentPlayers = newCurrentPlayers;
}

export function setStrikes(newStrikes) {
    strikes = newStrikes;
}

export function addAttempt(wasSuccess) {
    attemptHistory.push(wasSuccess);
}

export function resetAttemptHistory() {
    attemptHistory = [];
}

export function setGameWon(won) {
    gameWon = won;
}

export function setResultsReady(ready) {
    resultsReady = ready;
}

export function setHardMode(mode) {
    hardMode = mode;
}

export function setTestingMode(mode) {
    testingMode = mode;
}

export function setIsDragging(dragging) {
    isDragging = dragging;
}

export function setAutoScrollInterval(interval) {
    autoScrollInterval = interval;
}

export function setTouchDragData(data) {
    touchDragData = data;
}

export function setTouchDragElement(element) {
    touchDragElement = element;
}

export function setTouchGhostElement(element) {
    touchGhostElement = element;
}

export function setTouchStartElement(element) {
    touchStartElement = element;
}

export function setTouchLongPressTimer(timer) {
    touchLongPressTimer = timer;
}

export function setTouchStartPosition(x, y) {
    touchStartX = x;
    touchStartY = y;
}
