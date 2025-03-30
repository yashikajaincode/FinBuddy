/**
 * Constants and static data for the FinBuddy application
 */

// Budget categories with icons
export const EXPENSE_CATEGORIES = [
  { id: 'housing', name: 'Housing', icon: 'home' },
  { id: 'utilities', name: 'Utilities', icon: 'bolt' },
  { id: 'groceries', name: 'Groceries', icon: 'shopping_basket' },
  { id: 'transportation', name: 'Transportation', icon: 'directions_car' },
  { id: 'health', name: 'Healthcare', icon: 'local_hospital' },
  { id: 'education', name: 'Education', icon: 'school' },
  { id: 'entertainment', name: 'Entertainment', icon: 'movie' },
  { id: 'dining', name: 'Dining Out', icon: 'restaurant' },
  { id: 'shopping', name: 'Shopping', icon: 'shopping_cart' },
  { id: 'personal', name: 'Personal Care', icon: 'spa' },
  { id: 'debt', name: 'Debt Payments', icon: 'credit_card' },
  { id: 'savings', name: 'Savings', icon: 'savings' },
  { id: 'insurance', name: 'Insurance', icon: 'security' },
  { id: 'subscriptions', name: 'Subscriptions', icon: 'subscriptions' },
  { id: 'gifts', name: 'Gifts & Donations', icon: 'card_giftcard' },
  { id: 'travel', name: 'Travel', icon: 'flight' },
  { id: 'pets', name: 'Pets', icon: 'pets' },
  { id: 'investments', name: 'Investments', icon: 'trending_up' },
  { id: 'taxes', name: 'Taxes', icon: 'receipt' },
  { id: 'childcare', name: 'Childcare', icon: 'child_care' },
  { id: 'other', name: 'Other', icon: 'more_horiz' }
];

// Income categories
export const INCOME_CATEGORIES = [
  { id: 'salary', name: 'Salary', icon: 'work' },
  { id: 'freelance', name: 'Freelance', icon: 'computer' },
  { id: 'business', name: 'Business', icon: 'store' },
  { id: 'investments', name: 'Investments', icon: 'trending_up' },
  { id: 'rental', name: 'Rental Income', icon: 'apartment' },
  { id: 'gifts', name: 'Gifts', icon: 'card_giftcard' },
  { id: 'other', name: 'Other', icon: 'more_horiz' }
];

// Sample savings goals
export const SAMPLE_SAVINGS_GOALS = [
  {
    id: 'emergency',
    name: 'Emergency Fund',
    targetAmount: 100000,
    currentAmount: 25000,
    targetDate: '2023-12-31',
    icon: 'shield',
    description: 'Build a 3-month emergency fund for unexpected expenses'
  },
  {
    id: 'vacation',
    name: 'Goa Vacation',
    targetAmount: 50000,
    currentAmount: 15000,
    targetDate: '2024-05-15',
    icon: 'beach_access',
    description: 'Summer vacation to Goa with friends'
  },
  {
    id: 'downpayment',
    name: 'Home Down Payment',
    targetAmount: 1000000,
    currentAmount: 200000,
    targetDate: '2026-06-30',
    icon: 'home',
    description: 'Save for a 20% down payment on a home'
  }
];

// Financial literacy milestones
export const FINANCIAL_LITERACY_MILESTONES = [
  { id: 'budget', name: 'Create First Budget', xp: 100, icon: 'assignment' },
  { id: 'emergency', name: 'Start Emergency Fund', xp: 150, icon: 'shield' },
  { id: 'expenses', name: 'Track Expenses for 30 Days', xp: 200, icon: 'fact_check' },
  { id: 'debt', name: 'Create Debt Repayment Plan', xp: 250, icon: 'credit_card' },
  { id: 'saving', name: 'Set Up Automatic Savings', xp: 300, icon: 'savings' },
  { id: 'invest', name: 'Make First Investment', xp: 400, icon: 'trending_up' },
  { id: 'retirement', name: 'Open Retirement Account', xp: 500, icon: 'account_balance' }
];

// Investment education modules
export const INVESTMENT_MODULES = [
  {
    id: 'basics',
    title: 'Investment Basics',
    description: 'Learn the fundamental concepts of investing and building wealth',
    lessons: [
      { id: 'basics-1', title: 'What is Investing?', duration: '10 min' },
      { id: 'basics-2', title: 'Risk vs. Return', duration: '15 min' },
      { id: 'basics-3', title: 'The Power of Compounding', duration: '10 min' },
      { id: 'basics-4', title: 'Asset Classes', duration: '20 min' }
    ]
  },
  {
    id: 'stocks',
    title: 'Stock Market Fundamentals',
    description: 'Understand how the stock market works and how to evaluate companies',
    lessons: [
      { id: 'stocks-1', title: 'How the Stock Market Works', duration: '15 min' },
      { id: 'stocks-2', title: 'Understanding Stock Valuations', duration: '20 min' },
      { id: 'stocks-3', title: 'Reading Financial Statements', duration: '25 min' },
      { id: 'stocks-4', title: 'Dividend Investing', duration: '15 min' }
    ]
  },
  {
    id: 'mutual-funds',
    title: 'Mutual Funds & ETFs',
    description: 'Explore mutual funds and ETFs as vehicles for diversified investing',
    lessons: [
      { id: 'mf-1', title: 'Mutual Funds Explained', duration: '15 min' },
      { id: 'mf-2', title: 'Index Funds vs. Active Funds', duration: '20 min' },
      { id: 'mf-3', title: 'Understanding Expense Ratios', duration: '10 min' },
      { id: 'mf-4', title: 'ETFs vs. Mutual Funds', duration: '15 min' }
    ]
  }
];

