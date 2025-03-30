import React from 'react';
import PropTypes from 'prop-types';
import Currency from '../Currency';

/**
 * Custom tooltip component for displaying currency values in charts
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.active - Whether the tooltip is active
 * @param {Array} props.payload - Data for the tooltip
 * @param {string} props.label - Label for the tooltip
 * @param {string} props.labelFormatter - Function to format the label (optional)
 * @param {string} props.valueFormatter - Function to format the value (optional)
 * @returns {JSX.Element|null} Currency tooltip component
 */
const CurrencyTooltip = ({ active, payload, label, labelFormatter, valueFormatter }) => {
  if (!active || !payload || !payload.length) {
    return null;
  }

  const formattedLabel = labelFormatter ? labelFormatter(label) : label;
  
  return (
    <div className="custom-tooltip">
      <p className="tooltip-label">{formattedLabel}</p>
      <div className="tooltip-content">
        {payload.map((entry, index) => {
          const value = valueFormatter 
            ? valueFormatter(entry.value) 
            : <Currency amount={entry.value} />;
            
          return (
            <div key={`item-${index}`} className="tooltip-item" style={{ color: entry.color }}>
              <span className="tooltip-key">{entry.name}: </span>
              <span className="tooltip-value">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

CurrencyTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  labelFormatter: PropTypes.func,
  valueFormatter: PropTypes.func
};

export default CurrencyTooltip;