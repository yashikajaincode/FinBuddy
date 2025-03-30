import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Currency.css';

/**
 * Currency component for displaying monetary values in INR format
 * 
 * @param {Object} props - Component props
 * @param {number} props.amount - The amount to display
 * @param {boolean} props.showSymbol - Whether to show the ₹ symbol (default: true)
 * @param {boolean} props.showDecimals - Whether to show decimal places (default: true)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Formatted currency display
 */
const Currency = ({ amount, showSymbol = true, showDecimals = true, className = '' }) => {
  const formatAmount = (value) => {
    const absValue = Math.abs(value);
    
    // Format based on amount size, using Indian number system
    if (absValue >= 10000000) {
      // Crores
      return `${showSymbol ? '₹' : ''}${(value / 10000000).toFixed(showDecimals ? 2 : 0)} Cr`;
    } else if (absValue >= 100000) {
      // Lakhs
      return `${showSymbol ? '₹' : ''}${(value / 100000).toFixed(showDecimals ? 2 : 0)} L`;
    } else if (absValue >= 1000) {
      // Thousands
      return `${showSymbol ? '₹' : ''}${(value / 1000).toFixed(showDecimals ? 1 : 0)}K`;
    }
    
    // Standard formatting for smaller numbers
    return `${showSymbol ? '₹' : ''}${value.toFixed(showDecimals ? 2 : 0)}`;
  };

  // Format and add custom color class based on positive/negative amount
  const valueClass = amount < 0 ? 'currency-negative' : 'currency-positive';
  
  return (
    <span className={`currency-component ${valueClass} ${className}`}>
      {formatAmount(amount)}
    </span>
  );
};

Currency.propTypes = {
  amount: PropTypes.number.isRequired,
  showSymbol: PropTypes.bool,
  showDecimals: PropTypes.bool,
  className: PropTypes.string
};

export default Currency;