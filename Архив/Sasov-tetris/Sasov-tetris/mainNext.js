// \/-- БЛОК ЗАДАНИЯ ПЕРЕМЕННЫХ --\/
// №1 задание размеров игрового поля через постоянные величины
const PLAYFIELD_COLUMNS = 15;
const PLAYFIELD_ROWS = 24;

// №2 задание фигур с переводом их в буквенные значения - создание массива данных фигур
const TETROMINO_NAMES = [
  "O", // квадрат
  "L", // кочерга с подальшим вращением
  "J", // обратная кочерга
  "S", // S
  "Z", // Z
  "T", // T
  "E", // короткая Т
  "I", // палка
  "Q", //точка
  "C", // C
];
const TETROMINOES = {
  // массивы матриц фигур
  O: [
    [1, 1],
    [1, 1],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
  ],
  E: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  Q: [[1]],
  C: [
    [1, 1, 1],
    [1, 0, 1],
    [0, 0, 0],
  ],
};

// №4 создание переменной в которой будут сберегаться все возможные варианты игрового поля
let playfield;
// №6 создание переменной игровых фигур
let tetromino;
// №10 задание постоянной для рисования игрового поля с ячейками для фигур
// const cells = document.querySelectorAll('.tetris div'); - после *№30 - меняем на переменную
let cells; // = document.querySelectorAll(".tetris div");
// console.log(cells);
// *№24 создание переменных, нужных для падения фигур
let timeoutId;
let requestId;
// *№23 переменная подсчета очков
let score; // = 0; - первоначальное значение
// *№27 переменная паузы в игре
let isPaused; // = false; // - первоначальное значение
const btnPausePlay = document.querySelector(".pause-play"); // *№33 - пауза через кнопку на ИнфоДоске
// *№12, *№22, *№28 Создание на ИнфоДоске клавиатуры перемещения фигур по полю
const btnRotate = document.querySelector(".Rotate"); // вращение фигуры
const btnLeft = document.querySelector(".Left"); // движение ВЛЕВО
const btnRight = document.querySelector(".Right"); // движение ВПРАВО
const btnDown = document.querySelector(".Down"); // движение ВНИЗ
const btnDropDown = document.querySelector(".DropDown"); // падение фигуры
// *№29 переменные окончания игры
let isGameOver; // = false; // переменная окончания игры - первоначальное значение
const gameOverBlock = document.querySelector(".game-over"); // обращение к div class='.game-over'
// *№30 фиксация нажатие кнопки RestartGame
const btnRestart = document.querySelector(".restart"); // перезапуск игры с поля GameOver
const btnRestartBoard = document.querySelector(".restartboard"); // *№33 - перезапуск игры c ИнфоДоски
// *№31 переменная для подсчета лучшего результата
let bestScore = document.querySelector('.bestscore'); // считывание class='.bestscore'
// bestScore = localStorage.setItem("bestscore", 0); // запись в хранилище "bestscore" 0-й - обнуление локального хранилища наилучшего результата при перезапуске игры
// *№32 переменная для задания скорости падения фигуры взависомости от очков
let speedDown; // = 700; // - первоначальное значение
let Level; // - задание переменной уровня сложности
// const btnLevelDown = document.querySelector(".LevelDown"); // кнопочное снижение уровня игры
// const btnLevelUp = document.querySelector(".LevelUp"); // кнопочное повышение уровня игры
// *№34 - задание переменных для Следующей Фигуры на ИнфоДоске
let playfieldNext; // поле следующей фигуры
let cellsNext; // ячейки поля NextFigure
let nameTetro = localStorage.setItem("nameTetro", 'O'); // нужно для самого первого запуска игры - запуск первой фигуры игры из локального хранилища
  // /\-- БЛОК ЗАДАНИЯ ПЕРЕМЕННЫХ --/\
  // localStorage.clear(); // очищение локального хранилища браузера - обнуление bestscore при перезапуске игры
  init(); // *№30 - перезапуск и начало игры

