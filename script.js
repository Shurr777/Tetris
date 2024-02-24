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
        [1, 1, 1],
        [1, 0, 0],
        [0, 0, 0]
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
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0]
    ]

}

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

let playfield;
let tetromino;

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
    console.log('matrix', matrix);
    tetromino = {
        name,
        matrix,
        row: 0,
        column: Math.floor((PLAYFIELD_COLUMNS - matrix.length) / 2)
    }
}

function placeTetromino() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if(tetromino)
                playfield[tetromino.row + row][tetromino.column + column] = tetromino.name;
        }
    }
    generateTetromino();
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
            if(!tetromino.matrix[row][column]) continue;
            const cellIndex = convertPositionToIndex(
                tetromino.row + row,
                tetromino.column + column
            );
            // console.log(cellIndex);
            cells[cellIndex].innerHTML = showRotated[row][column];
            cells[cellIndex].classList.add(name);
        }
        // column
    }
    // row
}

function draw() {
    cells.forEach(cell => cell.removeAttribute('class'));
    drawPlayField();
    drawTetromino();
}

let showRotated = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

function rotateTetromino() {
    const oldMatrix = tetromino.matrix;
    const rotatedMatrix = rotateMatrix(tetromino.matrix);
    showRotated = rotateMatrix(showRotated);
    tetromino.matrix = rotatedMatrix;
}
draw();

document.addEventListener('keydown', onKeyDown);

function onKeyDown(e) {
    switch (e.key) {
        case 'ArrowUp':
            rotateTetromino();
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
    }
    draw();
}

function rotateMatrix(matrixTetramino) {
    const N = matrixTetramino.length;
    const rotateMatrix = [];
    for (let i = 0; i < N; i++) {
        rotateMatrix[i] = []
        for (let j = 0; j < N; j++) {
            rotateMatrix[i][j] = matrixTetramino[N - j - 1][i]
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

function isValid() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
            if(tetromino.matrix[row][column]) continue;
            if(isOutsideOfGameboard(row, column)) {
                return false
            }
            if(hssCollisions(row, column)) {
                return false
            }
        }
    }
    return true
}

function isOutsideOfGameboard(row, column) {
    return tetromino.column + column < 0
        || tetromino.column + column >= PLAYFIELD_COLUMNS
        || tetromino.row + row >= PLAYFIELD_ROWS;
}

function hssCollisions(row, column) {
    return playfield[tetromino.row + row][tetromino.column + column];
}


/*
function clearField(){
    for(let row = PLAYFIELD_ROWS - 1; row > 0; row--){
        let r = 0;
        for(let column = 0; column < PLAYFIELD_COLUMNS; column++){
            if (playfield[row][column]) {r++};
        }
        if (r == PLAYFIELD_COLUMNS){
            console.log('CLEAR');
            playfield[row].fill(0);
            for(let row1 = row - 1; row1 > 0; row1--){
                playfield[row1 + 1] = playfield[row1];
            }
            row++;
        }
    }
};*/
