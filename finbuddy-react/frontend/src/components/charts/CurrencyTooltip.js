import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency } from '../../utils/formatters';
import '../../styles/variables.css';

/**
 * Custom tooltip component for charts with currency values
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.active - Whether the tooltip is active/visible
 * @param {Array} props.payload - The data payload for the tooltip
 * @param {string} props.label - The label for the tooltip (e.g., x-axis category)
 * @param {string} props.valueKey - The key in the payload to use for the value
 * @param {string} props.labelFormatter - Optional function to format the label
 * @returns {JSX.Element|null} Formatted currency tooltip for charts
 */
const CurrencyTooltip = ({ 
  active, 
  payload, 
  label,
  valueKey = 'value',
  labelFormatter
}) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const value = payload[0].payload[valueKey];
  const formattedValue = formatCurrency(value, true, true);
  const formattedLabel = labelFormatter ? labelFormatter(label) : label;

  return (
    <div className="custom-tooltip">
      <p className="tooltip-label">{formattedLabel}</p>
      <p className="tooltip-value">{formattedValue}</p>
    </div>
  );
};

CurrencyTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  valueKey: PropTypes.string,
  labelFormatter: PropTypes.func
};

export default CurrencyTooltip;