// \/-- БЛОК ИНСТРУКЦИЙ СОБЫТИЙ КЛАВИАТУРЫ - Keydown Events --\/
// №12 генерация клавиатуры управления движением фигуры
// контроль события нажатия клавиатуры
document.addEventListener("keydown", onKeyDown);
function onKeyDown(event) {
  // console.log(event);
  // *№28 - "пробел" - клавиша быстрого падения фигуры вниз
  // вариант записи, при котором устраняется баг-конфликт между "пробелом" и кнопками на ИнфоДоске
  if (event.key === " ") {
    event.preventDefault();
    dropTetrominoDown();
    return;
  }
  if (event.key === "Escape") { // №33 - вариант №1 реализация Restart-игры через клавишу "Esc"
    init();
  } 
  // switch (event.key) {   // №33 - вариант №2 реализация Restart-игры через клавишу "Esc"
  //    case "Escape":
  //    init();
  // }
  if ( //*№27 - включение паузы клавишей 'p' при любой комбинации регистра и языка
    event.key === "p" ||
    event.key === "P" ||
    event.key === "З" ||
    event.key === "з"
  ) {
    togglePauseGame();
  } 
  // *№27-вар№2- упрощенный вариант реализации паузы без задания нижестоящего условия
  if (isPaused) {
    return;
  }
  // if (!isPaused) { // *№27- вар№1 - подключение дополнительного условия для отключения клавиш движения при включенной паузе
  switch (event.key) {
    //  case " ": // *№28 (первоначальный вариант) - "пробел" - клавиша быстрого падения фигуры вниз
    //    event.preventDefault(); // стандартный метод - если событие не обрабатывается явно, его действие по умолчанию не должно выполняться так, как обычно ???
    //    dropTetrominoDown();
    //    break;
    case "ArrowDown": // стрелка вниз
      moveTetrominoDown();
      break;
    case "ArrowLeft": // стрелка влево
      moveTetrominoLeft();
      break;
    case "ArrowRight": // стрелка вправо
      moveTetrominoRight();
      break;
    case "ArrowUp": // стрелка вверх - поворот фигуры
      rotateTetromino();
      break;
    //    case "0":
    //      LevelDown();
    //      break;
    //    case "9":
    //      LevelUp();
    //      break;
  }
  // }
  draw();
}
// /\-- БЛОК ИНСТРУКЦИЙ СОБЫТИЙ КЛАВИАТУРЫ - Keydown Events --/\

// \/ -- БЛОК ИНСТРУКЦИЙ ДВИЖЕНИЯ ФИГУР и ЗАПУСКА ИГРЫ --\/
// *№12 инструкции движения по одной клеточке
btnDown.addEventListener("click", moveTetrominoDown); // движение ВНИЗ фигуры кнопкой с ИнфоДоски
function moveTetrominoDown() { // вниз по строкам
    tetromino.row += 1; 
  // if (isOutsideOfGameBoard() || // *№14 останов движения фигуры на нижней границе игрового поля
  // hasCollisions()) // + *№20 устранение наезда фигур друг на друга при движении по вертикали
  // прописание вышеуказанных функций после оптимизации *№21
  if (isValid()) {
    tetromino.row -= 1;
    placeTetromino();
  } // *№15 запуск функции при касании предыдущей фигуры нижней границы
}
btnLeft.addEventListener("click", moveTetrominoLeft); // движение ВЛЕВО фигуры кнопкой с ИнфоДоски
function moveTetrominoLeft() { // влево по столбцам
    tetromino.column -= 1;
  // if (isOutsideOfGameBoard() || // *№14 останов движения фигуры на левой границе игрового поля
  // hasCollisions())          // + *№20 устранение наезда фигур друг на друга при движении влево
  // прописание вышеуказанных функций после оптимизации *№21
  if (isValid()) {
    tetromino.column += 1;
  }
}
btnRight.addEventListener("click", moveTetrominoRight); // движение ВПРАВО фигуры кнопкой с ИнфоДоски
function moveTetrominoRight() { // вправо по столбцам
    tetromino.column += 1;
  // if (isOutsideOfGameBoard() || // *№14 останов движения фигуры на правой границе игрового поля
  // hasCollisions())          // + *№20 устранение наезда фигур друг на друга при движении вправо
  // прописание вышеуказанных функций после оптимизации *№21
  if (isValid()) {
    tetromino.column -= 1;
  }
}

