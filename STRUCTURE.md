# Project Structure

This document outlines the reorganized structure of the Roster Relay project.

## Directory Layout

```
RosterRelay/
├── index.html              # Main HTML entry point
├── package.json            # Project metadata and scripts
├── LICENSE                 # MIT License
├── README.md              # Project documentation
├── .gitignore             # Git ignore rules
├── STRUCTURE.md           # This file
│
├── src/                   # Source code directory
│   ├── js/                # JavaScript modules
│   │   ├── main.js        # Application entry point and initialization
│   │   ├── game-state.js  # Game state management and constants
│   │   ├── game-logic.js  # Game rules and validation logic
│   │   ├── drag-drop.js   # Drag and drop handlers (desktop & mobile)
│   │   ├── ui-controller.js  # DOM manipulation and UI updates
│   │   └── utils.js       # Utility and helper functions
│   │
│   ├── css/               # Stylesheets
│   │   └── style.css      # Main stylesheet
│   │
│   └── data/              # Game data
│       └── players.json   # MLB player data
│
└── assets/                # Static assets
    └── images/            # Images and screenshots (for README)
```

## Module Responsibilities

### main.js (Entry Point)
- Application initialization
- Event listener setup
- Coordinates between modules

### game-state.js (State Management)
- Manages all game state variables
- Stores constants (teams, thresholds, etc.)
- Provides state getter/setter functions
- Single source of truth for application state

### game-logic.js (Game Rules)
- Placement validation (normal & hard mode)
- Strike management
- Win/loss condition checking
- Score calculation

### drag-drop.js (Interaction Handlers)
- Desktop drag and drop events
- Mobile touch events
- Auto-scroll during drag
- Ghost element management for mobile

### ui-controller.js (View Layer)
- DOM manipulation
- Player/team rendering
- Modal management
- Visual feedback and animations

### utils.js (Helpers)
- Data loading functions
- Array manipulation (shuffle, random subset)
- General utility functions

## Key Improvements

1. **Separation of Concerns**: Each module has a single, well-defined responsibility
2. **ES6 Modules**: Modern JavaScript module system for better dependency management
3. **Maintainability**: ~200 lines per module instead of 1264 lines in one file
4. **Testability**: Isolated functions are easier to unit test
5. **Scalability**: New features can be added without affecting other modules
6. **Code Reusability**: Utility functions can be easily reused

## Data Flow

```
main.js (initialization)
  ↓
utils.js (load data)
  ↓
game-state.js (store data)
  ↓
ui-controller.js (render UI)
  ↓
drag-drop.js (user interactions)
  ↓
game-logic.js (validate & score)
  ↓
ui-controller.js (update UI)
```

## Development Guidelines

- Each module exports only what's needed by other modules
- State is managed centrally in `game-state.js`
- UI updates go through `ui-controller.js`
- Business logic stays in `game-logic.js`
- Keep modules focused and cohesive
