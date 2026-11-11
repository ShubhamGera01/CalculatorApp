
// =====================================
// THEME SWITCHER
// =====================================

const themeBtn = document.getElementById("theme-btn");

themeBtn.addEventListener("click", () => {

  const isDark = document.body.classList.toggle("dark");

  document.body.classList.toggle("light", !isDark);

  themeBtn.textContent = isDark
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";

});


// =====================================
// CALCULATOR VARIABLES
// =====================================

const previousOperandText =
  document.getElementById("previous-operand");

const currentOperandText =
  document.getElementById("current-operand");

let currentOperand = "0";
let previousOperand = "";
let operation = undefined;
let resetScreen = false;


// =====================================
// HISTORY VARIABLES
// =====================================

const historyBtn = document.getElementById("history-btn");

const historyContainer =
  document.getElementById("history-container");

const historyList =
  document.getElementById("history-list");

const clearHistoryBtn =
  document.getElementById("clear-history");

let history = [];


// =====================================
// UPDATE DISPLAY
// =====================================

function updateDisplay() {

  currentOperandText.textContent = currentOperand;

  if (operation != null) {

    previousOperandText.textContent =
      `${previousOperand} ${operation}`;

  } else {

    previousOperandText.textContent = "";

  }

}


// =====================================
// APPEND NUMBER
// =====================================

function appendNumber(number) {

  if (resetScreen) {

    currentOperand = "";
    resetScreen = false;

  }

  if (number === "." && currentOperand.includes(".")) {
    return;
  }

  if (currentOperand === "0" && number !== ".") {

    currentOperand = number.toString();

  } else {

    currentOperand += number.toString();

  }

}


// =====================================
// CHOOSE OPERATION
// =====================================

function chooseOperation(op) {

  if (currentOperand === "" && previousOperand === "") {
    return;
  }

  if (currentOperand === "" && previousOperand !== "") {

    operation = op;
    return;

  }

  if (previousOperand !== "") {

    compute();

  }

  operation = op;

  previousOperand = currentOperand;

  currentOperand = "";

}


// =====================================
// COMPUTE RESULT
// =====================================

function compute() {

  let computation;

  const prev = parseFloat(previousOperand);

  const current = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(current)) {
    return;
  }

  const expression =
    `${previousOperand} ${operation} ${currentOperand}`;

  switch (operation) {

    case "+":
      computation = prev + current;
      break;

    case "-":
    case "−":
      computation = prev - current;
      break;

    case "×":
    case "*":
      computation = prev * current;
      break;

    case "÷":
    case "/":

      if (current === 0) {

        alert("Cannot divide by zero");

        clearAll();

        return;

      }

      computation = prev / current;
      break;

    default:
      return;

  }

  currentOperand =
    (Math.round(computation * 1e12) / 1e12).toString();

  // Save calculation in history
  addToHistory(expression, currentOperand);

  operation = undefined;

  previousOperand = "";

  resetScreen = true;

}


// =====================================
// CLEAR ALL
// =====================================

function clearAll() {

  currentOperand = "0";

  previousOperand = "";

  operation = undefined;

  resetScreen = false;

}


// =====================================
// DELETE NUMBER
// =====================================

function deleteNumber() {

  if (resetScreen) return;

  if (
    currentOperand.length === 1 ||
    currentOperand === "0"
  ) {

    currentOperand = "0";

  } else {

    currentOperand = currentOperand.slice(0, -1);

  }

}


// =====================================
// PERCENTAGE
// =====================================

function applyPercentage() {

  const current = parseFloat(currentOperand);

  if (isNaN(current)) return;

  currentOperand = (current / 100).toString();

}


// =====================================
// ADD TO HISTORY
// =====================================

function addToHistory(expression, result) {

  history.unshift(`${expression} = ${result}`);

  updateHistory();

}


// =====================================
// UPDATE HISTORY DISPLAY
// =====================================

function updateHistory() {

  historyList.innerHTML = "";

  if (history.length === 0) {

    const li = document.createElement("li");

    li.textContent = "No calculations yet";

    li.classList.add("empty-history");

    historyList.appendChild(li);

    return;

  }

  history.forEach((item) => {

    const li = document.createElement("li");

    li.textContent = item;

    historyList.appendChild(li);

  });

}


// =====================================
// SHOW / HIDE HISTORY
// =====================================

historyBtn.addEventListener("click", () => {

  historyContainer.classList.toggle("show");

});


// =====================================
// CLEAR HISTORY
// =====================================

clearHistoryBtn.addEventListener("click", () => {

  history = [];

  updateHistory();

});


// =====================================
// NUMBER BUTTON EVENTS
// =====================================

document.querySelectorAll("[data-number]").forEach((button) => {

  button.addEventListener("click", () => {

    appendNumber(button.dataset.number);

    updateDisplay();

  });

});


// =====================================
// OPERATOR BUTTON EVENTS
// =====================================

document.querySelectorAll("[data-operator]").forEach((button) => {

  button.addEventListener("click", () => {

    chooseOperation(button.dataset.operator);

    updateDisplay();

  });

});


// =====================================
// ACTION BUTTON EVENTS
// =====================================

document.querySelectorAll("[data-action]").forEach((button) => {

  button.addEventListener("click", () => {

    const action = button.dataset.action;

    if (action === "clear") clearAll();

    if (action === "delete") deleteNumber();

    if (action === "equals") compute();

    if (action === "percent") applyPercentage();

    updateDisplay();

  });

});


// =====================================
// KEYBOARD SUPPORT
// =====================================

window.addEventListener("keydown", (e) => {

  if (
    (e.key >= "0" && e.key <= "9") ||
    e.key === "."
  ) {

    appendNumber(e.key);

  }

  else if (e.key === "+" || e.key === "-") {

    chooseOperation(e.key);

  }

  else if (e.key === "*") {

    chooseOperation("×");

  }

  else if (e.key === "/") {

    e.preventDefault();

    chooseOperation("÷");

  }

  else if (e.key === "Enter" || e.key === "=") {

    e.preventDefault();

    compute();

  }

  else if (e.key === "Backspace") {

    deleteNumber();

  }

  else if (e.key === "Escape") {

    clearAll();

  }

  updateDisplay();

});