// №22-УРОК №3 - реализация поворота фигур
btnRotate.addEventListener("click", rotateTetromino); // РОТАЦИЯ фигуры кнопкой с ИнфоДоски
function rotateTetromino() {
  // строка отвечает за прорисовку фигуры
  const oldMatrix = tetromino.matrix; // сохранение старого положения фигуры
  const rotatedMatrix = rotateMatrix(tetromino.matrix); // постоянная вращения матрицы фигуры
  tetromino.matrix = rotatedMatrix;
  // draw(); // вызов функции рисования, здесь не обязательно прописывать, запускается в №12
  // устранение ломки фигур (коллизии) при переворотах фигур у боковых стенок поля
  if (isValid()) {
    tetromino.matrix = oldMatrix;
  }
}
function rotateMatrix(matrixTetromino) {
  // отбор матрицы фигуры
  const N = matrixTetromino.length; // отбор размера матрицы фигуры
  const rotateMatrix = []; // создание массива новых матриц фигур при повороте
  for (let i = 0; i < N; i++) {
    // задание цикла по повороту матрицы
    rotateMatrix[i] = []; // создание новой матрицы при смене индекса (i)
    // расшифровка примера 3-х ячейной фигуры
    // [
    // [0,0,0]
    // [0,0,0]
    // [0,0,0]
    //]
    for (let j = 0; j < N; j++) {
      rotateMatrix[i][j] = matrixTetromino[N - j - 1][i];
    }
  }
  return rotateMatrix;
}

// №25 - реализация свободного падения фигур в игровом поле
function moveDown() {
  moveTetrominoDown();
  draw();
  // №32 - реализация изменеия скорости падения фигур взависимости от очков
  if (score >= 200) {
    speedDown = 600;
    Level = "Easy";
  }
  if (score >= 500) {
    speedDown = 500;
    Level = "Normal";
  }
  if (score >= 1000) {
    speedDown = 400;
    Level = "Hard";
  }
  if (score >= 1500) {
    speedDown = 300;
    Level = "Harder";
  }
  if (score >= 2000) {
    speedDown = 200;
    Level = "Insane";
  }
  if (score >= 2500) {
    speedDown = 100;
    Level = "Profi";
  }
  // console.log(speedDown);
  document.querySelector(".speedDown").innerHTML = Level;
  stopLoop();
  startLoop();
  // *№29 - реализация останова игры через задание дополнительного цикла в движении вниз
  if (isGameOver) {
    gameOver();
  }
}
function startLoop() {
  timeoutId = setTimeout(
    () => (requestId = requestAnimationFrame(moveDown)), // requestAnimationFrame - стандартная функция анимации JS
    // 700 // *№25 постоянная скорость падения фигуры
    speedDown // *№32 задание изменения скорости падения фигуры
  );
}
function stopLoop() {
  cancelAnimationFrame(requestId); // cancelAnimationFrame - стандартная функция анимации JS
  timeoutId = clearTimeout(timeoutId);
}
// startLoop();

// №27-УРОК №5 - реализация паузы в игре
  btnPausePlay.addEventListener("click", togglePauseGame); // запуск Пауза / Старт через кнопку на ИнфоДоске
function togglePauseGame() {
  isPaused = !isPaused; // обратное инвентирование значения
  if (isPaused) {
    stopLoop();
  } else {
    startLoop();
  }
}

// №28-УРОК №5 - реализация быстрого падения фигуры вниз
btnDropDown.addEventListener('click', dropTetrominoDown); // ПАДЕНИЕ фигуры кнопкой с ИнфоДоски
function dropTetrominoDown() {
  while (!isValid()) {
    // встроенный стандартный цикл - ускоренное передвижение по рядам
    tetromino.row++;
  }
  tetromino.row--; // предотвращение выпадения фигуры за пределы дна поля
}

