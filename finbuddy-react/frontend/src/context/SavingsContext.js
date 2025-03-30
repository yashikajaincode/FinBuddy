import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

// Create the Savings context
export const SavingsContext = createContext();

export const SavingsProvider = ({ children }) => {
  const { isAuthenticated, token } = useContext(AuthContext);
  
  // State for savings data
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [goalCategories, setGoalCategories] = useState([]);
  const [savingsSummary, setSavingsSummary] = useState({
    totalSaved: 0,
    totalTargets: 0,
    completedGoals: 0,
    inProgressGoals: 0,
    percentTowardAllGoals: 0,
    nearestGoal: null,
    recommendedMonthlySavings: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // API base URL - should be in an environment variable in production
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch savings data when the component mounts and when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchSavingsData();
    }
  }, [isAuthenticated]);

  // Calculate the savings summary whenever savings goals change
  useEffect(() => {
    calculateSavingsSummary();
  }, [savingsGoals]);

  // Fetch all savings goals and categories from the API
  const fetchSavingsData = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      // Configure headers with the authentication token
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      // Fetch savings goals and categories in parallel
      const [goalsResponse, categoriesResponse] = await Promise.all([
        axios.get(`${API_URL}/savings/goals`, config),
        axios.get(`${API_URL}/savings/categories`, config)
      ]);

      // Update state with the fetched data
      setSavingsGoals(goalsResponse.data);
      setGoalCategories(categoriesResponse.data);
    } catch (err) {
      console.error('Error fetching savings data:', err);
      setError('Failed to load your savings goals. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new savings goal
  const addSavingsGoal = async (goalData) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.post(`${API_URL}/savings/goals`, goalData, config);
      setSavingsGoals([...savingsGoals, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error adding savings goal:', err);
      setError('Failed to add savings goal. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing savings goal
  const updateSavingsGoal = async (id, goalData) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.put(`${API_URL}/savings/goals/${id}`, goalData, config);
      setSavingsGoals(savingsGoals.map(goal => goal.id === id ? response.data : goal));
      return response.data;
    } catch (err) {
      console.error('Error updating savings goal:', err);
      setError('Failed to update savings goal. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a savings goal
  const deleteSavingsGoal = async (id) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.delete(`${API_URL}/savings/goals/${id}`, config);
      setSavingsGoals(savingsGoals.filter(goal => goal.id !== id));
    } catch (err) {
      console.error('Error deleting savings goal:', err);
      setError('Failed to delete savings goal. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Contribute to a savings goal
  const contributeToGoal = async (id, amount) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.post(
        `${API_URL}/savings/goals/${id}/contribute`, 
        { amount }, 
        config
      );
      
      setSavingsGoals(savingsGoals.map(goal => goal.id === id ? response.data : goal));
      return response.data;
    } catch (err) {
      console.error('Error contributing to savings goal:', err);
      setError('Failed to add contribution. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate savings summary statistics
  const calculateSavingsSummary = () => {
    const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.current, 0);
    const totalTargets = savingsGoals.reduce((sum, goal) => sum + goal.target, 0);
    const completedGoals = savingsGoals.filter(goal => goal.current >= goal.target).length;
    const inProgressGoals = savingsGoals.length - completedGoals;
    const percentTowardAllGoals = totalTargets > 0 ? (totalSaved / totalTargets) * 100 : 0;

    // Find the nearest goal to completion (that's not already complete)
    const incompleteGoals = savingsGoals.filter(goal => goal.current < goal.target);
    const nearestGoal = incompleteGoals.length > 0
      ? incompleteGoals.reduce((nearest, current) => {
          const nearestPercent = nearest.current / nearest.target;
          const currentPercent = current.current / current.target;
          return currentPercent > nearestPercent ? current : nearest;
        }, incompleteGoals[0])
      : null;

    // Calculate recommended monthly savings based on remaining goals and their deadlines
    let recommendedMonthlySavings = 0;
    if (incompleteGoals.length > 0) {
      // Filter goals with valid deadlines
      const goalsWithDeadlines = incompleteGoals.filter(goal => goal.deadline);
      
      // Calculate total monthly savings needed for goals with deadlines
      if (goalsWithDeadlines.length > 0) {
        recommendedMonthlySavings = goalsWithDeadlines.reduce((total, goal) => {
          const deadlineDate = new Date(goal.deadline);
          const currentDate = new Date();
          
          // Calculate months between now and deadline (minimum 1 month)
          const monthsRemaining = Math.max(1, 
            ((deadlineDate.getFullYear() - currentDate.getFullYear()) * 12) + 
            (deadlineDate.getMonth() - currentDate.getMonth())
          );
          
          // Calculate remaining amount and monthly contribution needed
          const remainingAmount = goal.target - goal.current;
          const monthlyAmount = remainingAmount / monthsRemaining;
          
          return total + monthlyAmount;
        }, 0);
      } else {
        // If no goals have deadlines, recommend a flat 10% of the remaining target amounts
        const totalRemaining = incompleteGoals.reduce(
          (sum, goal) => sum + (goal.target - goal.current), 0
        );
        recommendedMonthlySavings = totalRemaining * 0.1; // 10% per month as a default
      }
    }

    setSavingsSummary({
      totalSaved,
      totalTargets,
      completedGoals,
      inProgressGoals,
      percentTowardAllGoals,
      nearestGoal,
      recommendedMonthlySavings
    });
  };

  // Value object to be provided to consumers of the context
  const value = {
    savingsGoals,
    goalCategories,
    savingsSummary,
    isLoading,
    error,
    fetchSavingsData,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    contributeToGoal
  };

  return <SavingsContext.Provider value={value}>{children}</SavingsContext.Provider>;
};