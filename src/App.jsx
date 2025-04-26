import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budget from './pages/Budget';
import Goals from './pages/Goals';
import Investments from './pages/Investments';
import Reports from './pages/Reports';
import Assistant from './pages/Assistant';
import { FinancialProvider } from './context/FinancialContext';
import './App.css';

function App() {
  return (
    <FinancialProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/profile" element={<div>Profile Page</div>} />
            <Route path="/settings" element={<div>Settings Page</div>} />
          </Route>
        </Routes>
      </Router>
    </FinancialProvider>
  )
}

export default App