// №29 - реализация останова игры - инструкция gameOver
function gameOver() {
  stopLoop(); // остановка цикла игры
  gameOverBlock.style.display = "flex"; // задание смены значения свойства селектора .game-over для вызова поверхностного окна
  let bestScore = localStorage.getItem("bestscore"); // вариант №2 - отдельный вывод лучшего результата очков на всплывающем окне GameOver - вариант №2
  document.querySelector(".game-over-bestscore").innerHTML = + bestScore;
  document.querySelector(".game-over-score").innerHTML = score; // отдельный вывод суммы набранных очков на всплывающем окне GameOver - вариант №2
}
function isOutsideTopBoard(row) {
  // инструкция определения касания верхней границы поля при наполнении фигурами
  return tetromino.row + row < 0;
}

// №30 - реализация перезапуска игры - инструкция
// \/ перезапуск с поля GameOver
btnRestart.addEventListener("click", function () {
  // запуск инструкций при нажатии на RestartGame
  // gameOverBlock.style.display = 'none'; // отключение наложенного на игру div"GameOver"
  // isGameOver = false; // сброс значения переменной
  // generatePlayfield(); // запуск игрового поля
  // generateTetromino(); // запуск игровых фигур
  // startLoop(); // запуск цикла игры
  // cells = document.querySelectorAll(".tetris div"); // запуск работы с новосозданными div-ами
  // })
  // Производим оптимизацию кода путем пропиcывания отдельной функции init()
  init();
});
// \/ перезапуск с ИнфоДоски
btnRestartBoard.addEventListener("click", function () {
  init();
});
function init() {
  gameOverBlock.style.display = "none"; // отключение наложенного на игру div"GameOver"
  isGameOver = false; // сброс значения переменной
  generatePlayfield(); // запуск игрового поля
  generateTetromino(); // запуск игровых фигур
  startLoop(); // запуск цикла игры
  cells = document.querySelectorAll(".tetris div"); // запуск работы с новосозданными div-ами - ячкейками ОСНОВНОГО ПОЛЯ
  cellsNext = document.querySelectorAll(".tetrisNext div"); //*№34 - запуск работы с новосозданными div-ами - ячкейками ПОЛЯ NextFigure
  // console.log(cellsNext);
  score = 0; // обнуление счетчика баллов
  countScore(null); // перезапуск функции подсчета баллов
  speedDown = 700; // *№32 - сброс скорости падения фигур до первоначального значения
  Level = 'Auto'; // самый низкий уровень сложности
  isPaused = false; // *№33 - сброс в первоначальное значение Pause
}
// init(); // запуск игры

// *№32 Реализация изменения уровня игры клавиатурой
// btnLevelDown.addEventListener("click", LevelDown);
// btnLevelUp.addEventListener("click", LevelUp);
// function LevelDown() {
//   if (!isPaused) {
//     if (speedDown !== 700) { speedDown = speedDown + 100; }
//   }
// }
// function LevelUp() {
//   if (!isPaused) {
//     if (speedDown !== 100) { speedDown = speedDown - 100; }
//   }
// }
// /\ -- БЛОК ИНСТРУКЦИЙ ДВИЖЕНИЯ ФИГУР и ЗАПУСКА ИГРЫ --/\

