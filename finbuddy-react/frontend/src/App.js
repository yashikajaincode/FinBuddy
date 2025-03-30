import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import BudgetPlannerPage from './pages/BudgetPlannerPage';
import SavingsCoachPage from './pages/SavingsCoachPage';
import InvestmentEducationPage from './pages/InvestmentEducationPage';
import FinanceTipsPage from './pages/FinanceTipsPage';
import FinancialHealthPage from './pages/FinancialHealthPage';
import ChatPage from './pages/ChatPage';
import AchievementsPage from './pages/AchievementsPage';
import ProfilePage from './pages/ProfilePage';

// Components
import { Navbar, Footer, LoadingSpinner, LoadingScreen } from './components';

// Contexts
import { AuthProvider } from './context/AuthContext';
import { BudgetProvider } from './context/BudgetContext';
import { SavingsProvider } from './context/SavingsContext';
import { GamificationProvider } from './context/GamificationContext';
import { ChatProvider } from './context/ChatContext';

// CSS
import './App.css';
// Import all component styles
import './styles';

function App() {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate initial loading
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <LoadingScreen 
        show={true} 
        message="Welcome to FinBuddy!" 
        theme="primary"
        mascotType="rocket"
        minDisplayTime={2000}
      />
    );
  }

  return (
    <Router>
      <AuthProvider>
        <BudgetProvider>
          <SavingsProvider>
            <GamificationProvider>
              <ChatProvider>
                <div className="app">
                  <Navbar />
                  <main className="main-content">
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/budget" element={
                        <ProtectedRoute>
                          <BudgetPlannerPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/savings" element={
                        <ProtectedRoute>
                          <SavingsCoachPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/investments" element={
                        <ProtectedRoute>
                          <InvestmentEducationPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/tips" element={
                        <ProtectedRoute>
                          <FinanceTipsPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/health" element={
                        <ProtectedRoute>
                          <FinancialHealthPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/chat" element={
                        <ProtectedRoute>
                          <ChatPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/achievements" element={
                        <ProtectedRoute>
                          <AchievementsPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      } />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </ChatProvider>
            </GamificationProvider>
          </SavingsProvider>
        </BudgetProvider>
      </AuthProvider>
    </Router>
  );
}

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('finbuddyToken');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default App;