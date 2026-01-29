# 💰 Personal Finance Tracker

A modern, feature-rich web application for tracking personal finances, managing budgets, and analyzing spending patterns. Built with vanilla HTML, CSS, and JavaScript for simplicity and performance.

![Personal Finance Tracker](https://img.shields.io/badge/version-2.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## ✨ Features

### Core Functionality
- **Transaction Management**: Add, view, and delete income and expense transactions
- **Smart Categorization**: Pre-defined categories with emoji icons for easy identification
  - Income: Salary, Bonus, Investment
  - Expenses: Food & Dining, Transport, Entertainment, Utilities, Healthcare, Shopping, Other
- **Real-time Dashboard**: Live statistics showing total income, expenses, and balance
- **Budget Tracking**: Set monthly budget limits with visual progress indicators
- **Category Breakdown**: Detailed spending analysis by category

### Advanced Features
- **Filtering & Sorting**: 
  - Filter transactions by type (Income/Expense/All)
  - Sort by date (latest/oldest) or amount (high/low)
- **Data Management**:
  - Export transactions as JSON
  - Import transactions from JSON files
  - Generate detailed financial reports
  - Clear all data option
- **Visual Feedback**: 
  - Color-coded transactions (green for income, red for expenses)
  - Budget alerts when spending exceeds limits
  - Animated UI elements for better user experience

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No additional dependencies or installations required!

### Installation

1. **Clone or download** this repository to your local machine:
   ```bash
   git clone <repository-url>
   ```

2. **Navigate** to the project directory:
   ```bash
   cd pf-tracker-2
   ```

3. **Open** `index.html` in your web browser:
   - Double-click the `index.html` file, or
   - Right-click and select "Open with" your preferred browser, or
   - Use a local development server (optional):
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js
     npx serve
     ```

4. **Start tracking** your finances!

## 📖 Usage Guide

### Adding Transactions
1. Select a **Category** from the dropdown menu
2. Enter the **Amount** (e.g., 1500.00)
3. Choose **Type** (Income or Expense)
4. Select the **Date** of the transaction
5. Add an optional **Description** for notes
6. Click **Add Transaction**

### Setting a Budget
1. Navigate to the **Monthly Budget** section in the right sidebar
2. Enter your desired monthly budget limit
3. Click **Set** to activate budget tracking
4. Monitor your spending with the visual progress bar

### Filtering & Sorting
- Use the **Filter by Type** dropdown to show only income or expense transactions
- Use the **Sort by** dropdown to organize transactions by date or amount

### Data Management
- **Export**: Download your transaction data as a JSON file for backup
- **Import**: Upload a previously exported JSON file to restore data
- **Generate Report**: View a comprehensive financial summary
- **Clear All Data**: Remove all transactions (use with caution!)

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Semantic markup and structure
- **CSS3**: Modern styling with CSS variables, flexbox, and grid
- **Vanilla JavaScript**: No frameworks or libraries required
- **LocalStorage API**: Client-side data persistence

### Project Structure
```
pf-tracker-2/
├── index.html      # Main HTML structure
├── styles.css      # Complete styling and design system
├── script.js       # Application logic and functionality
└── README.md       # This file
```

### Key Features in Code
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Data Persistence**: All data is stored locally in the browser using LocalStorage
- **Modular JavaScript**: Clean, organized code with reusable functions
- **CSS Variables**: Consistent design system with customizable theme tokens
- **Form Validation**: Built-in validation for required fields

## 🎨 Design Highlights

- **Modern UI/UX**: Clean, professional interface with smooth animations
- **Color-Coded System**: 
  - Income transactions in green
  - Expense transactions in red
  - Budget status with gradient indicators
- **Emoji Icons**: Visual category identification for quick scanning
- **Responsive Layout**: Adapts to different screen sizes automatically

## 💾 Data Storage

All transaction data is stored locally in your browser using the LocalStorage API. This means:
- ✅ Your data stays private and secure on your device
- ✅ No internet connection required
- ✅ Fast and instant access
- ⚠️ Data is browser-specific (clearing browser data will remove transactions)
- ⚠️ Use the Export feature regularly to backup your data

## 🔒 Privacy & Security

- **100% Client-Side**: No data is sent to any server
- **No Tracking**: No analytics or third-party scripts
- **Offline Capable**: Works completely offline after initial load
- **Your Data, Your Control**: Export and backup anytime

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs or issues
- Suggest new features
- Submit pull requests
- Improve documentation

## 📝 License

This project is licensed under the MIT License - feel free to use it for personal or commercial projects.

## 🙏 Acknowledgments

- Built with ❤️ for better financial management
- Designed for simplicity and ease of use
- Inspired by modern personal finance tools

## 📧 Support

If you encounter any issues or have questions:
1. Check the usage guide above
2. Review the code comments in `script.js`
3. Open an issue in the repository

---

**Happy Budgeting! 💸**
