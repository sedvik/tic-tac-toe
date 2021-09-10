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
    function isDone(symbol, numTurns) {
        // Check if all possible turns have been played
        if (numTurns >= 9) {
            return true;
        }
        // Top row
        if (_state[0][0] === symbol && _state[0][1] === symbol && _state[0][2] === symbol) {
            return true;
        }
        // Middle row
        else if (_state[1][0] === symbol && _state[1][1] === symbol && _state[1][2] === symbol) {
            return true;
        }
        // Bottom row
        else if (_state[2][0] === symbol && _state[2][1] === symbol && _state[2][2] === symbol) {
            return true;
        }
        // First col
        else if (_state[0][0] === symbol && _state[1][0] === symbol && _state[2][0] === symbol) {
            return true;
        }
        // Second col
        else if (_state[0][1] === symbol && _state[1][1] === symbol && _state[2][1] === symbol) {
            return true;
        }
        // Third Col
        else if (_state[0][2] === symbol && _state[1][2] === symbol && _state[2][2] === symbol) {
            return true;
        }
        // Top left to Bottom right
        else if (_state[0][0] === symbol && _state[1][1] === symbol && _state[2][2] === symbol) {
            return true;
        }
        // Bottom left to top right
        else if (_state[2][0] === symbol && _state[1][1] === symbol && _state[0][2] === symbol) {
            return true;
        }
        // No winning combinations found
        else {
            return false;
        }
    }
    
    // addSymbol function - adds symbol to the board, adds a turn, calls render, checks if the game is done, and switches the active player
    function addSymbol(symbol, row, col) {
        _state[row][col] = symbol;
        game.addTurn();
        const numTurns = game.getNumTurns();
        displayController.render(_state);
        if (isDone(symbol, numTurns)) {
            return game.complete();
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

    // Replaces player form input with a display with accepted player information
    function displayPlayerInfo(players) {

    }

    // changeButtonText function - Switches the button text from "Start" to "Reset"
    function changeButtonText() {
        const button = document.querySelector('#start-reset');
        button.textContent = 'Reset';
    }

    return {
        init,
        render,
        displayOutcome,
        changeButtonText,
        displayPlayerInfo
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
        // Create player objects
        _players.player1 = playerFactory('Skyler', 'X');
        _players.player2 = playerFactory('Lauren', 'O');

        // Assign an initial active player based on the player that has symbol 'X'
        if (_players.player1.getSymbol() === 'X') {
            _activePlayer = _players.player1;
        } else {
            _activePlayer = _players.player2;
        }

        // Initialize game board
        displayController.init(gameBoard.getState());

        // Assign initial event listeners to DOM
        events.assignInitial();
    }

    // start function - game start logic
    function start() {
        // Change start button to reset button
        events.assignGameStart();
        displayController.changeButtonText();

        // Display player info
        displayController.displayPlayerInfo(_players);
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
    function getOutcome() {
        let outcome;
        // Tie game if _numTurns is 9
        if (_numTurns === 9) {
            outcome = "It's a tie!";
        }
        // Otherwise the current active player was the last to make a move and get a winning combination
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
    function complete() {
        // Unbind event listeners from board spaces
        events.assignGameEnd();

        // Display the game outcome
        const outcome = getOutcome();
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