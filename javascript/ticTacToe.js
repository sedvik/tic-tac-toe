// gameBoard module - contains logic related to the game board
const gameBoard = (function() {
    // state array - contains game board state
    let _state = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    
    function getState() {
        return _state;
    }
    
    function resetState() {
        _state = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        displayController.render(_state);
    }

    // isDone function - checks if the symbol has a winning combination on the game board and whether numTurns is >= 9, meaning the board is full
    // Returns an object in the format { gameFinished: BOOLEAN, hasWinner: BOOLEAN }
    function isDone(symbol, numTurns) {
        let gameFinished;
        let hasWinner;
        // Top row
        if (_state[0][0] === symbol && _state[0][1] === symbol && _state[0][2] === symbol) {
            gameFinished = true;
            hasWinner = true;
        }
        // Middle row
        else if (_state[1][0] === symbol && _state[1][1] === symbol && _state[1][2] === symbol) {
            gameFinished = true;
            hasWinner = true;
        }
        // Bottom row
        else if (_state[2][0] === symbol && _state[2][1] === symbol && _state[2][2] === symbol) {
            gameFinished = true;
            hasWinner = true;
        }
        // First col
        else if (_state[0][0] === symbol && _state[1][0] === symbol && _state[2][0] === symbol) {
            gameFinished = true;
            hasWinner = true;
        }
        // Second col
        else if (_state[0][1] === symbol && _state[1][1] === symbol && _state[2][1] === symbol) {
            gameFinished = true;
            hasWinner = true;
        }
        // Third Col
        else if (_state[0][2] === symbol && _state[1][2] === symbol && _state[2][2] === symbol) {
            gameFinished = true;
            hasWinner = true;
        }
        // Top left to Bottom right
        else if (_state[0][0] === symbol && _state[1][1] === symbol && _state[2][2] === symbol) {
            gameFinished = true;
            hasWinner = true;
        }
        // Bottom left to top right
        else if (_state[2][0] === symbol && _state[1][1] === symbol && _state[0][2] === symbol) {
            gameFinished = true;
            hasWinner = true;
        }
        // If none of the above win conditions were met and 9 turns have been played, the game is done
        else if (numTurns >= 9) {
            gameFinished = true;
            hasWinner = false;
        }
        // No winning combinations found
        else {
            gameFinished = false;
            hasWinner = false;
        }

        return {
            gameFinished,
            hasWinner
        };
    }
    
    // addSymbol function - adds symbol to the board, adds a turn, calls render, checks if the game is done, and switches the active player
    function addSymbol(symbol, row, col) {
        _state[row][col] = symbol;
        game.addTurn();
        const numTurns = game.getNumTurns();
        displayController.render(_state);
        const { gameFinished, hasWinner } = isDone(symbol, numTurns);
        if (gameFinished) {
            return game.complete(hasWinner);
        }
        game.switchPlayer();
    }

    // isEmpty function - Returns true if a specified game space is empty
    function isEmpty(row, col) {
        return _state[row][col] === '';
    }

    return {
        getState,
        resetState,
        addSymbol,
        isEmpty
    };
})();