// \/-- БЛОК ИНСТРУКЦИЙ ГЕНЕРАЦИИ ИГРОВЫХ ПОЛЕЙ И ФИГУР - generatePlayfield, generateTetromino --\/
// №3 создание инструкции динамичного поля игры через прописание функций и циклов
function generatePlayfield() {
  //\/-- генерация основного игрового поля --\//
  document.querySelector(".tetris").innerHTML = ""; // *№30 - обнуление всех div-вов игрового поля с рестартом игры
  for (let i = 0; i < PLAYFIELD_ROWS * PLAYFIELD_COLUMNS; i++) {
    const div = document.createElement("div"); // создание тегов "div" из 360-ти отдельных элементов
    document.querySelector(".tetris").append(div); // взятие отдельного элемента (div) и помещение его в поле (".tetris")
  }
  // №5 написание алгоритма функции автонаполнения игрового поля массивами-прописывание матрицы
  playfield = new Array(PLAYFIELD_ROWS) // новый массив данных
    .fill() // стандартный метод - формируется 1 колонка ячеек с 24 строками
    .map(() => new Array(PLAYFIELD_COLUMNS).fill(0)); // стандартный метод (цикл) - формируются 15 колонок и ячейки заполняются 0-ми
  // console.log(playfield);
  // console.table(playfield);

  //\/ *№34-- генерация поля NextFigure  -- \///
  document.querySelector(".tetrisNext").innerHTML = ""; // *№30 - обнуление всех div-вов игрового поля с рестартом игры
  for (let i = 0; i < 3 * 4; i++) {
    // задание 3-х строк и 4-х столбцов
    const divNext = document.createElement("div"); // создание тегов "div" из 12-ти отдельных элементов
    document.querySelector(".tetrisNext").append(divNext); // взятие отдельного элемента (div) и помещение его в поле (".tetrisNext")
  }
  // написание алгоритма функции автонаполнения игрового поля массивами-прописывание матрицы
  playfieldNext = new Array(3) // новый массив данных
    .fill() // стандартный метод - формируется 1 колонка ячеек с 3-мя строками
    .map(() => new Array(4).fill(0)); // стандартный метод (цикл) - формируются 4 колонки и ячейки заполняются 0-ми
  // console.log(playfieldNext);
  // console.table(playfieldNext);
  // a = document.querySelectorAll('.tetrisNext div');
  // console.log(a);
}

// №6 ГЕНЕРАЦИЯ ФИГУР
function generateTetromino() {
  //\/-- ГЕНЕРАЦИЯ ФИГУРЫ основного игрового поля --\//
  // const nameTetro = 'O'; // начальный вариант вызова фигуры по имени
  // const nameTetro = getRandomElement(TETROMINO_NAMES); // вызов рандомного имени фигуры
  const nameTetro = localStorage.getItem("nameTetro");
  // const nameTetro = nameTetroNext;
  const matrixTetro = TETROMINOES[nameTetro];
  // задание координат начального положение фигур
  // const rowTetro = 1; // вариант №1 постоянный по 1-й строке
  // const columnTetro = 6; // вариант №1 постоянный по 6-й колонке
  // вариант №2 вычисление расположения фигуры по центру горизонтали поля по формуле
  const columnTetro = Math.floor(
    PLAYFIELD_COLUMNS / 2 - matrixTetro.length / 2
  );
  // const rowTetro = 0; // выпадение фигуры на нулевой строке по вертикали
  // №24-УРОК №4 - вставка коррекции по выпадению фигур сверху из-за поля
  const rowTetro = -2; // выпадение фигуры сверху по вертикали из-за поля
  // описание структуры переменной
  tetromino = {
    name: nameTetro,
    matrix: matrixTetro,
    row: rowTetro,
    column: columnTetro,
  };
  // console.log(tetromino);

  //\/--*№34 ГЕНЕРАЦИЯ NextFigure --\//
  const nameTetroNext = getRandomElement(TETROMINO_NAMES);
  // const nameTetroNext = "C";
  localStorage.setItem("nameTetro", nameTetroNext);
  const matrixTetroNext = TETROMINOES[nameTetroNext];
  const rowTetroNext = Math.floor(2 - matrixTetroNext.length / 2);
  const columnTetroNext = Math.floor(2 - matrixTetroNext.length / 3); 
  tetrominoNext = {
    name: nameTetroNext,
    matrix: matrixTetroNext,
    row: rowTetroNext,
    column: columnTetroNext,
  };
  // console.log(tetrominoNext);
}
// запуск работы вышенаписанных инструкций
// generatePlayfield(); // - ремится строка после *№30 и запуска func - init();
// generateTetromino(); // - ремится строка после *№30 и запуска func - init();
// /\-- БЛОК ИНСТРУКЦИЙ ГЕНЕРАЦИИ ИГРОВЫХ ПОЛЕЙ И ФИГУР - generatePlayfield, generateTetromino --/\

