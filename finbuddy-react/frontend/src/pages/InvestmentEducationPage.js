import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LoadingSpinner } from '../components';

/**
 * Investment education page component
 * 
 * @returns {JSX.Element} Investment education page
 */
const InvestmentEducationPage = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestmentModules = async () => {
      try {
        const response = await axios.get('/api/content/investment-modules');
        setModules(response.data);
      } catch (error) {
        console.error('Error fetching investment modules:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestmentModules();
  }, []);

  if (loading) {
    return (
      <div className="page-container loading-container">
        <LoadingSpinner size="large" text="Loading investment education..." theme="primary" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Investment Education</h1>
        <p>Learn about different investment options and strategies</p>
      </div>

      <div className="content-card">
        <h2>Investment Fundamentals</h2>
        <p>This is a placeholder for the investment education page. It will display investment modules and tutorials.</p>
      </div>
    </div>
  );
};

export default InvestmentEducationPage;