// displayController module - contains  DOM manipulation logic
const displayController = (function() {
    // init function - sets up initial game board html
    function init(gameState) {
        const boardContainer = document.querySelector('#board-container');
        // Add a board space div for all 9 board spaces
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const boardSpace = document.createElement('div');
                boardSpace.classList.add('board-space')
                boardSpace.setAttribute('data-row', row);
                boardSpace.setAttribute('data-col', col);
                boardSpace.textContent = gameState[row][col];
                boardContainer.appendChild(boardSpace);
            }
        }
    }
    
    function render(gameState) {
        // Populate DOM elements with symbols from gameState array
        const boardSpaces = document.querySelectorAll('.board-space');
        boardSpaces.forEach(boardSpace => {
            const row = boardSpace.getAttribute('data-row');
            const col = boardSpace.getAttribute('data-col');
            boardSpace.textContent = gameState[row][col];
        });
    }

    function displayOutcome(outcome) {
        const outcomeDiv = document.querySelector('#outcome-display');
        outcomeDiv.textContent = outcome;
    }

    // removePlayerForm function - Clears player-info-container div
    function removePlayerForm() {
        const playerInfoContainer = document.querySelector('#player-info-container');
        playerInfoContainer.textContent = '';
    }

    // createPlayerInfoDiv function - creates a div that displays a player's information
    function createPlayerInfoDiv(player, playerNum) {
        const playerInfoDiv = document.createElement('div');
        playerInfoDiv.classList.add('player-info');

        const h2 = document.createElement('h2');
        h2.textContent = `Player ${playerNum}`;

        const nameH3 = document.createElement('h3');
        nameH3.textContent = 'Name';

        const nameP = document.createElement('p');
        nameP.classList.add('player-name');
        nameP.textContent = `${player.getName()}`;

        const symbolH3 = document.createElement('h3');
        symbolH3.textContent = 'Symbol';

        const symbolP = document.createElement('p');
        symbolP.classList.add('player-symbol');
        symbolP.textContent = `${player.getSymbol()}`;

        const childElements = [h2, nameH3, nameP, symbolH3, symbolP];
        childElements.forEach(child => {
            playerInfoDiv.appendChild(child);
        });

        return playerInfoDiv;
    }
    
    // Replaces player form input with a display with accepted player information
    function displayPlayerInfo(players) {
        const player1InfoDiv = createPlayerInfoDiv(players.player1, 1);
        const player2InfoDiv = createPlayerInfoDiv(players.player2, 2);
        const playerInfoContainer = document.querySelector('#player-info-container');
        playerInfoContainer.appendChild(player1InfoDiv);
        playerInfoContainer.appendChild(player2InfoDiv);
    }

    // changeButtonText function - Switches the button text from "Start" to "Reset"
    function changeButtonText() {
        const button = document.querySelector('#start-reset');
        button.textContent = 'Reset';
    }

    // showBoard function - toggles the visibility of the game board
    function showBoard() {
        const board = document.querySelector('#board-container');
        board.style.display = 'grid';
    }

    return {
        init,
        render,
        displayOutcome,
        changeButtonText,
        removePlayerForm,
        displayPlayerInfo,
        showBoard
    };
})();

// events module - contains page event handlers
const events = (function() {
    // handleSpaceClick function - causes the activePlayer to play at the selected space
    function handleSpaceClick(e) {
        const boardSpace = e.target;
        const row = parseInt(boardSpace.getAttribute('data-row'));
        const col = parseInt(boardSpace.getAttribute('data-col'));
        const activePlayer = game.getActivePlayer();
        activePlayer.play(row, col);
    }

    // handleRadioClick function - Automatically switches the symbol radio button for the other player on change
    function handleRadioClick(e) {
        const clickedRadioId = e.target.id;
        // Determine the id of opposite radio button that must be selected
        let opponentRadioId;
        if (clickedRadioId === 'p1-symbol-x') {
            opponentRadioId = 'p2-symbol-o';
        } else if (clickedRadioId === 'p1-symbol-o') {
            opponentRadioId = 'p2-symbol-x';
        } else if (clickedRadioId === 'p2-symbol-x') {
            opponentRadioId = 'p1-symbol-o';
        } else {
            opponentRadioId = 'p1-symbol-x';
        }
        const opponentRadio = document.querySelector(`#${opponentRadioId}`);
        opponentRadio.click();
    }

    // handleStartClick function - Starts the game after checking that required inputs were filled in
    function handleStartClick() {
        // Check that player1 and player2 name and symbols were input
        const playerNameInputs = Array.from(document.querySelectorAll('input[type="text"]'));
        const validNameInputs = playerNameInputs.every(input => {
            return input.value !== '';
        });
        const playerSymbolInputs = Array.from(document.querySelectorAll('input[type="radio"]'));
        const validSymbolInputs = playerSymbolInputs.some(input => {
            return input.checked;
        });
        if (validNameInputs && validSymbolInputs) {
            game.start();
        } else {
            alert('Please ensure that all Player 1 and Player 2 fields are filled out');
        }
    }

    // handleResetClick function - resets the game
    function handleResetClick() {
        game.reset();
    }

    // assignBoardEvents function - add events listeners to boardSpace DOM elements
    function assignBoardEvents() {
        const boardSpaces = document.querySelectorAll('.board-space');
        boardSpaces.forEach(boardSpace => {
            boardSpace.addEventListener('click', handleSpaceClick);
        });
    }

    // removeBoardEvents function - removes boardSpace event listeners from DOM after game completion
    function removeBoardEvents() {
        const boardSpaces = document.querySelectorAll('.board-space');
        boardSpaces.forEach(boardSpace => {
            boardSpace.removeEventListener('click', handleSpaceClick);
        });
    }

    // assignRadioEvents function - assigns event listeners to the player form radio buttons
    function assignRadioEvents() {
        const radioButtons = document.querySelectorAll('input[type="radio"]');
        radioButtons.forEach(button => {
            button.addEventListener('click', handleRadioClick);
        });
    }

    // assignStartButtonEvent function - assigns start button event listener
    function assignStartButtonEvent() {
        const startButton = document.querySelector('#start-reset');
        startButton.addEventListener('click', handleStartClick);
    }

    // assignResetButtonEvent function - removes previous start button event listener and assigns the reset button event listener
    function assignResetButtonEvent() {
        // Remove existing start button event listener
        const button = document.querySelector('#start-reset');
        button.removeEventListener('click', handleStartClick);
    
        // Add reset button event listener
        button.addEventListener('click', handleResetClick);
    }

    // assignInitial function - Wrapper function for initial page load event assignment
    function assignInitial() {
        assignRadioEvents();
        assignStartButtonEvent();
    }

    // assignGameStart function - Wrapper function for game start event assignment
    function assignGameStart() {
        assignBoardEvents();
        assignResetButtonEvent();
    }

    // assignEnd function - Wrapper function for game end event assignment
    function assignGameEnd() {
        removeBoardEvents();
    }

    return {
        assignInitial,
        assignGameStart,
        assignGameEnd
    };
})();

