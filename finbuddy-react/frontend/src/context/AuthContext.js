import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for token and load user on app start
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      
      try {
        const token = localStorage.getItem('finbuddyToken');
        
        if (!token) {
          setLoading(false);
          return;
        }
        
        // Set default headers for all requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Get user profile
        const response = await axios.get('/api/users/profile');
        
        if (response.data.success) {
          setUser(response.data.data.user);
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('finbuddyToken');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error('Error loading user:', err);
        localStorage.removeItem('finbuddyToken');
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/users/register', userData);
      
      if (response.data.success) {
        const { token } = response.data.data;
        
        // Save token to localStorage
        localStorage.setItem('finbuddyToken', token);
        
        // Set default headers for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Set user in state
        setUser(response.data.data);
        setIsAuthenticated(true);
        setError(null);
        
        return { success: true };
      } else {
        setError(response.data.message || 'Registration failed');
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/users/login', { email, password });
      
      if (response.data.success) {
        const { token } = response.data.data;
        
        // Save token to localStorage
        localStorage.setItem('finbuddyToken', token);
        
        // Set default headers for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Set user in state
        setUser(response.data.data);
        setIsAuthenticated(true);
        setError(null);
        
        return { success: true };
      } else {
        setError(response.data.message || 'Authentication failed');
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Authentication failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    // Remove token from localStorage
    localStorage.removeItem('finbuddyToken');
    
    // Remove default headers
    delete axios.defaults.headers.common['Authorization'];
    
    // Clear user from state
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put('/api/users/profile', userData);
      
      if (response.data.success) {
        // Update user in state
        setUser(response.data.data);
        setError(null);
        
        return { success: true, data: response.data.data };
      } else {
        setError(response.data.message || 'Update failed');
        return { success: false, error: response.data.message };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Profile update failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear error state
  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        register,
        login,
        logout,
        updateProfile,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;