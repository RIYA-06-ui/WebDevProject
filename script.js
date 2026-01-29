// ========== Application State ==========
const appState = {
    transactions: [],
    budget: 0,
    categories: ['Salary', 'Bonus', 'Investment', 'Food', 'Transport', 'Entertainment', 'Utilities', 'Healthcare', 'Shopping', 'Other']
};

// ========== Utility Functions ==========
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
    }).format(amount);
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
}

function getDaysAgo(dateString) {
    const today = new Date();
    const transactionDate = new Date(dateString);
    const diffTime = Math.abs(today - transactionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return formatDate(dateString);
}

function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alertContainer');
    const alert = document.createElement('div');
    alert.className = `alert ${type}`;
    alert.innerHTML = `
        ${type === 'success' ? '✅' : type === 'error' ? '❌' : '⚠️'}
        ${message}
    `;
    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 3000);
}

function saveState() {
    localStorage.setItem('financeTrackerData', JSON.stringify(appState));
}

function loadState() {
    const saved = localStorage.getItem('financeTrackerData');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            appState.transactions = parsed.transactions || [];
            appState.budget = parsed.budget || 0;
        } catch (e) {
            console.error('Error loading state:', e);
            showAlert('Error loading saved data', 'error');
        }
    }
    setDefaultDate();
}

function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = today;
}

// ========== Render Functions ==========
function renderStats() {
    const statsContainer = document.getElementById('statsContainer');
    statsContainer.innerHTML = '';

    const totalIncome = appState.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = appState.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    const stats = [
        { label: 'Total Income', value: totalIncome, icon: '📈', class: 'success' },
        { label: 'Total Expense', value: totalExpense, icon: '📉', class: 'error' },
        { label: 'Current Balance', value: balance, icon: '💰', class: balance >= 0 ? 'success' : 'error' }
    ];

    stats.forEach(stat => {
        const statCard = document.createElement('div');
        statCard.className = `stat-card ${stat.class}`;
        statCard.innerHTML = `
            <div>
                <div class="stat-label">${stat.label}</div>
                <div class="stat-value">${formatCurrency(stat.value)}</div>
            </div>
            <div class="stat-icon">${stat.icon}</div>
        `;
        statsContainer.appendChild(statCard);
    });

    updateBudgetStatus();
}

