import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../utils/formatters';

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
const Currency = ({ 
  amount, 
  showSymbol = true, 
  showDecimals = true, 
  className = '',
  ...rest 
}) => {
  // Format the amount using the formatter utility
  const formattedAmount = formatCurrency(amount, showSymbol, showDecimals);
  
  // Combine provided className with 'currency' class
  const combinedClassName = `currency ${className}`.trim();
  
  return (
    <span className={combinedClassName} {...rest}>
      {formattedAmount}
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