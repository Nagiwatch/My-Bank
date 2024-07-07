let balance = localStorage.getItem('balance') ? parseFloat(localStorage.getItem('balance')) : 0;
let transactionHistory = localStorage.getItem('transactionHistory') ? JSON.parse(localStorage.getItem('transactionHistory')) : [];

const balanceElement = document.getElementById('balance');
const timerElement = document.getElementById('timer');
const amountElement = document.getElementById('amount');
const transactionHistoryElement = document.getElementById('transaction-history');

balanceElement.textContent = balance.toFixed(2);
displayTransactionHistory();

function updateBalance() {
    balanceElement.textContent = balance.toFixed(2);
    localStorage.setItem('balance', balance);
}

function addTransaction(type, amount) {
    const transaction = {
        type: type,
        amount: amount,
        date: new Date().toLocaleString()
    };
    transactionHistory.push(transaction);
    localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
    displayTransactionHistory();
}

function displayTransactionHistory() {
    transactionHistoryElement.innerHTML = '';
    transactionHistory.forEach(transaction => {
        const listItem = document.createElement('li');
        listItem.textContent = `${transaction.date} - ${transaction.type}: ${transaction.amount} Rs`;
        transactionHistoryElement.appendChild(listItem);
    });
}

function deposit() {
    const amount = parseFloat(amountElement.value);
    if (!isNaN(amount) && amount > 0) {
        balance += amount;
        updateBalance();
        addTransaction('Deposit', amount);
    }
    amountElement.value = '';
}

function withdraw() {
    const amount = parseFloat(amountElement.value);
    if (!isNaN(amount) && amount > 0 && balance >= amount) {
        balance -= amount;
        updateBalance();
        addTransaction('Withdraw', amount);
    }
    amountElement.value = '';
}

function addMonthlyAmount() {
    const now = new Date();
    const lastAddition = localStorage.getItem('lastAddition') ? new Date(localStorage.getItem('lastAddition')) : new Date();
    const timeDiff = now.getTime() - lastAddition.getTime();

    if (timeDiff >= 30 * 24 * 60 * 60 * 1000) {
        balance += 40;
        updateBalance();
        addTransaction('Monthly Addition', 40);
        localStorage.setItem('lastAddition', now);
    }
}

function updateTimer() {
    const now = new Date();
    const lastAddition = localStorage.getItem('lastAddition') ? new Date(localStorage.getItem('lastAddition')) : new Date();
    const nextAddition = new Date(lastAddition.getTime() + 30 * 24 * 60 * 60 * 1000);
    const timeDiff = nextAddition - now;

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    timerElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

setInterval(() => {
    addMonthlyAmount();
    updateTimer();
}, 1000);
