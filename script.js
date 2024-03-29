const PLAYFIELD_COLUMNS = 10;
const PLAYFIELD_ROWS = 20;
const btnRestart = document.querySelector('.btn-restart');
const scoreElement = document.querySelector('.score');
const linesElement = document.querySelector('.lines');
const levelElement = document.querySelector('.level');
const overlay = document.querySelector('.overlay');
const pause = document.querySelector('.overlay.pause');
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
const hourElement = document.querySelector('.hours')
const minuteElement = document.querySelector('.minutes')
const secondElement = document.querySelector('.seconds')

const btnPause = document.querySelector('#pause')
const btnReset = document.querySelector('#restart')
const btnDrop = document.querySelector('#drop')
const btnUp = document.querySelector('.arrow-container.up')
const btnLeft = document.querySelector('.arrow-container.left')
const btnRight = document.querySelector('.arrow-container.right')
const btnDown = document.querySelector('.arrow-container.down')
const pauseExit = document.querySelector('.overlay.pause')
const hiScore = document.querySelector('.hiScore')

let playfield,
    tetromino,
    score = 0,
    tempScore = 0,
    lines = 0,
    level = 0,
    isGameOver = false,
    timedId = null,
    isPaused = false,
    cells,
    gameSpeed = 700,
    hour = 0,
    minute = 0,
    second = 0,
    interval,
    hiScoreInfo

init();


function init() {
    isGameOver = false;
    clearTimer()
    intrvl();
    hiScoreInfo = localStorage.getItem('hiScore')
    hiScoreInfo ? hiScore.innerHTML = hiScoreInfo : hiScore.innerHTML = "0";
    generatePlayField();
    generateTetromino();
    cells = document.querySelectorAll('.grid div');
    moveDown();
}

function clearTimer() {
    hour = 0
    minute = 0
    second = 0
    hourElement.innerText = 0
    minuteElement.innerText = ':00'
    secondElement.innerText = ':00'
}

function intrvl() {
    clearInterval(interval);
    interval = setInterval(timer, 1000)

}

function timer() {
    second++
    if(second < 10) {
        secondElement.innerText = `:0${second}`
    }
    if(second > 9) {
        secondElement.innerText = `:${second}`
    }
    if(second > 59) {
        minute++
        minuteElement.innerText = `:0${minute}`
        second = 0
        secondElement.innerText = '00'
    }
    if(minute < 10) {
        minuteElement.innerText = `:0${minute}`
    }
    if(minute > 9) {
        minuteElement.innerText = `:${minute}`
    }
    if(minute > 59) {
        hour++
        hourElement.innerText = hour
        minute = 0
        minuteElement.innerText = "00"
        secondElement.innerText = '00'

    }
}

function restart() {
    document.querySelector('.grid').innerHTML = '';
    overlay.style.display = "none";
    init();
    levelElement.innerHTML = '0';
    scoreElement.innerHTML = '0';
    linesElement.innerHTML = '0';
    score = 0;
    lines = 0;
    level = 0;
    tempScore = 0;
    gameSpeed = 700;
    this.blur()
}

btnRestart.addEventListener('click', () => restart())
btnPause.addEventListener('click', () => {
    console.log('pause button')
    togglePauseGame()
})

pauseExit.addEventListener('click', () => {
    togglePauseGame()
})
btnReset.addEventListener('click', () => {
    restart()

})
btnDrop.addEventListener('click', () => {
    console.log('Space')
    dropTetrominoDown()

})
btnUp.addEventListener('click', () => {
    if(!isPaused) {
        rotate()

    }
})
btnLeft.addEventListener('click', () => {
    if(!isPaused) {
        moveTetrominoLeft()

    }
})
btnDown.addEventListener('click', () => {
    if(!isPaused) {
        moveTetrominoDown()

    }
})
btnRight.addEventListener('click', () => {
    if(!isPaused) {
        moveTetrominoRight()

    }
})

function convertPositionToIndex(row, column) {
    return row * PLAYFIELD_COLUMNS + column;
}

function checkLevel() {
    if(tempScore / 100 >= 1) {
        gameSpeed -= 50;
        tempScore = 0;
        level += 1;
    }
}

