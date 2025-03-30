import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { BudgetContext } from '../context/BudgetContext';
import { SavingsContext } from '../context/SavingsContext';
import { GamificationContext } from '../context/GamificationContext';
import LoadingScreen from '../components/LoadingScreen';
import LoadingSpinner from '../components/LoadingSpinner';
import BudgetSummaryCard from '../components/BudgetSummaryCard';
import SavingsGoalCard from '../components/SavingsGoalCard';
import '../styles/DashboardPage.css';

/**
 * Dashboard page component that shows an overview of user's financial status
 * Also demonstrates the new LoadingScreen with financial mascots
 * 
 * @returns {JSX.Element} Dashboard page
 */
const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const { budgetSummary } = useContext(BudgetContext);
  const { savingsGoals } = useContext(SavingsContext);
  const { badges, updateProgress } = useContext(GamificationContext);

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [loadingMascot, setLoadingMascot] = useState('coin');
  const [isShowcasing, setIsShowcasing] = useState(false);
  
  // Simulate loading data
  useEffect(() => {
    const fetchDashboardData = async () => {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Sample data - in real app would come from API
      const data = {
        recentTransactions: [
          { id: 1, name: 'Salary', amount: 50000, date: '2023-10-01', type: 'income', category: 'Salary' },
          { id: 2, name: 'Rent', amount: 15000, date: '2023-10-02', type: 'expense', category: 'Housing' },
          { id: 3, name: 'Groceries', amount: 3000, date: '2023-10-03', type: 'expense', category: 'Food' },
        ],
        upcomingPayments: [
          { id: 1, name: 'Electricity Bill', amount: 2000, dueDate: '2023-10-15', isPaid: false },
          { id: 2, name: 'Internet Bill', amount: 1200, dueDate: '2023-10-18', isPaid: false },
        ],
        savingsProgress: [
          { id: 1, name: 'Emergency Fund', target: 50000, current: 30000, deadline: '2023-12-31' },
          { id: 2, name: 'Vacation', target: 40000, current: 15000, deadline: '2024-03-01' }
        ],
        financialInsights: [
          'You\'ve spent 20% less on dining out this month. Great job!',
          'Your emergency fund is 60% funded, keep going!',
          'Consider setting up automatic transfers to your savings goals.'
        ]
      };
      
      setDashboardData(data);
      setLoading(false);
      
      // Award badge for visiting dashboard (for demo purposes)
      if (updateProgress) {
        updateProgress(5);
      }
    };
    
    fetchDashboardData();
  }, [updateProgress]);
  
  // Function to showcase different mascots
  const showcaseMascot = (mascotType) => {
    setIsShowcasing(true);
    setLoadingMascot(mascotType);
    
    // Hide the showcase after 3 seconds
    setTimeout(() => {
      setIsShowcasing(false);
    }, 3000);
  };
  
  // Main loading screen while data is being fetched
  if (loading) {
    return <LoadingScreen 
      show={true} 
      message="Preparing your financial dashboard..." 
      theme="primary"
      mascotType="chart"
    />;
  }
  
  return (
    <div className="dashboard-page">
      {/* Showcase the selected mascot when button is clicked */}
      {isShowcasing && (
        <LoadingScreen 
          show={true} 
          message={`Meet the ${loadingMascot} mascot!`} 
          theme="primary" 
          mascotType={loadingMascot}
        />
      )}
    
      <header className="dashboard-header">
        <h1>Welcome back, {user?.name || 'Buddy'}!</h1>
        <p className="dashboard-date">
          {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </header>
      
      <section className="mascot-showcase">
        <h2>Loading Screen Mascot Showcase</h2>
        <p>Click on a mascot to preview our animated loading screens:</p>
        
        <div className="mascot-buttons">
          <button 
            className="mascot-button coin-button" 
            onClick={() => showcaseMascot('coin')}
          >
            Coin Mascot
          </button>
          <button 
            className="mascot-button piggy-button" 
            onClick={() => showcaseMascot('piggy')}
          >
            Piggy Bank Mascot
          </button>
          <button 
            className="mascot-button chart-button" 
            onClick={() => showcaseMascot('chart')}
          >
            Chart Mascot
          </button>
          <button 
            className="mascot-button rocket-button" 
            onClick={() => showcaseMascot('rocket')}
          >
            Rocket Mascot
          </button>
        </div>
      </section>
      
      <section className="dashboard-summary">
        <h2>Financial Summary</h2>
        <div className="summary-cards">
          <BudgetSummaryCard
            title="Total Income"
            amount={60000}
            icon="💰"
            trend="up"
            trendText="5% increase from last month"
            colorClass="success"
          />
          <BudgetSummaryCard
            title="Total Expenses"
            amount={35000}
            icon="💸"
            trend="down"
            trendText="3% decrease from last month"
            colorClass="danger"
          />
          <BudgetSummaryCard
            title="Savings"
            amount={25000}
            total={60000}
            icon="🏦"
            trend="up"
            trendText="10% increase from last month"
            colorClass="primary"
          />
          <BudgetSummaryCard
            title="Investments"
            amount={20000}
            icon="📈"
            trend="up"
            trendText="2% increase in portfolio value"
            colorClass="warning"
          />
        </div>
      </section>

      <section className="dashboard-savings-goals">
        <h2>Savings Goals</h2>
        <div className="savings-goals-grid">
          {dashboardData.savingsProgress.map(goal => (
            <SavingsGoalCard
              key={goal.id}
              goal={{
                id: goal.id,
                name: goal.name,
                target: goal.target,
                current: goal.current,
                deadline: goal.deadline,
                icon: goal.name.includes('Emergency') ? '🚨' : '🏝️',
                category: goal.name.includes('Emergency') ? 'Emergency' : 'Personal'
              }}
              onContribute={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      </section>

      <section className="dashboard-insights">
        <h2>Financial Insights</h2>
        <div className="insights-list">
          {dashboardData.financialInsights.map((insight, index) => (
            <div key={index} className="insight-card">
              <div className="insight-icon">💡</div>
              <p>{insight}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-upcoming">
        <h2>Upcoming Payments</h2>
        <div className="upcoming-payments">
          {dashboardData.upcomingPayments.map(payment => (
            <div key={payment.id} className="payment-card">
              <div className="payment-info">
                <h3>{payment.name}</h3>
                <p className="payment-amount">₹{payment.amount.toLocaleString('en-IN')}</p>
                <p className="payment-date">Due: {new Date(payment.dueDate).toLocaleDateString('en-IN')}</p>
              </div>
              <button className="pay-button">Pay Now</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;