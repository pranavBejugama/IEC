const ROWS = 10;
const CODE_LENGTH = 4;
const COLORS = 10; // 0–9

let secretCode = [];
let currentRow = 0; // 0 = first row at bottom
let selectedColor = null;
let gameOver = false;


document.addEventListener("DOMContentLoaded", () => {
  createBoard();
  setupPalette();
  document.getElementById("newGame").addEventListener("click", startNewGame);
  document.getElementById("submitGuess").addEventListener("click", handleCheck);
  startNewGame();
});

function createBoard() {
  const board = document.getElementById("board");
  board.innerHTML = "";

  for (let r = 0; r < ROWS; r++) {
    const row = document.createElement("div");
    row.className = "row";
    row.dataset.rowIndex = r;

    const guessSlots = document.createElement("div");
    guessSlots.className = "guess-slots";

    for (let c = 0; c < CODE_LENGTH; c++) {
      const slot = document.createElement("div");
      slot.className = "slot";
      slot.dataset.colIndex = c;
      slot.dataset.rowIndex = r;
      slot.addEventListener("click", () => handleSlotClick(r, c));
      guessSlots.appendChild(slot);
    }

    const feedback = document.createElement("div");
    feedback.className = "feedback";
    for (let i = 0; i < CODE_LENGTH; i++) {
      const peg = document.createElement("div");
      peg.className = "peg";
      feedback.appendChild(peg);
    }

    row.appendChild(guessSlots);
    row.appendChild(feedback);
    board.appendChild(row);
  }
}

function setupPalette() {
  const palette = document.getElementById("palette");
  palette.querySelectorAll(".color").forEach(btn => {
    btn.addEventListener("click", () => {
      selectedColor = parseInt(btn.dataset.color, 10);
      setStatus(`Selected color ${selectedColor + 1}. Click a slot in the active row.`);
    });
  });
}

function startNewGame() {
  secretCode = [];
  for (let i = 0; i < CODE_LENGTH; i++) {
    secretCode.push(Math.floor(Math.random() * COLORS));
  }
  // console.log("Secret:", secretCode); // for debugging

  currentRow = 0;
  gameOver = false;
  selectedColor = null;

  // Clear board
  document.querySelectorAll(".slot").forEach(slot => {
    slot.style.background = "#020617";
    slot.dataset.color = "";
    slot.textContent = "";
  });
  document.querySelectorAll(".peg").forEach(peg => {
    peg.style.background = "#020617";
  });

  highlightActiveRow();
  setStatus("New game started. Choose a color and fill the bottom row.");
  console.log("SECRET CODE:", secretCode.join(""));
}

function highlightActiveRow() {
  document.querySelectorAll(".row").forEach(row => {
    row.classList.remove("active");
  });
  const rows = Array.from(document.querySelectorAll(".row"));
  const activeRowElement = rows.find(r => parseInt(r.dataset.rowIndex, 10) === currentRow);
  if (activeRowElement) {
    activeRowElement.classList.add("active");
  }
}

function handleSlotClick(rowIndex, colIndex) {
  if (gameOver) return;
  if (rowIndex !== currentRow) {
    setStatus("You can only fill the current row.");
    return;
  }
  if (selectedColor === null) {
    setStatus("Select a color from the palette first.");
    return;
  }

  const selector = `.slot[data-row-index="${rowIndex}"][data-col-index="${colIndex}"]`;
  const slot = document.querySelector(selector);
  slot.dataset.color = selectedColor;

  // Match palette color
  const paletteBtn = document.querySelector(`.color[data-color="${selectedColor}"]`);
  slot.style.background = getComputedStyle(paletteBtn).backgroundColor;

  // Also show the digit in the circle
  slot.textContent = selectedColor;
}


function handleCheck() {
  if (gameOver) return;

  const rowSlots = document.querySelectorAll(`.slot[data-row-index="${currentRow}"]`);
  const guess = [];
  for (const slot of rowSlots) {
    if (slot.dataset.color === "" || slot.dataset.color === undefined) {
      setStatus("Fill all 4 slots before checking.");
      return;
    }
    guess.push(parseInt(slot.dataset.color, 10));
  }

  const { black, white } = evaluateGuess(guess, secretCode);
  updateFeedbackPegs(currentRow, black, white);

  if (black === CODE_LENGTH) {
    setStatus("You cracked the code! 🎉");
    gameOver = true;
    return;
  }

  currentRow++;
  if (currentRow >= ROWS) {
    setStatus(`No more rows! You lost. Secret was ${secretCode.join(", ")}.`);
    gameOver = true;
    return;
  }

  highlightActiveRow();
  setStatus(`Black: ${black}, White: ${white}. Go to the next row.`);
}

function evaluateGuess(guess, code) {
  const n = guess.length;
  let black = 0;
  let white = 0;

  // for digits 0–9
  const secretCount = new Array(10).fill(0);
  const guessCount  = new Array(10).fill(0);

  // 1) count black pegs
  for (let i = 0; i < n; i++) {
    if (guess[i] === code[i]) {
      black++;
    } else {
      secretCount[code[i]]++;
      guessCount[guess[i]]++;
    }
  }

  // 2) count white pegs
  for (let d = 0; d < 10; d++) {
    white += Math.min(secretCount[d], guessCount[d]);
  }

  return { black, white };
}


function updateFeedbackPegs(rowIndex, black, white) {
  const row = document.querySelector(`.row[data-row-index="${rowIndex}"]`);
  const pegs = row.querySelectorAll(".peg");

  let i = 0;
  // Fill black pegs first
  for (; i < black; i++) {
    pegs[i].style.background = "#000000";
  }
  // Then white pegs
  for (let j = 0; j < white; j++, i++) {
    pegs[i].style.background = "#ffffff";
  }
}

function setStatus(msg) {
  document.getElementById("status").textContent = msg;
}
