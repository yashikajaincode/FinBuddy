import { createContext, useContext, useState } from 'react';

const FinancialContext = createContext();

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};

export const FinancialProvider = ({ children }) => {
  const [financialData, setFinancialData] = useState(() => {
    const savedData = localStorage.getItem('financialData');
    return savedData ? JSON.parse(savedData) : {
      totalBalance: 0,
      monthlyIncome: 0,
      monthlyExpenses: 0,
      goals: [],
      transactions: [],
      budget: {
        categories: [],
        limits: {}
      },
      investments: {
        portfolio: [],
        riskTolerance: 'moderate'
      },
      error: null
    };
  });

  const handleError = (error) => {
    setFinancialData(prev => ({
      ...prev,
      error: error.message || 'An error occurred'
    }));
  };

  const updateFinancialData = (newData) => {
    setFinancialData(prev => {
      const updatedData = {
        ...prev,
        ...newData
      };

      // Save to localStorage after each update
      localStorage.setItem('financialData', JSON.stringify(updatedData));

      // Update goals if financial data changes affect them or when goals are modified
      if (newData.monthlyIncome !== undefined || newData.monthlyExpenses !== undefined || newData.goals) {
        const monthlyIncome = newData.monthlyIncome ?? prev.monthlyIncome;
        const monthlyExpenses = newData.monthlyExpenses ?? prev.monthlyExpenses;

        updatedData.goals = prev.goals.map(goal => {
          const targetDate = new Date(goal.targetDate);
          const today = new Date();
          const monthsToGoal = (targetDate.getFullYear() - today.getFullYear()) * 12 + 
                             (targetDate.getMonth() - today.getMonth());
          
          const remainingAmount = goal.targetAmount - goal.currentAmount;
          const recommendedMonthlySaving = remainingAmount / monthsToGoal;
          
          return {
            ...goal,
            recommendedMonthlySaving: Math.round(recommendedMonthlySaving)
          };
        });
      }

      // Update investment allocations if goals or risk tolerance changes
      if (newData.goals || newData.riskTolerance) {
        const goals = newData.goals ?? prev.goals;
        const riskTolerance = newData.riskTolerance ?? prev.investments.riskTolerance;
        
        updatedData.investments = {
          ...prev.investments,
          riskTolerance,
          portfolio: goals.map(goal => ({
            goalId: goal.id,
            allocation: goal.recommendedMonthlySaving,
            progress: (goal.currentAmount / goal.targetAmount) * 100
          }))
        };
      }

      return updatedData;
    });
  };

  const addTransaction = (transaction) => {
    setFinancialData(prev => {
      const updatedData = {
        ...prev,
        transactions: [transaction, ...prev.transactions],
        totalBalance: prev.totalBalance + (transaction.type === 'income' ? transaction.amount : -transaction.amount)
      };
      localStorage.setItem('financialData', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const updateGoalProgress = (goalId, amount) => {
    setFinancialData(prev => {
      const updatedData = {
        ...prev,
        goals: prev.goals.map(goal =>
          goal.id === goalId
            ? { ...goal, currentAmount: goal.currentAmount + amount }
            : goal
        )
      };
      localStorage.setItem('financialData', JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const value = {
    financialData,
    updateFinancialData,
    addTransaction,
    updateGoalProgress
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};