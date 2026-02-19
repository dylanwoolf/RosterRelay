# ⚾ Roster Relay

> An interactive drag-and-drop game where players match MLB players to the teams they've played for throughout their careers!

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://roster-relay.netlify.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

[**🎮 Play Now**](https://roster-relay.netlify.app/) | [Report Bug](https://github.com/yourusername/RosterRelay/issues) | [Request Feature](https://github.com/yourusername/RosterRelay/issues)

---

## 📸 Screenshots

<!-- Add screenshots here once you have them -->
*Screenshots coming soon*

## ✨ Features

### Core Gameplay
- 🎯 **Interactive Drag & Drop** - Intuitive drag-and-drop interface for both desktop and mobile
- ⚡ **Real-Time Feedback** - Instant visual feedback for correct, incorrect, and misplaced team selections
- 🔄 **Dynamic Players** - Generate a new set of random players with one click
- 🎲 **Hard Mode** - Challenge yourself without knowing how many teams each player has played for
- 📊 **Strike System** - Three-strike system keeps the game exciting and challenging

### Technical Features
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🎨 **Modern UI/UX** - Beautiful gradient backgrounds and smooth animations
- 👆 **Touch-Optimized** - Long-press drag functionality for mobile devices
- 🚀 **Modular Code** - Clean, maintainable ES6 module architecture
- ♿ **Accessible** - Semantic HTML and keyboard-friendly interactions

## 🎮 How to Play

1. **View the Players** - Five random MLB players appear with empty drop zones for their career teams
2. **Drag Team Logos** - Drag team logos from the bottom list into the correct slots
3. **Order Matters** - Place teams in chronological order from left to right
4. **Submit Your Answer** - Click "Submit" to check your placements
5. **Three Strikes** - You get three chances to get it right before game over
6. **Hard Mode (Optional)** - Toggle for an extra challenge where you don't see the number of teams

### Game Controls

- **Get New Players** - Load a fresh set of players
- **Clear** - Remove incorrect answers while keeping correct ones
- **Restart** - Clear everything and start over with the same players
- **Submit** - Check your answers

## 🚀 Getting Started

### Prerequisites

You'll need a local web server because the app uses `fetch()` to load JSON data. Choose one of the methods below:

### Option 1: Python (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/RosterRelay.git
cd RosterRelay

# Start the server
python3 -m http.server 8000

# Open in browser
Visit http://localhost:8000/RosterRelay/
```

### Option 2: Node.js

```bash
# Using http-server
npx http-server -p 8000

# Or using live-server
npx live-server --port=8000
```

### Option 3: VS Code Live Server

1. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer)
2. Right-click on `index.html`
3. Select "Open with Live Server"

## 📁 Project Structure

```
RosterRelay/
├── index.html              # Main HTML entry point
├── src/
│   ├── js/                 # JavaScript modules
│   │   ├── main.js         # Application initialization
│   │   ├── game-state.js   # State management
│   │   ├── game-logic.js   # Game rules & validation
│   │   ├── drag-drop.js    # Drag & drop handlers
│   │   ├── ui-controller.js # DOM manipulation
│   │   └── utils.js        # Utility functions
│   ├── css/
│   │   └── style.css       # Styles & animations
│   └── data/
│       └── players.json    # MLB player data
├── assets/                 # Static assets
├── package.json           # Project metadata
└── LICENSE                # MIT License
```

See [STRUCTURE.md](STRUCTURE.md) for detailed architecture documentation.

## 🛠️ Built With

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox/grid, animations, and gradients
- **JavaScript (ES6+)** - Modular architecture with ES6 modules
- **Drag and Drop API** - Native browser drag and drop
- **Touch Events API** - Mobile touch interactions

## 🏗️ Architecture Highlights

The codebase has been refactored from a single 1264-line file into a clean, modular architecture:

- **Separation of Concerns** - Each module has a single responsibility
- **ES6 Modules** - Modern import/export system
- **State Management** - Centralized state in `game-state.js`
- **Event-Driven** - Clean event handling and delegation
- **Responsive Design** - Mobile-first approach with progressive enhancement

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] Add player statistics and career highlights
- [ ] Implement difficulty levels
- [ ] Add global leaderboard
- [ ] Support for other sports leagues
- [ ] Dark mode toggle
- [ ] Player search and filter
- [ ] Achievement system
- [ ] Share results on social media

## 👤 Author

**Dylan Woolf**

- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- Team logos provided by [Sports Reference](https://www.sports-reference.com/)
- Player data compiled from Baseball Reference
- Inspired by popular sports trivia games

## 📊 Stats

![Code Size](https://img.shields.io/github/languages/code-size/yourusername/RosterRelay)
![Last Commit](https://img.shields.io/github/last-commit/yourusername/RosterRelay)

---

<p align="center">Made with ⚾ and ❤️</p>
