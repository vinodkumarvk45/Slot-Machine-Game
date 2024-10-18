document.getElementById('spinButton').addEventListener('click', game);
document.getElementById('depositButton').addEventListener('click', () => {
    balance = deposit();
    document.getElementById('balance').textContent = "Balance: $" + balance;
});

const SYMBOLS_COUNT = {
    "A": 2,
    "B": 3,
    "C": 5,
    "D": 6
};

const SYMBOLS_VALUES = {
    "A": 9,
    "B": 4,
    "C": 5,
    "D": 2
};

let balance = 0; // Start with 0 balance

function deposit() {
    while (true) {
        const depositAmount = prompt("Enter your deposit amount $");
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            alert("Invalid deposit amount, please try again.");
        } else {
            return numberDepositAmount;
        }
    }
}

function spin() {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [[], [], []];
    for (let i = 0; i < 3; i++) {
        const reelSymbols = [...symbols];
        for (let j = 0; j < 3; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
        }
    }

    return reels;
}

function transpose(reels) {
    const rows = [];
    for (let i = 0; i < 3; i++) {
        rows.push([]);
        for (let j = 0; j < 3; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

function printRows(rows) {
    const reelDivs = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];

    rows.forEach((row, rowIndex) => {
        row.forEach((symbol, colIndex) => {
            reelDivs[colIndex].textContent = symbol;
        });
    });
}

function getWinnings(rows, bet, lines) {
    let winnings = 0;
    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;
        for (const symbol of symbols) {
            if (symbol !== symbols[0]) {
                allSame = false;
                break;
            }
        }
        if (allSame) {
            winnings += bet * SYMBOLS_VALUES[symbols[0]];
        }
    }
    return winnings;
}

function game() {
    if (balance === 0) {
        alert("Please deposit money to start playing.");
        return;
    }

    const lines = parseInt(document.getElementById('lines').value);
    const bet = parseFloat(document.getElementById('bet').value);

    if (bet * lines > balance) {
        alert("Not enough balance!");
        return;
    }

    balance -= bet * lines;

    const reels = spin();
    const rows = transpose(reels);
    printRows(rows);

    const winnings = getWinnings(rows, bet, lines);
    balance += winnings;

    document.getElementById('balance').textContent = "Balance: $" + balance;
    document.getElementById('result').textContent = winnings > 0 
        ? `You won $${winnings}!` 
        : `No winnings.`;

    if (balance <= 0) {
        alert("Game over! You ran out of money.");
        balance = 0;
    }
}
