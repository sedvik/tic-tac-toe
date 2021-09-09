// gameBoard module - contains logic related to the game board
const gameBoard = (function() {
    // state array - contains game board state
    const _state = [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ];
    function getState() {
        return _state;
    }

    return {
        getState
    };
})();

// displayController module - contains DOM manipulation logic
const displayController = (function() {

    return {

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
    return {
        getName,
        getSymbol
    };
}
