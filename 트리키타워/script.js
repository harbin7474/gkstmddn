const canvas = document.getElementById('tetris');
const context = canvas.getContext('2d');
context.scale(20, 20);

let board = Array.from({ length: 20 }, () => Array(10).fill(0));
let score = 0;

const colors = [
    null,
    'cyan',   // I
    'purple', // T
    'red',    // Z
    'green',  // S
    'yellow', // O
    'blue',   // J
    'orange',  // L
    'black'   // Bomb
];

const pieces = [
    [[1, 1, 1, 1]], // I
    [[1, 1, 1], [0, 1, 0]], // T
    [[1, 1, 0], [0, 1, 1]], // Z
    [[0, 1, 1], [1, 1, 0]], // S
    [[1, 1], [1, 1]], // O
    [[0, 1, 0], [0, 1, 1], [0, 0, 1]], // J
    [[0, 1, 1], [1, 1, 0], [0, 0, 0]], // L
    [[1]] // Bomb
];

let currentPiece = createPiece();

function createPiece() {
    const typeIndex = Math.floor(Math.random() * (pieces.length + 1)); // 폭탄 추가
    if (typeIndex === pieces.length) {
        return { shape: pieces[typeIndex], color: colors[typeIndex + 1], x: 4, y: 0, isBomb: true };
    }
    return { shape: pieces[typeIndex], color: colors[typeIndex + 1], x: 4, y: 0, isBomb: false };
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBoard();
    drawPiece(currentPiece);
    drawScore();
}

function drawBoard() {
    board.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = colors[value];
                context.fillRect(x, y, 1, 1);
            }
        });
    });
}

function drawPiece(piece) {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                context.fillStyle = piece.color;
                context.fillRect(piece.x + x, piece.y + y, 1, 1);
            }
        });
    });
}

function drawScore() {
    context.fillStyle = 'white';
    context.font = '1px Arial';
    context.fillText(`점수: ${score}`, 0.5, 0.5);
}

function update() {
    currentPiece.y++;
    if (collision()) {
        currentPiece.y--;
        merge();
        if (currentPiece.isBomb) {
            clearSurrounding(currentPiece.x, currentPiece.y);
        } else {
            const rowsCleared = clearRows();
            score += rowsCleared * 100;
        }
        currentPiece = createPiece();
        if (collision()) {
            alert('게임 오버! 점수: ' + score);
            resetGame();
        }
    }
    draw();
}

function collision() {
    return currentPiece.shape.some((row, y) =>
        row.some((value, x) => {
            return value && (board[currentPiece.y + y] && board[currentPiece.y + y][currentPiece.x + x]) !== 0;
        })
    );
}

function merge() {
    currentPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value) {
                board[currentPiece.y + y][currentPiece.x + x] = colors.indexOf(currentPiece.color);
            }
        });
    });
}

function clearRows() {
    let rowsCleared = 0;
    for (let y = board.length - 1; y >= 0; y--) {
        if (board[y].every(value => value !== 0)) {
            board.splice(y, 1);
            board.unshift(Array(10).fill(0));
            rowsCleared++;
        }
    }
    return rowsCleared;
}

function clearSurrounding(x, y) {
    const positionsToClear = [
        [x, y],
        [x - 1, y],
        [x + 1, y],
        [x, y - 1],
        [x, y + 1],
        [x - 1, y - 1],
        [x + 1, y - 1],
        [x - 1, y + 1],
        [x + 1, y + 1]
    ];

    positionsToClear.forEach(([px, py]) => {
        if (board[py] && board[py][px] !== undefined) {
            board[py][px] = 0;
        }
    });
}

function resetGame() {
    board = Array.from({ length: 20 }, () => Array(10).fill(0));
    score = 0;
    currentPiece = createPiece();
}

function rotate(piece) {
    const rotatedShape = piece.shape[0].map((_, index) => piece.shape.map(row => row[index]).reverse());
    return { ...piece, shape: rotatedShape };
}

function move(direction) {
    currentPiece.x += direction;
    if (collision()) {
        currentPiece.x -= direction;
    }
}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowLeft':
            move(-1);
            break;
        case 'ArrowRight':
            move(1);
            break;
        case 'ArrowDown':
            currentPiece.y++;
            if (collision()) {
                currentPiece.y--;
            }
            break;
        case 'ArrowUp':
            const rotatedPiece = rotate(currentPiece);
            if (!collision(rotatedPiece)) {
                currentPiece = rotatedPiece;
            }
            break;
    }
});

setInterval(update, 1000);