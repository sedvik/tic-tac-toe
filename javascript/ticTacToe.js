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
    }
    function addSymbol(symbol, row, col) {

    }

    return {
        getState,
        resetState,
        addSymbol
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
        // Loop through gameState array and populate DOM elements with appropriate symbol
    }

    return {
        init,
        render
    };
})();

// gameDriver module - controls the flow of the game
const gameDriver = (function() {

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
    function play() {

    }
    return {
        getName,
        getSymbol
    };
}

// TEST CALLS
displayController.init(gameBoard.getState());