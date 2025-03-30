import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingSpinner } from '../components';

/**
 * Finance tips page component
 * 
 * @returns {JSX.Element} Finance tips page
 */
const FinanceTipsPage = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFinanceTips = async () => {
      try {
        const response = await axios.get('/api/content/finance-tips');
        setTips(response.data);
      } catch (error) {
        console.error('Error fetching finance tips:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceTips();
  }, []);

  if (loading) {
    return (
      <div className="page-container loading-container">
        <LoadingSpinner size="large" text="Loading finance tips..." theme="warning" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Finance Tips</h1>
        <p>Practical advice to improve your financial habits</p>
      </div>

      <div className="content-card">
        <h2>Daily Financial Wisdom</h2>
        <p>This is a placeholder for the finance tips page. It will display financial advice and tips.</p>
      </div>
    </div>
  );
};

export default FinanceTipsPage;