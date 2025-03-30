import React from 'react';
import './LoadingSpinner.css';
import LoadingScreen from './LoadingScreen';

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
  text = '', 
  fullScreen = false,
  theme = 'primary',
  mascot = 'coin'
}) => {
  // If fullScreen is true, use the LoadingScreen component
  if (fullScreen) {
    return (
      <LoadingScreen 
        show={true} 
        message={text || "Loading your financial future..."} 
        theme={theme}
        mascotType={mascot}
      />
    );
  }
  
  // Otherwise use the simple spinner
  let spinnerSize;
  
  switch (size) {
    case 'small':
      spinnerSize = '30px';
      break;
    case 'large':
      spinnerSize = '70px';
      break;
    case 'medium':
    default:
      spinnerSize = '50px';
  }
  
  // Apply theme color class
  const themeClass = theme ? `spinner-${theme}` : '';
  
  return (
    <div className="spinner-container">
      <div className={`spinner ${themeClass}`} style={{ width: spinnerSize, height: spinnerSize }}></div>
      {text && <p className={`spinner-text ${themeClass}`}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;