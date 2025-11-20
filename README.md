Roster Relay (MLB Player Team Matching Game)
------------------------------
A fun and interactive drag-and-drop game where players match MLB players to the teams they've played for throughout their careers! Test your baseball knowledge and see if you can correctly place each team in the right slot.

Features
--------------------------------
- Interactive Gameplay: Drag and drop team logos into designated slots for each player.

- Real-Time Feedback: Get immediate visual feedback for correct, incorrect, and misplaced team selections.

- Dynamic Players: Generate a new set of players with the "Get New Players" button.

- Clear Board: Use the "Clear" button to reset all drop zones without changing the current players.

- Scoring System: Keep track of your progress and strive for perfection!

How to Play
-----------------------------
1. Start the Game:

- A list of MLB players will appear, along with empty drop zones for each team they've played for.

2. Drag and Drop:

- Drag team logos from the team list and drop them into the correct slots under each player.

3. Submit Your Answer:

- Click the "Submit" button to check your placements.

- If all placements are correct and the board is complete, a congratulatory message will appear.

4. Clear the Board (Optional):

- Click the "Clear" button to reset the drop zones without changing the current players.

5. Get New Players:

- Want a fresh challenge? Click the "Get New Players" button to load a new set of players.

6. Hard Mode (Optional):

- Toggle the "Hard Mode" switch for an extra challenge! In hard mode, you won't see how many teams each player has played for, and you can add as many teams as you want.

Running Locally
-----------------------------
To run this game on your own device, follow these steps:

### Option 1: Using Python (Recommended)

1. Clone or download this repository to your local machine

2. Open a terminal/command prompt and navigate to the project directory:
```bash
cd path/to/RosterRelay
```

3. Start a local HTTP server using Python 3:
```bash
python3 -m http.server 8000
```

4. Open your web browser and go to:
```
http://localhost:8000
```

### Option 2: Using Node.js

1. Navigate to the project directory in your terminal

2. Run the following command:
```bash
npx http-server -p 8000
```

3. Open your browser to:
```
http://localhost:8000
```

### Option 3: Using VS Code Live Server

1. Install the "Live Server" extension in VS Code

2. Right-click on `index.html` and select "Open with Live Server"

### Why a server is needed:
The game loads player data from `players.json` using JavaScript's `fetch()` API. Modern browsers block this for security reasons when opening HTML files directly (`file://`). Running a local server resolves this issue.

Technologies Used
----------------------------------------------
- HTML: Structure of the game board and elements.

- CSS: Styling for the board, buttons, and interactive feedback.

- JavaScript: Game logic, drag-and-drop functionality, and scoring.



Link to play (hosted by Netlify) **outdated**:
https://roster-relay.netlify.app/
