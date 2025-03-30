import React, { useContext, useState, useEffect } from 'react';
import { BudgetContext } from '../context/BudgetContext';
import { LoadingSpinner } from '../components';

/**
 * Budget planner page component to manage income and expenses
 * 
 * @returns {JSX.Element} Budget planner page
 */
const BudgetPlannerPage = () => {
  const { transactions, loading, fetchTransactions } = useContext(BudgetContext);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchTransactions();
      } catch (error) {
        console.error('Error loading budget data:', error);
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [fetchTransactions]);

  if (pageLoading || loading) {
    return (
      <div className="page-container loading-container">
        <LoadingSpinner size="large" text="Loading budget planner..." theme="primary" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Budget Planner</h1>
        <p>Track your income and expenses to stay on top of your finances</p>
      </div>

      <div className="content-card">
        <h2>Your Budget Overview</h2>
        <p>This is a placeholder for the budget planner page. It will display income and expense tracking features.</p>
      </div>
    </div>
  );
};

export default BudgetPlannerPage;