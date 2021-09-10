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
            game.complete();
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

    return {
        init,
        render,
        displayOutcome
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

    // assignEvents function - add events listeners to DOM elements
    function assignEvents() {
        const boardSpaces = document.querySelectorAll('.board-space');
        boardSpaces.forEach(boardSpace => {
            boardSpace.addEventListener('click', handleSpaceClick);
        });
    }

    // removeEvents function - removes applicable event listeners from DOM after game completion
    function removeEvents() {
        const boardSpaces = document.querySelectorAll('.board-space');
        boardSpaces.forEach(boardSpace => {
            boardSpace.removeEventListener('click', handleSpaceClick);
        });
    }

    return {
        assignEvents,
        removeEvents
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
    
    // init function - game initialization logic
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

        // Assign event listeners to DOM
        events.assignEvents();
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

    // complete function - game completion logic
    function complete() {
        // Unbind event listeners from board spaces
        events.removeEvents();

        // Display the game outcome
        const outcome = getOutcome();
        displayController.displayOutcome(outcome);
    }

    return {
        init,
        getActivePlayer,
        getNumTurns,
        addTurn,
        switchPlayer,
        complete
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

// TEST CALLS
game.init();