// Financial tips
export const FINANCIAL_TIPS = [
  {
    category: 'Budgeting',
    tips: [
      'Follow the 50/30/20 rule: 50% on needs, 30% on wants, and 20% on savings and debt repayment',
      'Use cash envelopes for spending categories where you tend to overspend',
      'Review your budget monthly and adjust as needed based on changing circumstances',
      'Include irregular expenses like annual insurance premiums in your monthly budget by dividing by 12',
      'Track every expense for at least 30 days to get an accurate picture of your spending habits'
    ]
  },
  {
    category: 'Saving',
    tips: [
      'Build an emergency fund with 3-6 months of expenses before focusing on other financial goals',
      'Set up automatic transfers to savings accounts on payday to pay yourself first',
      'Use the 30-day rule: wait 30 days before making any non-essential purchase over ₹5,000',
      'Challenge yourself with no-spend days or weeks to reset your spending habits',
      'Save windfalls like bonuses, tax refunds, or gifts rather than spending them'
    ]
  },
  {
    category: 'Debt Management',
    tips: [
      'Use the avalanche method (paying off highest interest debt first) to minimize interest costs',
      'Consider the snowball method (paying off smallest balances first) if you need psychological wins',
      'Avoid taking on new debt while paying off existing debts',
      'Negotiate with creditors for lower interest rates or better payment terms',
      'Consider debt consolidation if you can qualify for a significantly lower interest rate'
    ]
  },
  {
    category: 'Investing',
    tips: [
      'Start investing early to take advantage of compounding returns',
      'Diversify your investments across different asset classes to reduce risk',
      'Invest regularly regardless of market conditions (dollar-cost averaging)',
      'Keep investment costs low by choosing index funds or ETFs with low expense ratios',
      'Rebalance your portfolio annually to maintain your target asset allocation'
    ]
  }
];

// Budget rules of thumb
export const BUDGET_RULES = [
  {
    name: '50/30/20 Rule',
    description: 'Allocate 50% of income to needs, 30% to wants, and 20% to savings and debt repayment'
  },
  {
    name: '30% Housing Rule',
    description: 'Spend no more than 30% of your gross income on housing costs'
  },
  {
    name: '20% Savings Rule',
    description: 'Save at least 20% of your income for future goals and emergencies'
  },
  {
    name: '5% Charitable Giving',
    description: 'Aim to donate at least 5% of your income to charitable causes'
  },
  {
    name: '10% Retirement Rule',
    description: 'Contribute at least 10% of your income to retirement accounts'
  }
];

// Common financial terms for glossary
export const FINANCIAL_TERMS = [
  {
    term: 'Compound Interest',
    definition: 'Interest calculated on both the initial principal and the accumulated interest from previous periods'
  },
  {
    term: 'Emergency Fund',
    definition: 'Money set aside for unexpected expenses or financial emergencies, typically 3-6 months of living expenses'
  },
  {
    term: 'Debt-to-Income Ratio',
    definition: 'Your total monthly debt payments divided by your gross monthly income, expressed as a percentage'
  },
  {
    term: 'Asset Allocation',
    definition: 'The strategy of dividing investments among different asset categories like stocks, bonds, and cash'
  },
  {
    term: 'Diversification',
    definition: 'Spreading investments across various assets to reduce risk and potential losses'
  },
  {
    term: 'Inflation',
    definition: 'The rate at which the general level of prices for goods and services rises, causing purchasing power to fall'
  },
  {
    term: 'Mutual Fund',
    definition: 'An investment vehicle that pools money from many investors to purchase securities'
  },
  {
    term: 'Net Worth',
    definition: 'The total value of your assets minus your liabilities (debts)'
  },
  {
    term: 'SIP (Systematic Investment Plan)',
    definition: 'A method of investing a fixed amount regularly in mutual funds, similar to dollar-cost averaging'
  },
  {
    term: 'PPF (Public Provident Fund)',
    definition: 'A long-term investment scheme backed by the Government of India, offering tax benefits under Section 80C'
  }
];

// Sample affordability calculations
export const AFFORDABILITY_EXAMPLES = {
  home: {
    price: 5000000,
    downPayment: 1000000,
    loanTerm: 20,
    interestRate: 8.5,
    annualIncome: 1200000,
    monthlyDebt: 20000
  },
  car: {
    price: 800000,
    downPayment: 200000,
    loanTerm: 5,
    interestRate: 9.5,
    annualIncome: 800000,
    monthlyDebt: 15000
  }
};