function renderTransactions() {
    const transactionList = document.getElementById('transactionList');
    const filterType = document.getElementById('filterType').value;
    const sortBy = document.getElementById('sortBy').value;
    const transactionCount = document.getElementById('transactionCount');

    let filtered = appState.transactions.filter(t => !filterType || t.type === filterType);

    filtered.sort((a, b) => {
        switch (sortBy) {
            case 'latest': return new Date(b.date) - new Date(a.date);
            case 'oldest': return new Date(a.date) - new Date(b.date);
            case 'amount-high': return b.amount - a.amount;
            case 'amount-low': return a.amount - b.amount;
            default: return 0;
        }
    });

    transactionCount.textContent = filtered.length;

    if (filtered.length === 0) {
        transactionList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <div class="empty-state-message">No transactions found</div>
                <p style="font-size: var(--font-size-sm);">Try adjusting your filters</p>
            </div>
        `;
        return;
    }

    transactionList.innerHTML = '';

    filtered.forEach(transaction => {
        const item = document.createElement('div');
        item.className = `transaction-item ${transaction.deleted ? 'deleted' : ''}`;
        item.dataset.id = transaction.id;

        item.innerHTML = `
            <div class="transaction-detail">
                <div class="transaction-category">${transaction.category}</div>
                <div class="transaction-date">${getDaysAgo(transaction.date)}</div>
                ${transaction.description ? `<div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-top: var(--space-4);">${transaction.description}</div>` : ''}
            </div>
            <div class="transaction-amount ${transaction.type}">
                ${transaction.type === 'income' ? '+' : '-'}${formatCurrency(transaction.amount)}
            </div>
            <div class="transaction-actions">
                <button class="icon-btn edit-btn" data-id="${transaction.id}">✏️</button>
                <button class="icon-btn delete-btn" data-id="${transaction.id}">🗑️</button>
            </div>
        `;

        transactionList.appendChild(item);
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteTransaction(btn.dataset.id));
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => editTransaction(btn.dataset.id));
    });
}

function renderCategoryBreakdown() {
    const categoryBreakdown = document.getElementById('categoryBreakdown');
    const categories = {};

    appState.transactions.forEach(t => {
        if (!categories[t.category]) {
            categories[t.category] = { income: 0, expense: 0 };
        }
        if (t.type === 'income') categories[t.category].income += t.amount;
        else categories[t.category].expense += t.amount;
    });

    const totalExpense = appState.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    if (Object.keys(categories).length === 0) {
        categoryBreakdown.innerHTML = `
            <div class="empty-state" style="padding: var(--space-16); grid-column: 1 / -1;">
                <div class="empty-state-icon">📉</div>
                <div class="empty-state-message">No data yet</div>
            </div>
        `;
        return;
    }

    categoryBreakdown.innerHTML = '';

    Object.entries(categories).forEach(([category, data]) => {
        const isIncome = data.income > 0;
        const amount = isIncome ? data.income : data.expense;
        const percent = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : 0;

        const item = document.createElement('div');
        item.className = `category-item ${isIncome ? 'income' : 'expense'}`;
        item.innerHTML = `
            <div class="category-name">${category}</div>
            <div class="category-amount">${formatCurrency(amount)}</div>
            <div class="category-percent">${isIncome ? '↑' : '↓'} ${percent}% of total</div>
        `;
        categoryBreakdown.appendChild(item);
    });
}

function renderSummaryCards() {
    const summaryCards = document.getElementById('summaryCards');
    summaryCards.innerHTML = '';

    const totalIncome = appState.transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
    const totalExpense = appState.transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

    [
        { title: 'Monthly Income', amount: totalIncome, class: 'success', icon: '📈' },
        { title: 'Monthly Expense', amount: totalExpense, class: 'error', icon: '📉' }
    ].forEach(card => {
        const el = document.createElement('div');
        el.className = `stat-card ${card.class}`;
        el.innerHTML = `
            <div>
                <div class="stat-label">${card.title}</div>
                <div class="stat-value">${formatCurrency(card.amount)}</div>
            </div>
            <div class="stat-icon">${card.icon}</div>
        `;
        summaryCards.appendChild(el);
    });
}

function updateBudgetStatus() {
    const budgetStatus = document.getElementById('budgetStatus');
    if (appState.budget <= 0) {
        budgetStatus.style.display = 'none';
        return;
    }

    const currentMonthExpense = appState.transactions
        .filter(t => {
            const now = new Date();
            const d = new Date(t.date);
            return t.type === 'expense' && d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
        })
        .reduce((sum, t) => sum + t.amount, 0);

    const remaining = Math.max(0, appState.budget - currentMonthExpense);
    const percentage = Math.min(100, (currentMonthExpense / appState.budget) * 100);

    document.getElementById('budgetAmount').textContent = formatCurrency(appState.budget);
    document.getElementById('budgetSpent').textContent = formatCurrency(currentMonthExpense);
    document.getElementById('budgetRemaining').textContent = formatCurrency(remaining);
    document.getElementById('budgetRemaining').style.color = remaining > 0 ? 'var(--color-success)' : 'var(--color-error)';
    document.getElementById('budgetBar').style.width = `${percentage}%`;

    budgetStatus.style.display = 'block';
}

// ========== CRUD ==========
function addTransaction(e) {
    e.preventDefault();

    const category = categoryInput.value;
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;
    const date = dateInput.value;
    const description = descriptionInput.value;

    if (!category || !amount || !type || !date || amount <= 0) {
        showAlert('Invalid input', 'error');
        return;
    }

    appState.transactions.unshift({
        id: Date.now().toString(),
        category,
        amount,
        type,
        date,
        description,
        deleted: false
    });

    saveState();
    transactionForm.reset();
    setDefaultDate();
    showAlert('Transaction added successfully!', 'success');
    renderAll();
}

function deleteTransaction(id) {
    if (!confirm('Delete this transaction?')) return;
    appState.transactions = appState.transactions.filter(t => t.id !== id);
    saveState();
    renderAll();
}

function editTransaction(id) {
    const t = appState.transactions.find(t => t.id === id);
    if (!t) return;

    categoryInput.value = t.category;
    amountInput.value = t.amount;
    typeInput.value = t.type;
    dateInput.value = t.date;
    descriptionInput.value = t.description;

    deleteTransaction(id);
}

function clearAllData() {
    if (!confirm('Delete all data?')) return;
    appState.transactions = [];
    appState.budget = 0;
    saveState();
    renderAll();
}

// ========== Budget ==========
function setBudget() {
    const value = parseFloat(budgetInput.value);
    if (!value || value <= 0) {
        showAlert('Invalid budget', 'error');
        return;
    }
    appState.budget = value;
    saveState();
    budgetInput.value = '';
    updateBudgetStatus();
}

// ========== Export / Import ==========
function exportData() {
    const blob = new Blob([JSON.stringify(appState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'finance-data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function importData() {
    importFile.click();
}

// ========== Init ==========
function renderAll() {
    renderStats();
    renderTransactions();
    renderCategoryBreakdown();
    renderSummaryCards();
}

document.addEventListener('DOMContentLoaded', () => {
    window.transactionForm = document.getElementById('transactionForm');
    window.categoryInput = document.getElementById('category');
    window.amountInput = document.getElementById('amount');
    window.typeInput = document.getElementById('type');
    window.dateInput = document.getElementById('date');
    window.descriptionInput = document.getElementById('description');
    window.budgetInput = document.getElementById('budgetInput');
    window.importFile = document.getElementById('importFile');

    // Define missing DOM element variables
    const filterType = document.getElementById('filterType');
    const sortBy = document.getElementById('sortBy');
    const clearData = document.getElementById('clearData');
    const setBudgetBtn = document.getElementById('setBudget');
    const exportDataBtn = document.getElementById('exportData');
    const importDataBtn = document.getElementById('importData');

    loadState();
    renderAll();

    // Form and filter event listeners
    transactionForm.addEventListener('submit', addTransaction);
    filterType.addEventListener('change', renderTransactions);
    sortBy.addEventListener('change', renderTransactions);
    clearData.addEventListener('click', clearAllData);
    setBudgetBtn.addEventListener('click', setBudget);
    exportDataBtn.addEventListener('click', exportData);
    importDataBtn.addEventListener('click', importData);

    // Import file handler
    importFile.addEventListener('change', e => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            try {
                const data = JSON.parse(ev.target.result);
                appState.transactions = data.transactions || [];
                appState.budget = data.budget || 0;
                saveState();
                renderAll();
                showAlert('Data imported successfully!', 'success');
            } catch (error) {
                showAlert('Error importing data', 'error');
            }
        };
        reader.readAsText(file);
        importFile.value = '';
    });

    // Report modal event listeners
    document.getElementById('generateReport').addEventListener('click', generateReport);
    document.getElementById('printReport').addEventListener('click', printReport);
    document.getElementById('closeReport').addEventListener('click', () => {
        document.getElementById('reportModal').classList.remove('active');
    });
    document.getElementById('closeReportBtn').addEventListener('click', () => {
        document.getElementById('reportModal').classList.remove('active');
    });
    document.getElementById('reportModal').addEventListener('click', (e) => {
        if (e.target.id === 'reportModal') {
            document.getElementById('reportModal').classList.remove('active');
        }
    });
});

// ========== Report Generation ==========
function generateReport() {
    const totalIncome = appState.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = appState.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;
    const categories = {};

    appState.transactions.forEach(t => {
        if (!categories[t.category]) {
            categories[t.category] = 0;
        }
        if (t.type === 'expense') {
            categories[t.category] += t.amount;
        }
    });

    const topExpenses = Object.entries(categories)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const reportContent = document.getElementById('reportContent');
    reportContent.innerHTML = `
        <div style="margin-bottom: var(--space-16);">
            <h4 style="margin-bottom: var(--space-8);">Financial Summary</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-12);">
                <div style="padding: var(--space-12); background: var(--color-secondary); border-radius: var(--radius-base);">
                    <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-4);">Total Income</div>
                    <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--color-success);">${formatCurrency(totalIncome)}</div>
                </div>
                <div style="padding: var(--space-12); background: var(--color-secondary); border-radius: var(--radius-base);">
                    <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-4);">Total Expense</div>
                    <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: var(--color-error);">${formatCurrency(totalExpense)}</div>
                </div>
                <div style="padding: var(--space-12); background: var(--color-secondary); border-radius: var(--radius-base);">
                    <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-4);">Balance</div>
                    <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold); color: ${balance >= 0 ? 'var(--color-success)' : 'var(--color-error)'};">${formatCurrency(balance)}</div>
                </div>
                <div style="padding: var(--space-12); background: var(--color-secondary); border-radius: var(--radius-base);">
                    <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary); margin-bottom: var(--space-4);">Transactions</div>
                    <div style="font-size: var(--font-size-2xl); font-weight: var(--font-weight-bold);">${appState.transactions.length}</div>
                </div>
            </div>
        </div>

        ${topExpenses.length > 0 ? `
            <div>
                <h4 style="margin-bottom: var(--space-8); margin-top: var(--space-16);">Top Spending Categories</h4>
                <div style="display: flex; flex-direction: column; gap: var(--space-8);">
                    ${topExpenses.map(([category, amount]) => `
                        <div style="padding: var(--space-12); background: var(--color-secondary); border-radius: var(--radius-base); display: flex; justify-content: space-between;">
                            <span>${category}</span>
                            <strong>${formatCurrency(amount)}</strong>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}

        <div style="margin-top: var(--space-16); padding: var(--space-12); background: var(--color-secondary); border-radius: var(--radius-base); font-size: var(--font-size-sm); color: var(--color-text-secondary);">
            <p>Report generated on ${new Date().toLocaleString('en-IN')}</p>
        </div>
    `;

    document.getElementById('reportModal').classList.add('active');
}

function printReport() {
    const reportContent = document.getElementById('reportContent').innerHTML;
    const printWindow = window.open('', '', 'width=900,height=600');
    printWindow.document.write(`
        <html>
        <head>
            <title>Financial Report</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
                h4 { margin: 20px 0 10px 0; }
                div { margin-bottom: 10px; }
                strong { color: #2a8c8d; }
            </style>
        </head>
        <body>${reportContent}</body>
        </html>
    `);
    printWindow.document.close();
    printWindow.print();
}
