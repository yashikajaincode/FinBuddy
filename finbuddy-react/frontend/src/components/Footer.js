import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">FinBuddy</h3>
          <p className="footer-description">
            Your AI-powered financial education platform. Learn budgeting, 
            saving, and investing through interactive tools and personalized guidance.
          </p>
          <div className="social-icons">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaTwitter />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaFacebook />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaInstagram />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaLinkedin />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Features</h3>
          <ul className="footer-links">
            <li><Link to="/budget">Budget Planner</Link></li>
            <li><Link to="/savings">Savings Coach</Link></li>
            <li><Link to="/investments">Investment Education</Link></li>
            <li><Link to="/health">Financial Health Score</Link></li>
            <li><Link to="/chat">AI Chat Assistant</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Resources</h3>
          <ul className="footer-links">
            <li><Link to="/tips">Financial Tips</Link></li>
            <li><a href="#blog">Blog</a></li>
            <li><a href="#glossary">Financial Glossary</a></li>
            <li><a href="#calculator">Calculators</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3 className="footer-title">Company</h3>
          <ul className="footer-links">
            <li><a href="#about">About Us</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><a href="#careers">Careers</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
            <li><a href="#terms">Terms of Service</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} FinBuddy. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;