const board = document.getElementById('game-board');
const cells = document.querySelectorAll('.cell');
const resetButton = document.getElementById('reset');
const message = document.getElementById('message');
const gameModeBtns = document.querySelectorAll('.game-mode-btn');

let currentPlayer = 'X';
let gameActive = true;
let boardState = ['', '', '', '', '', '', '', '', ''];
let aiEnabled = false;
let gameMode = '';

const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],  // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],  // columns
    [0, 4, 8], [2, 4, 6]               // diagonals
];

function startGame(mode) {
    gameMode = mode;
    aiEnabled = mode === 'AI';
    resetGame();
    toggleGameMode();
}

function handleCellClick(index) {
    if (!gameActive || boardState[index] !== '') return;

    boardState[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add('taken');

    if (checkWin()) {
        message.textContent = `${currentPlayer} wins!`;
        highlightWinningCombination();
        gameActive = false;
    } else if (boardState.every(cell => cell !== '')) {
        message.textContent = "It's a draw!";
        gameActive = false;
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (aiEnabled && currentPlayer === 'O') {
            setTimeout(() => aiMove(), 500);
        }
    }
}

function checkWin() {
    return winPatterns.some(pattern => {
        const [a, b, c] = pattern;
        return boardState[a] === currentPlayer && boardState[b] === currentPlayer && boardState[c] === currentPlayer;
    });
}

function highlightWinningCombination() {
    const winningPattern = winPatterns.find(pattern => {
        const [a, b, c] = pattern;
        return boardState[a] === currentPlayer && boardState[b] === currentPlayer && boardState[c] === currentPlayer;
    });

    const [a, b, c] = winningPattern;
    cells[a].classList.add('winner');
    cells[b].classList.add('winner');
    cells[c].classList.add('winner');
}

function aiMove() {
    const availableMoves = boardState.map((value, index) => value === '' ? index : null).filter(index => index !== null);
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    handleCellClick(randomMove);
}

function resetGame() {
    boardState = ['', '', '', '', '', '', '', '', ''];
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('taken', 'winner');
    });
    currentPlayer = 'X';
    gameActive = true;
    message.textContent = '';
}

function toggleGameMode() {
    document.querySelector('.game-mode').style.display = 'none';
    board.style.display = 'grid';
}

gameModeBtns.forEach(button => {
    button.addEventListener('click', () => startGame(button.id === 'player-vs-ai' ? 'AI' : 'PvP'));
});

cells.forEach((cell, index) => {
    cell.addEventListener('click', () => handleCellClick(index));
});

resetButton.addEventListener('click', resetGame);