// \/-- БЛОК ИНСТРУКЦИЙ РИСОВАНИЯ ПОЛЕЙ И ФИГУР - Draw --\/
// №16 функция очистки и рисования игрового поля для новых фигур
function drawPlayField() {
  //\/-- РИСОВАНИЕ ОСНОВНОГО ИГРОВОГО ПОЛЯ -\//
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
      const name = playfield[row][column]; // привязка к новому имени игрового поля
      // *№9 подсвечивание фигур в ячейках, в которых они находятся
      const cellIndex = convertPositionToIndex(row, column);
      // console.log(cellIndex);
      // *№11 обращение к колонкам с индексами
      cells[cellIndex].classList.add(name);
      // console.log(name);
    }
  }

  //\/--*№34 РИСОВАНИЕ ПОЛЯ NextFigure --\//
  for (let row = 0; row < 3; row++) {
    for (let column = 0; column < 4; column++) {
      const nameNext = playfieldNext[row][column]; // привязка к новому имени игрового поля
      // *№9 подсвечивание фигур в ячейках, в которых они находятся
      const cellIndexNext = convertPositionToIndexNextFigure(row, column);
      //console.log(cellIndexNext);
      // *№11 обращение к колонкам с индексами
      cellsNext[cellIndexNext].classList.add(nameNext);
      // console.log(nameNext);
    }
  }
}

// №7 функция рисования игровых фигур
function drawTetromino() {
  //\/-- РИСОВАНИЕ ФИГУР НА ОСНОВНОМ ИГРОВОМ ПОЛЕ --\//
  const name = tetromino.name;
  const tetrominoMatrixSize = tetromino.matrix.length; // по длине
  // запуск цикла поиска фигур по -> строкам -> столбцам
  for (let row = 0; row < tetrominoMatrixSize; row++) {
    for (let column = 0; column < tetrominoMatrixSize; column++) {
      // \/-- условие до подключения *№29 -- \/
      // if (tetromino.row + row < 0) { continue; } // *№6 условие для корректного прописания прорисовки фигуры при выпадении сверху из-за поля
      // \/-- уcловие после подключения *№29 --\/
      if (isOutsideTopBoard(row)) {
        continue;
      } // *№29 - вставка дополнительного условия
      if (tetromino.matrix[row][column] == 0) {
        continue;
      } // №17 условие прорисовки фигуры по заданым 1-кам в матрице, 0 - пропуск прорисовки
      // №9 подсвечивание фигур в ячейках, в которых они заполняются матрицей
      const cellIndex = convertPositionToIndex(
        tetromino.row + row,
        tetromino.column + column
      );
      // console.log(tetromino);
      // console.log(cellIndex);
      // №11 обращение к колонкам с индексами
      cells[cellIndex].classList.add(name);
    }
  }

  //\/--*№34 РИСОВАНИЕ ФИГУР НА ПОЛЕ NextFigure --\//
  const nameNext = tetrominoNext.name;
  const tetrominoNextMatrixSize = tetrominoNext.matrix.length; // по длине
  // запуск цикла поиска фигур по -> строкам -> столбцам
  for (let row = 0; row < tetrominoNextMatrixSize; row++) {
    for (let column = 0; column < tetrominoNextMatrixSize; column++) {
      if (tetrominoNext.matrix[row][column] == 0) {
        continue;
      } // №17 условие прорисовки фигуры по заданым 1-кам в матрице, 0 - пропуск прорисовки
      // №9 подсвечивание фигур в ячейках, в которых они заполняются матрицей
      const cellIndexNext = convertPositionToIndexNextFigure(
        tetrominoNext.row + row,
        tetrominoNext.column + column
      );
      // console.log(tetrominoNext);
      // console.log(cellIndexNext);
      // №11 обращение к колонкам с индексами
      cellsNext[cellIndexNext].classList.add(nameNext);
    }
  }
}
// drawTetromino(); // *№24 замена после прописывания новых функций
// startLoop(); // - ремится строка после *№30 и запуска func - init();

