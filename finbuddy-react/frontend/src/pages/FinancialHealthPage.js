import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { BudgetContext } from '../context/BudgetContext';
import { SavingsContext } from '../context/SavingsContext';
import { LoadingSpinner } from '../components';

/**
 * Financial health page component
 * 
 * @returns {JSX.Element} Financial health page
 */
const FinancialHealthPage = () => {
  const { budgetSummary } = useContext(BudgetContext);
  const { goals } = useContext(SavingsContext);
  const [healthScore, setHealthScore] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinancialHealth = async () => {
      try {
        if (budgetSummary) {
          const response = await axios.get('/api/financial-health/score');
          setHealthScore(response.data.score);
          setRecommendations(response.data.recommendations || []);
        }
      } catch (error) {
        console.error('Error fetching financial health data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinancialHealth();
  }, [budgetSummary, goals]);

  if (loading) {
    return (
      <div className="page-container loading-container">
        <LoadingSpinner size="large" text="Calculating your financial health..." theme="primary" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Financial Health</h1>
        <p>Track your overall financial wellbeing</p>
      </div>

      <div className="content-card">
        <h2>Your Financial Health Score</h2>
        <p>This is a placeholder for the financial health page. It will display financial health metrics and personalized recommendations.</p>
      </div>
    </div>
  );
};

export default FinancialHealthPage;