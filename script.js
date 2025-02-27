const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartButton = document.getElementById('restart');

let board = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X'; // Start with Player X
let gameActive = true;

// Winning combinations
const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Handle cell click event
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = Array.from(cells).indexOf(clickedCell);

    // Ignore clicks on filled cells or if the game is over
    if (board[clickedCellIndex] !== '' || !gameActive) {
        return;
    }

    // Update the board and UI
    board[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer); // Adds color class

    // Check for result after player's move
    checkResult();

    // Switch players if the game is still active
    if (gameActive) {
        setTimeout(computerMove, 500); // Delay for computer move
    }
}

function computerMove() {
    if (!gameActive) return;

    // Check for a winning move
    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] === 'O' && board[b] === 'O' && board[c] === '') {
            makeMove(c);
            return;
        }
        if (board[a] === 'O' && board[c] === 'O' && board[b] === '') {
            makeMove(b);
            return;
        }
        if (board[b] === 'O' && board[c] === 'O' && board[a] === '') {
            makeMove(a);
            return;
        }
    }

    // Block player's winning move
    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] === 'X' && board[b] === 'X' && board[c] === '') {
            makeMove(c);
            return;
        }
        if (board[a] === 'X' && board[c] === 'X' && board[b] === '') {
            makeMove(b);
            return;
        }
        if (board[b] === 'X' && board[c] === 'X' && board[a] === '') {
            makeMove(a);
            return;
        }
    }

    // Random move if no immediate win or block is available
    const emptyCells = board.map((cell, index) => (cell === '' ? index : null)).filter(val => val !== null);
    if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        makeMove(emptyCells[randomIndex]);
    }
}

function makeMove(index) {
    board[index] = 'O';
    cells[index].textContent = 'O';
    cells[index].classList.add('O'); // Adds color class
    checkResult();

    // Switch back to player X
    if (gameActive) {
        currentPlayer = 'X';
        statusDisplay.textContent = `Player ${currentPlayer}'s turn`;
    }
}

function checkResult() {
    const winner = checkWinner();
    if (winner) {
        gameActive = false;
        statusDisplay.textContent = `${winner} wins! 🎉`;
        return;
    }

    // Check for draw
    if (!board.includes('')) {
        statusDisplay.textContent = "It's a draw! 😲";
        gameActive = false;
    }
}

function checkWinner() {
    for (let combo of winningCombos) {
        const [a, b, c] = combo;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a]; // Return the winning player ('X' or 'O')
        }
    }
    return null; // No winner yet
}

function restartGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X'; // Reset to Player X
    statusDisplay.textContent = `Player X's turn`;

    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('X', 'O'); // Remove color classes
    });
}

// Event Listeners
cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartButton.addEventListener('click', restartGame);
