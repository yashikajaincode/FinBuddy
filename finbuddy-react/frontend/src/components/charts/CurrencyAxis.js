import React from 'react';
import PropTypes from 'prop-types';

/**
 * Custom axis component for displaying currency values in charts
 * 
 * @param {Object} props - Component props
 * @param {string} props.axisType - Type of axis ('x' or 'y')
 * @param {Array} props.ticks - Array of tick values
 * @param {Function} props.tickFormatter - Function to format tick values (optional)
 * @param {string} props.orientation - Orientation of the axis ('top', 'bottom', 'left', 'right')
 * @returns {JSX.Element} Currency axis component
 */
const CurrencyAxis = ({ axisType, ticks, tickFormatter, orientation }) => {
  const formatValue = (value) => {
    if (tickFormatter) {
      return tickFormatter(value);
    }
    
    // Default formatter for INR currency
    const absValue = Math.abs(value);
    if (absValue >= 10000000) {
      return `₹${(value / 10000000).toFixed(1)}Cr`;
    } else if (absValue >= 100000) {
      return `₹${(value / 100000).toFixed(1)}L`;
    } else if (absValue >= 1000) {
      return `₹${(value / 1000).toFixed(1)}K`;
    }
    return `₹${value}`;
  };

  return (
    <div className={`currency-axis ${axisType}-axis ${orientation}`}>
      {ticks.map((tick, index) => (
        <div key={index} className="tick">
          <span className="tick-value">{formatValue(tick)}</span>
        </div>
      ))}
    </div>
  );
};

CurrencyAxis.propTypes = {
  axisType: PropTypes.oneOf(['x', 'y']).isRequired,
  ticks: PropTypes.arrayOf(PropTypes.number).isRequired,
  tickFormatter: PropTypes.func,
  orientation: PropTypes.oneOf(['top', 'bottom', 'left', 'right']).isRequired
};

export default CurrencyAxis;