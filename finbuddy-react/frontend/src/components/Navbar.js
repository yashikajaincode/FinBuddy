import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import AuthContext from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Close profile dropdown if it's open
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    // Close menu if it's open on mobile
    if (isMenuOpen) setIsMenuOpen(false);
  };

  const closeMenu = () => {
    if (isMenuOpen) setIsMenuOpen(false);
    if (isProfileOpen) setIsProfileOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/logo.svg" alt="FinBuddy Logo" />
          <span>FinBuddy</span>
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <li className="nav-item">
            <Link to="/" className={`nav-link ${isActive('/')}`} onClick={closeMenu}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/budget" className={`nav-link ${isActive('/budget')}`} onClick={closeMenu}>
              Budget Planner
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/savings" className={`nav-link ${isActive('/savings')}`} onClick={closeMenu}>
              Savings Coach
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/investments" className={`nav-link ${isActive('/investments')}`} onClick={closeMenu}>
              Investment Education
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/health" className={`nav-link ${isActive('/health')}`} onClick={closeMenu}>
              Financial Health
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/chat" className={`nav-link ${isActive('/chat')}`} onClick={closeMenu}>
              AI Chat
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/achievements" className={`nav-link ${isActive('/achievements')}`} onClick={closeMenu}>
              Achievements
            </Link>
          </li>
        </ul>

        <div className="nav-profile">
          {isAuthenticated ? (
            <div className="profile-dropdown">
              <div className="profile-trigger" onClick={toggleProfile}>
                <span className="username">{user?.name || 'User'}</span>
                <FaUserCircle className="profile-icon" />
              </div>

              <div className={`profile-dropdown-content ${isProfileOpen ? 'show' : ''}`}>
                <Link to="/profile" className="dropdown-item" onClick={closeMenu}>
                  Profile
                </Link>
                <Link to="/settings" className="dropdown-item" onClick={closeMenu}>
                  Settings
                </Link>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  <FaSignOutAlt className="logout-icon" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline" onClick={closeMenu}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={closeMenu}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;