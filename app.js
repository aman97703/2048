let board;
let score = 0;
let bestScore = localStorage.getItem("bestScore") || 0;
const rows = 4;
const column = 4;

window.onload = function () {
  startGame();
};

const startGame = () => {
  board = new Array(rows).fill(0).map(() => new Array(column).fill(0));
  score = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < column; c++) {
      let tile = document.createElement("div");
      tile.id = `${r}-${c}`;
      const num = board[r][c];
      updateTile(tile, num);
      document.getElementById("board").append(tile);
    }
  }
  setTwo();
  setTwo();
};

const checkWin = () => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < column; c++) {
      if (board[r][c] === 2048) {
        alert("Congratulations You have won!");
        return true;
      }
    }
  }
  return false;
};

const checkLose = () => {
  if (hasEmptyTile()) {
    return false;
  }
  for (let r = 0; r < rows - 1; r++) {
    for (let c = 0; c < column - 1; c++) {
      if (board[r][c] === board[r][c + 1]) {
        // checking for right or in same row
        return false;
      }
      if (board[r][c] === board[r + 1][c]) {
        // checking for down or in same column
        return false;
      }

      if (c > 0 && board[r][c] === board[r][c - 1]) {
        // checking for left or in same row
        return false;
      }

      if (r > 0 && board[r][c] === board[r - 1][c]) {
        // checking for up or in same column
        return false;
      }
    }
  }
  alert("Game Over! You lost!");
  if (score > bestScore) {
    bestScore = score;
    score = 0;
    localStorage.setItem("bestScore", bestScore);
  }
  return true;
};

const updateTile = (tile, num) => {
  tile.innerText = "";
  tile.classList.value = "";
  tile.classList.add("tile");
  if (num > 0) {
    tile.innerText = num;
    if (num <= 4096) {
      tile.classList.add(`x${num}`);
    } else {
      tile.classList.add("x8192");
    }
  }
};

const hasEmptyTile = () => {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < column; c++) {
      if (board[r][c] === 0) {
        return true;
      }
    }
  }
  return false;
};

const setTwo = () => {
  if (!hasEmptyTile()) {
    return;
  }
  let isFound = false;
  while (!isFound) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * column);

    if (board[r][c] === 0) {
      board[r][c] = 2;
      let tile = document.getElementById(`${r}-${c}`);
      updateTile(tile, 2);
      isFound = true;
    }
  }
};

const filterZero = (row) => {
  return row.filter((num) => num !== 0);
};

const slide = (row) => {
  row = filterZero(row);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      row[i + 1] = 0;
      score += row[i];
    }
  }
  row = filterZero(row);
  while (row.length < column) {
    row.push(0);
  }
  return row;
};

const slideLeft = () => {
  for (let r = 0; r < rows; r++) {
    let row = slide(board[r]);
    board[r] = row;
    for (let c = 0; c < column; c++) {
      let tile = document.getElementById(`${r}-${c}`);
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
};

const slideRight = () => {
  for (let r = 0; r < rows; r++) {
    let row = board[r];
    row.reverse();
    row = slide(row);
    row.reverse();
    board[r] = row;
    for (let c = 0; c < column; c++) {
      let tile = document.getElementById(`${r}-${c}`);
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
};

const slideUp = () => {
  for (let c = 0; c < column; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    row = slide(row);
    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      let tile = document.getElementById(`${r}-${c}`);
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
};

const slideDown = () => {
  for (let c = 0; c < column; c++) {
    let row = [board[0][c], board[1][c], board[2][c], board[3][c]];
    row.reverse();
    row = slide(row);
    row.reverse();
    for (let r = 0; r < rows; r++) {
      board[r][c] = row[r];
      let tile = document.getElementById(`${r}-${c}`);
      let num = board[r][c];
      updateTile(tile, num);
    }
  }
};

document.addEventListener("keyup", (e) => {
  if (e.key === "ArrowLeft") {
    slideLeft();
    if (checkWin()) {
      alert("Congratulations You have won!");
    }
    setTwo();
  } else if (e.key === "ArrowRight") {
    slideRight();
    if (checkWin()) {
      alert("Congratulations You have won!");
    }
    setTwo();
  } else if (e.key === "ArrowUp") {
    slideUp();
    if (checkWin()) {
      alert("Congratulations You have won!");
    }
    setTwo();
  } else if (e.key === "ArrowDown") {
    slideDown();
    if (checkWin()) {
      alert("Congratulations You have won!");
    }
    setTwo();
  }
  document.getElementById("score").innerText = score;
});