// game module - contains logic related to the flow of the game
const game = (function() {
    const _players = {};
    let _activePlayer;
    let _numTurns = 0;
    
    // switchPlayer function - Swaps the active player
    function switchPlayer() {
        if (_players.player1.getSymbol() === _activePlayer.getSymbol()) {
            _activePlayer = _players.player2;
        } else {
            _activePlayer = _players.player1;
        }
    }
    
    // init function - game initialization logic at page load
    function init() {
        // Initialize game board html
        displayController.init(gameBoard.getState());

        // Assign initial event listeners to DOM
        events.assignInitial();
    }

    // start function - game start logic
    function start() {
        // Create players from form information if they don't already exist
        if (_players.player1 === undefined || _players.player2 === undefined) {
            const player1Name = document.querySelector('#p1-name').value;
            const player2Name = document.querySelector('#p2-name').value;
            const player1Symbol = document.querySelector('input[name="p1-symbol"]:checked').value;
            const player2Symbol = document.querySelector('input[name="p2-symbol"]:checked').value;
            _players.player1 = playerFactory(player1Name, player1Symbol);
            _players.player2 = playerFactory(player2Name, player2Symbol);
        }

        // Assign an initial active player based on the player that has symbol 'X'
        if (_players.player1.getSymbol() === 'X') {
            _activePlayer = _players.player1;
        } else {
            _activePlayer = _players.player2;
        }

        // Change start button to reset button
        events.assignGameStart();
        displayController.changeButtonText();

        // Hide form info and display input player info
        displayController.removePlayerForm();
        displayController.displayPlayerInfo(_players);

        // Show the board
        displayController.showBoard();
    }

    // reset function - resets game state and starts the game again
    function reset() {
        // reset the number of turns
        _numTurns = 0;
        
        // reset the gameBoard state
        gameBoard.resetState();

        // Display empty text in the outcome field
        displayController.displayOutcome('');

        // Call start method
        game.start();
    }

    // getOutcome function - returns text representing the outcome of the game
    function getOutcome(hasWinner) {
        let outcome;
        // Tie game if winner is null
        if (!hasWinner) {
            outcome = "It's a tie!";
        }
        // Otherwise, the current active player must have won since they went last
        else {
            outcome = `${_activePlayer.getName()} won!`;
        }
        return outcome;
    }

    function getActivePlayer() {
        return _activePlayer;
    }

    function getNumTurns() {
        return _numTurns;
    }

    function addTurn() {
        _numTurns += 1;
    }

    function getPlayers() {
        return _players;
    }

    // complete function - game completion logic
    function complete(hasWinner) {
        // Unbind event listeners from board spaces
        events.assignGameEnd();

        // Display the game outcome
        const outcome = getOutcome(hasWinner);
        displayController.displayOutcome(outcome);
    }

    return {
        init,
        start,
        getActivePlayer,
        getNumTurns,
        addTurn,
        switchPlayer,
        getPlayers,
        complete,
        reset
    };
})();

// player factory function - generates player objects
const playerFactory = function(name, symbol) {
    const _name = name;
    const _symbol = symbol;

    function getName() {
        return _name;
    }

    function getSymbol() {
        return _symbol;
    }

    function play(row, col) {
        if (gameBoard.isEmpty(row, col)) {
            gameBoard.addSymbol(_symbol, row, col);
        }
    }

    return {
        getName,
        getSymbol,
        play
    };
}

game.init();