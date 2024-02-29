const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const TETROMINO_NAMES = ['O', 'J', 'L', 'I', 'S', 'Z', 'T']
const TETROMINOES = {
    'O': [
        [1, 1],
        [1, 1]
    ],
    'J': [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    'L': [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
    ],
    'I': [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    'S': [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    'Z': [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    'T': [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
    ]

}
const scoreElement = document.querySelector('.score');
const linesElement = document.querySelector('.lines');


function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

let playfield;
let tetromino;
let score = 0;
let lines = 0;

function counterScore(destrLines) {

    switch (destrLines) {
        case 1:
            score += 10;
            lines += 1;
            break;
        case 2:
            score += 30;
            lines += 2;
            break;
        case 3:
            score += 50;
            lines += 3;
            break;
        case 4:
            score += 100;
            lines += 4;
            break;
    }
    scoreElement.innerHTML = score;
    linesElement.innerHTML = lines;
}

function generatePlayField() {
    for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
        const div = document.createElement(`div`);
        document.querySelector('.grid').append(div);
    }
    playfield = new Array(PLAYFIELD_ROWS).fill()
        .map(() => new Array(PLAYFIELD_COLUMNS).fill(0))
    // console.table(playfield);
}

function generateRandomTerminoIndex(arr) {
    return Math.floor(Math.random() * arr.length)
}

function generateTetromino() {

    const name = TETROMINO_NAMES[generateRandomTerminoIndex(TETROMINO_NAMES)];
    const matrix = TETROMINOES[name];
    //console.log('matrix', matrix);
    tetromino = {
        name,
        matrix,
        row: -2,
        column: Math.floor((PLAYFIELD_COLUMNS - matrix.length) / 2)
    }
}

function placeTetromino() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if(tetromino.matrix[row][column]) {
                playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
            }
        }
    }

    const filledRows = findFilledRows();
    removeFillRows(filledRows);
    generateTetromino();
    counterScore(filledRows.length);
}


function removeFillRows(filledRows) {
    for (let i = 0; i < filledRows.length; i++) {
        const row = filledRows[i]
        dropRowsAbove(row);
    }
}

function dropRowsAbove(rowDelete) {
    for (let row = rowDelete; row > 0; row--) {
        playfield[row] = playfield[row - 1]
    }
    playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}

function findFilledRows() {
    const fillRows = [];
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        let filledColumns = 0;
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if(playfield[row][column] != 0) {
                filledColumns++
            }
        }
        if(PLAYFIELD_COLUMNS === filledColumns) {
            fillRows.push(row)
        }
    }
    return fillRows;
}

generatePlayField();
generateTetromino();

const cells = document.querySelectorAll('.grid div');

function drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if(playfield[row][column] == 0) continue;

            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            // console.log(cellIndex);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawTetromino() {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
            //посмотреть как работает rotateMatrix()!!!
            /*const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
            );
            cells[cellIndex].innerHTML = showRotated[row][column];*/
            if(isOutsideOfTopboard(row)) continue;
            if(!tetromino.matrix[row][column]) continue;
            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
            );
            cells[cellIndex].classList.add(name);
        }
    }
}

function draw() {
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayField();
    drawTetromino();
}

function rotateTetromino() {
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    /*showRotated = rotateMatrix(showRotated);*/
    tetromino.matrix = rotatedMatrix;
    if(!isValid()) {
        tetromino.matrix = oldMatrix;
    }
}

draw();

function rotate() {
    rotateTetromino();
    draw()
}

document.addEventListener('keydown', onKeyDown);

function onKeyDown(e) {
    if(e.key === 'Escape') {
        togglePauseGame();
    }
    if(!isPaused) {
        switch (e.key) {
            case 'ArrowUp':
                rotate();
                break;
            case 'ArrowDown':
                moveTetrominoDown();
                break;
            case 'ArrowLeft':
                moveTetrominoLeft();
                break;
            case 'ArrowRight':
                moveTetrominoRight();
                break;
            case ' ':
                dropTetraminoDown();
                break;
        }
    }
    draw();
}

function dropTetraminoDown() {
    while (isValid()) {
        tetromino.row++;
    }
    tetromino.row--;
}

const overlay = document.querySelector('.overlay')

function gameOver() {
    stopLoop();
    overlay.style.display = 'flex'
}

function rotateMatrix(matrixTetromino) {
    const N = matrixTetromino.length;
    const rotateMatrix = [];
    for (let i = 0; i < N; i++) {
        rotateMatrix[i] = []
        for (let j = 0; j < N; j++) {
            rotateMatrix[i][j] = matrixTetromino[N - j - 1][i]
        }
    }
    return rotateMatrix
}

function moveTetrominoDown() {
    tetromino.row++;
    if(!isValid()) {
        tetromino.row--;
        placeTetromino();
    }
}

function moveTetrominoLeft() {
    tetromino.column--;
    if(!isValid()) {
        tetromino.column++
    }
}

function moveTetrominoRight() {
    tetromino.column++;
    if(!isValid()) {
        tetromino.column--;
    }
}

function moveDown() {
    moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();
}

let isGameOver = false
let timedId = null
moveDown();

function startLoop() {
    timedId = setTimeout(() => {
        requestAnimationFrame(moveDown)
    }, 700)

}

function stopLoop() {
    cancelAnimationFrame(timedId);
    clearTimeout(timedId);
    timedId = null
}

let isPaused = false;

function togglePauseGame() {
    if(isPaused === false) {
        stopLoop()
    } else {
        startLoop()
    }
    isPaused = !isPaused;
}

function isValid() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            /*if(tetromino.matrix[row][column]) continue;*/
            if(isOutsideOfGameboard(row, column)) {
                return false
            }
            if(hasCollisions(row, column)) {
                return false
            }
        }
    }
    return true
}

function isOutsideOfTopboard(row) {
    return tetromino.row + row < 0;
}

function isOutsideOfGameboard(row, column) {
    return tetromino.matrix[row][column]
        && (tetromino.column + column < 0
            || tetromino.column + column >= PLAYFIELD_COLUMNS
            || tetromino.row + row >= PLAYFIELD_ROWS);
}

function hasCollisions(row, column) {
    return tetromino.matrix[row][column]
        && playfield[tetromino.row + row]?.[tetromino.column + column];
}

