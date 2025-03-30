import React, { useState, useEffect } from 'react';
import '../styles/LoadingScreen.css';

/**
 * Animated loading screen with financial mascot character
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether to show the loading screen
 * @param {string} props.message - Custom loading message (optional)
 * @param {string} props.theme - Color theme (primary, success, warning, danger) - default: primary
 * @param {string} props.mascotType - Type of mascot to display (coin, piggy, chart, rocket) - default: coin
 * @param {number} props.minDisplayTime - Minimum time in ms to display loading screen (default: 1200)
 * @returns {JSX.Element|null} Animated loading screen or null if not shown
 */
const LoadingScreen = ({ 
  show, 
  message = "Loading your financial future...", 
  theme = "primary",
  mascotType = "coin",
  minDisplayTime = 1200
}) => {
  const [isVisible, setIsVisible] = useState(show);
  const [displayedTip, setDisplayedTip] = useState('');

  // Financial tips to display while loading
  const financialTips = [
    "Save at least 20% of your income for future goals.",
    "Pay yourself first by automating your savings.",
    "Track your expenses to identify spending patterns.",
    "Avoid credit card debt by paying off balances in full.",
    "Build an emergency fund to cover 3-6 months of expenses.",
    "Start investing early to benefit from compound interest.",
    "Diversify your investments to manage risk.",
    "Review your spending habits monthly to identify savings opportunities.",
    "Negotiate better rates on recurring bills annually.",
    "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings."
  ];

  // Loading phrases related to finance
  const loadingPhrases = [
    "Counting your coins...",
    "Balancing your budget...",
    "Calculating compound interest...",
    "Organizing your finances...",
    "Preparing your dashboard...",
    "Checking market trends...",
    "Securing your financial data...",
    "Polishing your portfolio...",
    "Analyzing spending patterns...",
    "Maximizing your savings..."
  ];

  // Select a random financial tip
  useEffect(() => {
    if (show) {
      // Choose random tip and loading message
      const randomTip = financialTips[Math.floor(Math.random() * financialTips.length)];
      const randomPhrase = loadingPhrases[Math.floor(Math.random() * loadingPhrases.length)];
      
      setDisplayedTip(randomTip);
      
      // Set custom display time before hiding
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, minDisplayTime);
      
      return () => clearTimeout(timer);
    }
  }, [show, minDisplayTime]);

  // If not visible, don't render anything
  if (!isVisible && !show) return null;

  // Define which mascot to display
  const renderMascot = () => {
    switch (mascotType) {
      case 'piggy':
        return (
          <div className={`mascot-container piggy ${theme}`}>
            <div className="piggy-body">
              <div className="piggy-ear-left"></div>
              <div className="piggy-ear-right"></div>
              <div className="piggy-snout">
                <div className="piggy-nostril-left"></div>
                <div className="piggy-nostril-right"></div>
              </div>
              <div className="piggy-eye-left">
                <div className="piggy-pupil"></div>
              </div>
              <div className="piggy-eye-right">
                <div className="piggy-pupil"></div>
              </div>
              <div className="piggy-slot"></div>
            </div>
            <div className="coin coin1"></div>
            <div className="coin coin2"></div>
            <div className="coin coin3"></div>
          </div>
        );
      
      case 'chart':
        return (
          <div className={`mascot-container chart ${theme}`}>
            <div className="chart-paper">
              <div className="chart-bar bar1"></div>
              <div className="chart-bar bar2"></div>
              <div className="chart-bar bar3"></div>
              <div className="chart-bar bar4"></div>
              <div className="chart-line"></div>
              <div className="chart-dot dot1"></div>
              <div className="chart-dot dot2"></div>
              <div className="chart-dot dot3"></div>
              <div className="chart-dot dot4"></div>
            </div>
            <div className="chart-arrow"></div>
          </div>
        );
        
      case 'rocket':
        return (
          <div className={`mascot-container rocket ${theme}`}>
            <div className="rocket-body">
              <div className="rocket-window"></div>
              <div className="rocket-fin-left"></div>
              <div className="rocket-fin-right"></div>
              <div className="rocket-exhaust">
                <div className="rocket-fire"></div>
                <div className="rocket-fire-particle particle1"></div>
                <div className="rocket-fire-particle particle2"></div>
                <div className="rocket-fire-particle particle3"></div>
              </div>
            </div>
            <div className="rocket-dollar-sign">$</div>
          </div>
        );
      
      // Default mascot is the coin
      default:
        return (
          <div className={`mascot-container coin ${theme}`}>
            <div className="coin-body">
              <div className="coin-inner">
                <div className="coin-dollar">$</div>
              </div>
              <div className="coin-shine"></div>
            </div>
            <div className="coin-shadow"></div>
          </div>
        );
    }
  };

  // Main render
  return (
    <div className={`loading-screen ${isVisible || show ? 'visible' : 'hidden'}`}>
      <div className="loading-content">
        {renderMascot()}
        
        <div className="loading-text">
          <h3 className={`loading-message ${theme}`}>{message}</h3>
          <div className="loading-indicator">
            <div className={`dot-loader ${theme}`}>
              <div className="dot dot1"></div>
              <div className="dot dot2"></div>
              <div className="dot dot3"></div>
            </div>
          </div>
        </div>
        
        <div className="loading-tip">
          <span className="tip-label">Financial Tip:</span>
          <p className="tip-text">{displayedTip}</p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;