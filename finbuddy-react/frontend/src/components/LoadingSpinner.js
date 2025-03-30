import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', text = '' }) => {
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
  
  return (
    <div className="spinner-container">
      <div className="spinner" style={{ width: spinnerSize, height: spinnerSize }}></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;