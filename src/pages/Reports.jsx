import { useState, useMemo } from 'react';
import { useFinancial } from '../context/FinancialContext';

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState('monthly');
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
  const { financialData } = useFinancial();
  const { transactions = [], monthlyIncome, monthlyExpenses } = financialData;

  const reports = useMemo(() => {
    const filteredTransactions = transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate.toISOString().slice(0, 7) === selectedMonth;
    });

    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Math.abs(Number(t.amount)), 0);

    const savings = income - expenses;
    const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0;

    const expensesByCategory = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + Math.abs(Number(t.amount));
        return acc;
      }, {});

    const topExpenses = Object.entries(expensesByCategory)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    const totalExpenses = Object.values(expensesByCategory).reduce((sum, amount) => sum + amount, 0);
    const expenseBreakdown = Object.entries(expensesByCategory).map(([category, amount]) => ({
      category,
      percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(2) : 0
    }));

    return {
      monthly: {
        income,
        expenses,
        savings,
        topExpenses,
        savingsRate,
        expenseBreakdown
      }
    };
  }, [transactions, selectedMonth]);

  const generatePDF = () => {
    // Placeholder for PDF generation functionality
    alert('PDF report generation will be implemented here');
  };

  const getMonthName = (dateString) => {
    const date = new Date(dateString + '-01');
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Reports</h1>
        <button
          onClick={generatePDF}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Download PDF Report
        </button>
      </div>

      {/* Report Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex space-x-4 items-center">
          <div>
            <label htmlFor="reportType" className="block text-sm font-medium text-gray-700">
              Report Type
            </label>
            <select
              id="reportType"
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            >
              <option value="monthly">Monthly Report</option>
              <option value="quarterly">Quarterly Report</option>
              <option value="yearly">Yearly Report</option>
            </select>
          </div>
          <div>
            <label htmlFor="month" className="block text-sm font-medium text-gray-700">
              Select Month
            </label>
            <input
              type="month"
              id="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900">Total Income</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">
            ₹{reports.monthly.income.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">{getMonthName(selectedMonth)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900">Total Expenses</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">
            ₹{reports.monthly.expenses.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">{getMonthName(selectedMonth)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900">Total Savings</h3>
          <p className="text-2xl font-bold text-primary-600 mt-2">
            ₹{reports.monthly.savings.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 mt-1">Savings Rate: {reports.monthly.savingsRate}%</p>
        </div>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Expense Breakdown</h2>
          <div className="space-y-4">
            {reports.monthly.expenseBreakdown.map((expense, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{expense.category}</span>
                  <span className="text-sm text-gray-500">{expense.percentage}%</span>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: `${expense.percentage}%` }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500"
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Expenses */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Top Expenses</h2>
          <div className="space-y-4">
            {reports.monthly.topExpenses.map((expense, index) => (
              <div key={index} className="flex justify-between items-center p-4 border rounded-lg">
                <div className="flex items-center">
                  <span className="text-lg font-medium">{expense.category}</span>
                </div>
                <span className="text-lg font-semibold text-red-600">
                  ₹{expense.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Financial Insights */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Financial Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-primary-600 mb-2">Spending Patterns</h3>
            <p className="text-sm text-gray-600">
              Housing expenses account for the largest portion of your monthly spending.
              Consider reviewing your housing costs for potential savings.
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <h3 className="font-medium text-primary-600 mb-2">Savings Goal Progress</h3>
            <p className="text-sm text-gray-600">
              Your current savings rate of {reports.monthly.savingsRate}% is good.
              Maintain this rate to reach your financial goals on schedule.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;