function counterScore(destrLines) {

    switch (destrLines) {
        case 1:
            score += 10;
            tempScore += 10;
            lines += 1;
            checkLevel()
            break;
        case 2:
            score += 30;
            tempScore += 30;
            lines += 2;
            checkLevel()
            break;
        case 3:
            score += 50;
            tempScore += 50;
            lines += 3;
            checkLevel()
            break;
        case 4:
            score += 100;
            tempScore += 100;
            lines += 4;
            checkLevel()
            break;
    }

    scoreElement.innerHTML = score;
    linesElement.innerHTML = lines;
    levelElement.innerHTML = level;
}

function generatePlayField() {
    for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
        const div = document.createElement(`div`);
        document.querySelector('.grid').append(div);
    }
    playfield = new Array(PLAYFIELD_ROWS).fill()
        .map(() => new Array(PLAYFIELD_COLUMNS).fill(0))
}

function generateRandomTetrominoIndex(arr) {
    return Math.floor(Math.random() * arr.length)
}

function generateTetromino() {

    const name = TETROMINO_NAMES[generateRandomTetrominoIndex(TETROMINO_NAMES)];
    const matrix = TETROMINOES[name];
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
            if(isOutsideOfTopboard(row)) {
                isGameOver = true;
                return;
            }
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
            if(playfield[row][column] !== 0) {
                filledColumns++
            }
        }
        if(PLAYFIELD_COLUMNS === filledColumns) {
            fillRows.push(row)
        }
    }
    return fillRows;
}

function drawPlayField() {
    for (let row = 0; row < PLAYFIELD_ROWS; row++) {
        for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
            if(playfield[row][column] === 0) continue;
            const name = playfield[row][column];
            const cellIndex = convertPositionToIndex(row, column);
            cells[cellIndex].classList.add(name);
        }
    }
}

function drawTetromino() {
    const name = tetromino.name;
    const tetrominoMatrixSize = tetromino.matrix.length;

    for (let row = 0; row < tetrominoMatrixSize; row++) {
        for (let column = 0; column < tetrominoMatrixSize; column++) {
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
    tetromino.matrix = rotateMatrix(tetromino.matrix);
    if(!isValid()) {
        tetromino.matrix = oldMatrix;
    }
}

draw();

document.addEventListener('keydown', onKeyDown);

function onKeyDown(e) {
    if(e.key === 'Escape') {
        e.target.blur()
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
                dropTetrominoDown();
                break;
            default:
                break;
        }
    }
    draw();
}

function dropTetrominoDown() {
    while (isValid()) {
        tetromino.row++;
    }
    tetromino.row--;
    draw();
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

function rotate() {
    rotateTetromino();
    draw()
}

function moveTetrominoDown() {
    tetromino.row++;
    if(!isValid()) {
        tetromino.row--;
        placeTetromino();
    }
    draw();
}

function moveTetrominoLeft() {
    tetromino.column--;
    if(!isValid()) {
        tetromino.column++
    }
    draw();
}

function moveTetrominoRight() {
    tetromino.column++;
    if(!isValid()) {
        tetromino.column--;
    }
    draw();
}

function moveDown() {
    moveTetrominoDown();
    draw();
    stopLoop();
    startLoop();
    if(isGameOver) {
        gameOver()
    }
}

function gameOver() {
    stopLoop();
    overlay.style.display = 'flex';
    (hiScoreInfo < score) ? localStorage.setItem('hiScore', score) : null;
}

moveDown();

function startLoop() {
    if(!timedId) {
        timedId = setTimeout(() => {
            requestAnimationFrame(moveDown)
        }, gameSpeed)
    }
    this.blur()
}

function stopLoop() {
    cancelAnimationFrame(timedId);
    clearTimeout(timedId);
    timedId = null
}

function togglePauseGame() {
    isPaused = !isPaused;
    isPaused ? stopLoop() : startLoop()
    isPaused ? pause.style.display = 'flex' : pause.style.display = 'none';
    console.log(isPaused)
    this.blur()
}

function isValid() {
    const matrixSize = tetromino.matrix.length;
    for (let row = 0; row < matrixSize; row++) {
        for (let column = 0; column < matrixSize; column++) {
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

