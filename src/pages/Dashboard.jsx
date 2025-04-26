import { useState } from 'react';
import FinancialDataForm from '../components/forms/FinancialDataForm';
import { useFinancial } from '../context/FinancialContext';

const Dashboard = () => {
  const { financialData, updateFinancialData } = useFinancial();
  const {
    totalBalance = 0,
    monthlyIncome = 0,
    monthlyExpenses = 0,
    goals = []
  } = financialData || {}; // <- safe default

  const [isEditing, setIsEditing] = useState(false);

  const formatCurrency = (value) => {
    return typeof value === 'number' ? `₹${value.toLocaleString()}` : '₹0';
  };

  const cards = [
    {
      title: 'Total Balance',
      amount: formatCurrency(totalBalance),
      icon: '💵',
      color: 'bg-blue-500'
    },
    {
      title: 'Monthly Income',
      amount: formatCurrency(monthlyIncome),
      icon: '📈',
      color: 'bg-green-500'
    },
    {
      title: 'Monthly Expenses',
      amount: formatCurrency(monthlyExpenses),
      icon: '📉',
      color: 'bg-red-500'
    },
    {
      title: 'Available for Goals',
      amount: formatCurrency(monthlyIncome - monthlyExpenses),
      icon: '🎯',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Financial Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className={`${card.color} rounded-lg p-6 text-white`}
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl">{card.icon}</span>
              <h3 className="text-lg font-semibold">{card.title}</h3>
            </div>
            <p className="mt-4 text-2xl font-bold">{card.amount}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Financial Data</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700"
            >
              {isEditing ? 'Cancel' : 'Edit Data'}
            </button>
          </div>

          {isEditing ? (
            <FinancialDataForm
              initialData={{ totalBalance, monthlyIncome, monthlyExpenses }}
              onSubmit={(data) => {
                updateFinancialData({
                  totalBalance: data.totalBalance,
                  monthlyIncome: data.monthlyIncome,
                  monthlyExpenses: data.monthlyExpenses,
                  goals: data.goals || goals
                });
                setIsEditing(false);
              }}
            />
          ) : null}

          {goals.length > 0 && !isEditing && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-4">Your Financial Goals</h3>
              <div className="space-y-4">
                {goals.map((goal, index) => {
                  const progress = goal.targetAmount
                    ? (goal.currentAmount / goal.targetAmount) * 100
                    : 0;

                  return (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-medium">{goal.name || 'Unnamed Goal'}</h4>
                        <span className="text-sm text-gray-500">
                          Target: {goal.targetDate ? new Date(goal.targetDate).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="mb-2">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-primary-600 h-2.5 rounded-full"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Current: {formatCurrency(goal.currentAmount)}</span>
                        <span>Target: {formatCurrency(goal.targetAmount)}</span>
                      </div>
                      {goal.recommendedMonthlySaving !== undefined && (
                        <p className="mt-2 text-sm text-primary-600">
                          Recommended monthly saving: {formatCurrency(goal.recommendedMonthlySaving)}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