//\/-- №8 создание инструкции привязки места фигуры на ОСНОВНОМ поле к индексу ячейки (в моем примере от 0 до 359 (всего 360 ячеек) в направлении слева на право и сверху вниз)
function convertPositionToIndex(row, column) {
  return row * PLAYFIELD_COLUMNS + column;
}
//\/--*№34 индексация места фигуры на поле к индексу ячейки NextFigure
function convertPositionToIndexNextFigure(row, column) {
  return row * 4 + column;
}
// let aaa = convertPositionToIndex(2,0);
// console.log(aaa);

// №13 рисование передвижения фигуры по игровому полю
function draw() {
  cells.forEach(function (cell) {
    cell.removeAttribute("class");
  }); // очистка всего ОСНОВНОГО ИГРОВОГО ПОЛЯ
  cellsNext.forEach(function (cellNext) {
    cellNext.removeAttribute("class");
  }); // *№34 очистка всего ПОЛЯ NextFigure
  drawPlayField(); // *№16 прорисовка игрового поля
  drawTetromino(); // *№7 прорисовка игровой фигуры

  // console.log(tetrominoNext);
  // console.table(tetrominoNext.matrix);
  // console.log(tetromino);
  // console.table(tetromino);
  // console.table(playfieldNext);
}
// /\-- БЛОК ИНСТРУКЦИЙ РИСОВАНИЯ ПОЛЕЙ И ФИГУР - Draw --/\


// \/-- БЛОК ИНСТРУКЦИЙ ПОДСЧЕТА ОЧКОВ В ИГРЕ SCORE --\/
// №23 реализация подсчета заработанных игровых баллов
function findFilledRows() {
  // поиск заполненных строк
  const filledRows = []; // запись массива номеров линий, которые заполняются
  for (let row = 0; row < PLAYFIELD_ROWS; row++) {
    // проход по строкам для нахождения заполненных полей
    let filledColumns = 0;
    for (let column = 0; column < PLAYFIELD_COLUMNS; column++) {
      // проход по колонкам для нахождения заполненных полей
      if (playfield[row][column] != 0) {
        filledColumns++; // +1 к счетчику при выполнении условия
      }
    }
    if (PLAYFIELD_COLUMNS == filledColumns) {
      filledRows.push(row);
    }
  }
  return filledRows;
}
// №26 - функция подсчета баллов
function countScore(destroyRows) {
  switch (destroyRows) {
    case 1:
      score += 10;
      break;
    case 2:
      score += 30;
      break;
    case 3:
      score += 70;
      break;
    case 4:
      score += 150;
      break;
    default:
      score += 0;
  }
  // №31 ПОДСЧЕТ лучших результатов
  let bestScore = localStorage.getItem("bestscore"); // доставание из локального хранилища значения "bestscore"
  // console.log(bestScore);
  if (bestScore < score) {
    localStorage.setItem("bestscore", score);
  }
  document.querySelector(".bestscore").innerHTML = +bestScore;
  // document.querySelector(".game-over-bestscore").innerHTML = bestScore; // вариант №1 - отдельный вывод лучшего результата очков на всплывающем окне GameOver
  document.querySelector(".score").innerHTML = score;
  // document.querySelector(".game-over-score").innerHTML = score; // вариант №1 - отдельный вывод суммы набранных очков на всплывающем окне GameOver
}
// *№23 - продолжение - прописывание функции удаления заполненных строк
function removeFillRows(filledRows) {
  // filledRows.forEach(row => {
  // dropRowsAbove(row); // реализация построкового удаления заполненных строк
  // })
  // ниже прописан тот-же алгоритм, что и выше, но в простой форме
  for (let i = 0; i < filledRows.length; i++) {
    const row = filledRows[i];
    dropRowsAbove(row);
  }
  countScore(filledRows.length);
}
// падение верхних строк на место удаленных
function dropRowsAbove(rowDelete) {
  for (let row = rowDelete; row > 0; row--) {
    // удаление заполненных строк снизу вверх
    playfield[row] = playfield[row - 1];
  }
  playfield[0] = new Array(PLAYFIELD_COLUMNS).fill(0);
}
// /\-- БЛОК ИНСТРУКЦИЙ ПОДСЧЕТА ОЧКОВ В ИГРЕ SCORE --/\

