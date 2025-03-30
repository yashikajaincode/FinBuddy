import React from 'react';
import PropTypes from 'prop-types';
import LoadingScreen from './LoadingScreen';
import '../styles/LoadingSpinner.css';

/**
 * Loading spinner component that shows a simple spinner for quick loads
 * and falls back to a full LoadingScreen for longer operations
 * 
 * @param {Object} props Component props
 * @param {string} props.size Size of spinner ('small', 'medium', 'large')
 * @param {string} props.text Optional text to display
 * @param {boolean} props.fullScreen Whether to use the full-screen LoadingScreen
 * @param {string} props.theme Color theme (primary, success, warning, danger)
 * @param {string} props.mascot Mascot type for full-screen mode (coin, piggy, chart, rocket)
 * @returns {JSX.Element} Loading indicator
 */
const LoadingSpinner = ({ 
  size = 'medium', 
  text, 
  fullScreen = false, 
  theme = 'primary',
  mascot = 'coin'
}) => {
  // If fullScreen is true, use the LoadingScreen component instead
  if (fullScreen) {
    return (
      <LoadingScreen 
        show={true} 
        message={text || 'Loading...'} 
        theme={theme}
        mascotType={mascot}
      />
    );
  }

  // Otherwise, return a simple spinner
  return (
    <div className={`spinner-container ${text ? 'with-text' : ''}`}>
      <div className={`spinner ${size} ${theme}`} />
      {text && <div className="spinner-text">{text}</div>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  text: PropTypes.string,
  fullScreen: PropTypes.bool,
  theme: PropTypes.oneOf(['primary', 'success', 'warning', 'danger']),
  mascot: PropTypes.oneOf(['coin', 'piggy', 'chart', 'rocket', 'bull', 'bear', 'guru']),
};

export default LoadingSpinner;