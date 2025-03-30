import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

// Create the Budget context
export const BudgetContext = createContext();

export const BudgetProvider = ({ children }) => {
  const { isAuthenticated, token } = useContext(AuthContext);
  
  // State for budget data
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgetSummary, setBudgetSummary] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    savingsRate: 0,
    expensesByCategory: {},
    topExpenseCategories: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // API base URL - should be in an environment variable in production
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  // Fetch budget data when the component mounts and when authentication state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchBudgetData();
    }
  }, [isAuthenticated]);

  // Calculate the budget summary whenever income or expenses change
  useEffect(() => {
    calculateBudgetSummary();
  }, [income, expenses]);

  // Fetch all budget data from the API
  const fetchBudgetData = async () => {
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

      // Fetch income, expenses, and categories in parallel
      const [incomeResponse, expensesResponse, categoriesResponse] = await Promise.all([
        axios.get(`${API_URL}/budget/income`, config),
        axios.get(`${API_URL}/budget/expenses`, config),
        axios.get(`${API_URL}/budget/categories`, config)
      ]);

      // Update state with the fetched data
      setIncome(incomeResponse.data);
      setExpenses(expensesResponse.data);
      setCategories(categoriesResponse.data);
    } catch (err) {
      console.error('Error fetching budget data:', err);
      setError('Failed to load your budget data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new income item
  const addIncome = async (incomeData) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.post(`${API_URL}/budget/income`, incomeData, config);
      setIncome([...income, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error adding income:', err);
      setError('Failed to add income. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing income item
  const updateIncome = async (id, incomeData) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.put(`${API_URL}/budget/income/${id}`, incomeData, config);
      setIncome(income.map(item => item.id === id ? response.data : item));
      return response.data;
    } catch (err) {
      console.error('Error updating income:', err);
      setError('Failed to update income. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an income item
  const deleteIncome = async (id) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.delete(`${API_URL}/budget/income/${id}`, config);
      setIncome(income.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting income:', err);
      setError('Failed to delete income. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Add a new expense item
  const addExpense = async (expenseData) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.post(`${API_URL}/budget/expenses`, expenseData, config);
      setExpenses([...expenses, response.data]);
      return response.data;
    } catch (err) {
      console.error('Error adding expense:', err);
      setError('Failed to add expense. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing expense item
  const updateExpense = async (id, expenseData) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      const response = await axios.put(`${API_URL}/budget/expenses/${id}`, expenseData, config);
      setExpenses(expenses.map(item => item.id === id ? response.data : item));
      return response.data;
    } catch (err) {
      console.error('Error updating expense:', err);
      setError('Failed to update expense. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an expense item
  const deleteExpense = async (id) => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      };

      await axios.delete(`${API_URL}/budget/expenses/${id}`, config);
      setExpenses(expenses.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError('Failed to delete expense. Please try again.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate budget summary statistics
  const calculateBudgetSummary = () => {
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const netBalance = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (netBalance / totalIncome) * 100 : 0;

    // Calculate expenses by category
    const expensesByCategory = expenses.reduce((acc, expense) => {
      const category = expense.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + expense.amount;
      return acc;
    }, {});

    // Sort categories by amount spent to find top expense categories
    const topExpenseCategories = Object.entries(expensesByCategory)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5); // Get top 5 categories

    setBudgetSummary({
      totalIncome,
      totalExpenses,
      netBalance,
      savingsRate,
      expensesByCategory,
      topExpenseCategories
    });
  };

  // Value object to be provided to consumers of the context
  const value = {
    income,
    expenses,
    categories,
    budgetSummary,
    isLoading,
    error,
    fetchBudgetData,
    addIncome,
    updateIncome,
    deleteIncome,
    addExpense,
    updateExpense,
    deleteExpense
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};