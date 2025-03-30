import React, { useContext, useState, useEffect } from 'react';
import { SavingsContext } from '../context/SavingsContext';
import { LoadingSpinner } from '../components';

/**
 * Savings coach page component to manage savings goals
 * 
 * @returns {JSX.Element} Savings coach page
 */
const SavingsCoachPage = () => {
  const { goals, loading, fetchGoals } = useContext(SavingsContext);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        await fetchGoals();
      } catch (error) {
        console.error('Error loading savings data:', error);
      } finally {
        setPageLoading(false);
      }
    };

    loadData();
  }, [fetchGoals]);

  if (pageLoading || loading) {
    return (
      <div className="page-container loading-container">
        <LoadingSpinner size="large" text="Loading savings coach..." theme="success" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Savings Coach</h1>
        <p>Set and achieve your financial goals with personalized guidance</p>
      </div>

      <div className="content-card">
        <h2>Your Savings Goals</h2>
        <p>This is a placeholder for the savings coach page. It will display savings goals and progress tracking.</p>
      </div>
    </div>
  );
};

export default SavingsCoachPage;