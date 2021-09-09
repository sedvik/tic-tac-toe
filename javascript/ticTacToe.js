// gameBoard module - contains logic related to the game board
const gameBoard = (function() {
    // state array - contains game board state
    let _state = [
        ['X', 'X', 'O'],
        ['O', 'O', 'X'],
        ['X', 'O', 'X']
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
    
    function addSymbol(symbol, row, col) {
        _state[row][col] = symbol;
        displayController.render(_state);
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

// displayController module - contains DOM manipulation logic
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

    return {
        init,
        render
    };
})();

// gameEvents instead potentially???
// gameDriver module - controls the flow of the game
const gameDriver = (function() {
    function init() {

    }
    return {

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
displayController.init(gameBoard.getState());
const player1 = playerFactory('Skyler', 'X');
const player2 = playerFactory('Lauren', 'O');