// \/-- БЛОК ДОПОЛНИТЕЛЬНЫХ ФУНКЦИЙ --\/
// №14 инструкции взаимодействия фигур с полем и другими фигурами (устранение колизии) путем перебора всех позиций фигуры
// function isOutsideOfGameBoard() {
// const matrixSize = tetromino.matrix.length; // берутся пропорции фигуры
// for (let row = 0; row < matrixSize; row++){ // перебор всех вариантов пропорций фигуры
// for (let column = 0; column < matrixSize; column++){
// if (tetromino.matrix[row][column] ==0) { continue; } // №18 условие касания дна поля прописанными в матрице 1-ками
// if (
// tetromino.column + column < 0 || // условие касания левой границы игрового поля или
// tetromino.column + column >= PLAYFIELD_COLUMNS || // условие касания правой границы игрового поля //по уроку вместо 15 прописано "PLAYFIELD_COLUMNS"\\ или
// tetromino.row + row >= PLAYFIELD_ROWS // условие касания нижней гриницы игрового поля \\по уроку вместо 24 прописано "playfield.length" или "PLAYFIELD_ROWS"
// ) { return true; }
// }
// }
// return false;
// }
// №14 после проведения оптимизации - *№21
function isOutsideOfGameBoard(row, column) {
  return (
    tetromino.column + column < 0 ||
    tetromino.column + column >= PLAYFIELD_COLUMNS ||
    tetromino.row + row >= PLAYFIELD_ROWS
  );
}

// №15 вызов на исходном состоянии новой фигуры после касания предыдущей нижней границы игрового поля
function placeTetromino() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    // перебор всех вариантов пропорций фигуры
    for (let column = 0; column < matrixSize; column++) {
      if (!tetromino.matrix[row][column]) {
        continue;
      }
      if (isOutsideTopBoard(row)) {
        isGameOver = true;
        return;
      } // *№29 - вставка дополнительного условия
      playfield[tetromino.row + row][tetromino.column + column] =
        tetromino.name; // запись в память наличие предыдущей фигуры на дне
    }
  }
  // * - встроенная конструкция удаления заполненных строк и подсчета баллов
  // выявление и определение индексов заполненных строк
  const filledRows = findFilledRows();
  // console.log(filledRows.length);
  // запуск функции удаления заполненных строк
  removeFillRows(filledRows);
  // *№15 - продолжение
  generateTetromino(); // создание новой фигуры
}

// №19 создание функции случайного выбора фигуры
function getRandomElement(Array) {
  const randomIndex = Math.floor(Math.random() * Array.length);
  // console.log(Math.random());
  // console.log(Array.length);
  // console.log(randomIndex);
  return Array[randomIndex];
}

// №20 - устранение коллизии - наслоение фигур друг в друге при достижении нижней границы игрового поля
// function hasCollisions() {
// const matrixSize = tetromino.matrix.length; // берутся пропорции фигуры
// for (let row = 0; row < matrixSize; row++) { // перебор всех вариантов пропорций фигуры
// for (let column = 0; column < matrixSize; column++) {
// if (tetromino.matrix[row][column] ==0) { continue; } // условие касания фигур друг друга прописанными в матрице 1-ками
// if (playfield[tetromino.row + row][tetromino.column + column]) { return true; }
// }
// }
// return false;
// }
// №20 после проведения оптимизации - *№21
function hasCollisions(row, column) {
  return playfield[tetromino.row + row]?.[tetromino.column + column];
}

// №21 - оптимизация кода через обьединение одинаковых элементов функций №14 и №20
function isValid() {
  const matrixSize = tetromino.matrix.length;
  for (let row = 0; row < matrixSize; row++) {
    for (let column = 0; column < matrixSize; column++) {
      if (tetromino.matrix[row][column] == 0) {
        continue;
      }
      // или идентичное условие - if (!tetromino.matrix[row][column]) { continue; }
      if (isOutsideOfGameBoard(row, column)) {
        return true;
      }
      if (hasCollisions(row, column)) {
        return true;
      }
    }
  }
  return false;
}