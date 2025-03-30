import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency, formatCompactNumber } from '../../utils/formatters';

/**
 * Custom axis component for charts with currency values
 * 
 * @param {Object} props - Component props
 * @param {string} props.axisType - The type of axis ('x' or 'y')
 * @param {number[]} props.ticks - The tick values for the axis
 * @param {boolean} props.useCompactFormat - Whether to use compact format for large numbers
 * @param {boolean} props.showSymbol - Whether to show the ₹ symbol
 * @returns {JSX.Element} Formatted currency axis for charts
 */
const CurrencyAxis = ({
  axisType = 'y',
  ticks = [],
  useCompactFormat = true,
  showSymbol = true
}) => {
  // Format function based on configuration
  const formatValue = (value) => {
    if (useCompactFormat) {
      return formatCompactNumber(value);
    } else {
      return formatCurrency(value, showSymbol, false); // No decimals for axis labels
    }
  };
  
  return (
    <g className={`axis axis-${axisType}`}>
      {ticks.map((tick, index) => (
        <text 
          key={`${axisType}-tick-${index}`}
          className="tick-label"
          x={axisType === 'x' ? tick : 0}
          y={axisType === 'y' ? tick : 0}
          dy={axisType === 'x' ? '1em' : '0.3em'}
          dx={axisType === 'x' ? 0 : '-0.5em'}
          textAnchor={axisType === 'x' ? 'middle' : 'end'}
        >
          {formatValue(tick)}
        </text>
      ))}
    </g>
  );
};

CurrencyAxis.propTypes = {
  axisType: PropTypes.oneOf(['x', 'y']),
  ticks: PropTypes.arrayOf(PropTypes.number),
  useCompactFormat: PropTypes.bool,
  showSymbol: PropTypes.bool
};

export default CurrencyAxis;