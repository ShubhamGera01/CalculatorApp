
const currentOperand = document.getElementById("current-operand");
const previousOperand = document.getElementById("previous-operand");

const numberButtons = document.querySelectorAll("[data-number]");
const operatorButtons = document.querySelectorAll(".operator-btn");
const actionButtons = document.querySelectorAll(".action-btn");
const equalsButton = document.querySelector(".equals-btn");

const historyBtn = document.getElementById("history-btn");
const historyContainer = document.getElementById("history-container");
const historyList = document.getElementById("history-list");
const clearHistory = document.getElementById("clear-history");

let currentValue = "0";
let previousValue = "";
let operator = null;
let shouldReset = false;

function updateDisplay() {
    currentOperand.textContent = currentValue;
    previousOperand.textContent = previousValue;
}

function appendNumber(number) {
    if (shouldReset) {
        currentValue = "0";
        shouldReset = false;
    }

    if (number === "." && currentValue.includes(".")) return;

    if (currentValue === "0" && number !== ".") {
        currentValue = number;
    } else {
        currentValue += number;
    }

    updateDisplay();
}

function chooseOperator(selectedOperator) {
    if (operator !== null) calculate();

    previousValue = currentValue;
    operator = selectedOperator;
    shouldReset = true;

    updateDisplay();
}

function calculate() {
    if (operator === null || previousValue === "") return;

    const first = parseFloat(previousValue);
    const second = parseFloat(currentValue);

    let result;

    switch (operator) {
        case "+":
            result = first + second;
            break;

        case "−":
            result = first - second;
            break;

        case "×":
            result = first * second;
            break;

        case "÷":
            if (second === 0) {
                currentValue = "Cannot divide by zero";
                previousValue = "";
                operator = null;
                updateDisplay();
                shouldReset = true;
                return;
            }
            result = first / second;
            break;
    }

    const calculation = `${first} ${operator} ${second} = ${result}`;

    currentValue = String(Number(result.toFixed(10)));

    addHistory(calculation);

    previousValue = "";
    operator = null;
    shouldReset = true;

    updateDisplay();
}

function addHistory(calculation) {
    const emptyMessage = historyList.querySelector(".empty-history");

    if (emptyMessage) {
        emptyMessage.remove();
    }

    const li = document.createElement("li");
    li.textContent = calculation;

    historyList.prepend(li);
}

function clearAll() {
    currentValue = "0";
    previousValue = "";
    operator = null;
    shouldReset = false;

    updateDisplay();
}

function deleteNumber() {
    if (shouldReset) return;

    currentValue = currentValue.length > 1
        ? currentValue.slice(0, -1)
        : "0";

    updateDisplay();
}

function percentage() {
    currentValue = String(parseFloat(currentValue) / 100);
    updateDisplay();
}

numberButtons.forEach(button => {
    button.addEventListener("click", () => {
        appendNumber(button.dataset.number);
    });
});

operatorButtons.forEach(button => {
    button.addEventListener("click", () => {
        chooseOperator(button.textContent.trim());
    });
});

actionButtons.forEach(button => {
    button.addEventListener("click", () => {
        const action = button.textContent.trim();

        if (action === "AC") {
            clearAll();
        } else if (action === "⌫") {
            deleteNumber();
        } else if (action === "%") {
            percentage();
        }
    });
});

equalsButton.addEventListener("click", calculate);

historyBtn.addEventListener("click", () => {
    historyContainer.classList.toggle("show");
});

clearHistory.addEventListener("click", () => {
    historyList.innerHTML = '<li class="empty-history">No calculations yet</li>';
});

updateDisplay();
