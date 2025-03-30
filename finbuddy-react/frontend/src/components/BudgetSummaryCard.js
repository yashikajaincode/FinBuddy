import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import '../styles/variables.css';

/**
 * Budget summary card component to display financial metrics
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {number} props.amount - Amount to display
 * @param {number} props.total - Total for comparison (for progress calculation)
 * @param {string} props.icon - Icon to display
 * @param {string} props.trend - Trend direction ('up', 'down', or 'neutral')
 * @param {string} props.trendText - Text explaining the trend
 * @param {string} props.colorClass - CSS color class (primary, success, warning, danger)
 * @returns {JSX.Element} Budget summary card
 */
const BudgetSummaryCard = ({
  title,
  amount,
  total,
  icon,
  trend = 'neutral',
  trendText = '',
  colorClass = 'primary'
}) => {
  // Calculate progress percentage
  const progress = total > 0 ? (amount / total) * 100 : 0;
  
  // Determine trend icon
  let trendIcon;
  switch (trend) {
    case 'up':
      trendIcon = '📈';
      break;
    case 'down':
      trendIcon = '📉';
      break;
    default:
      trendIcon = '➡️';
  }
  
  return (
    <div className={`card budget-summary-card ${colorClass}`}>
      <div className="card-header">
        <span className="card-icon">{icon}</span>
        <h3 className="card-title">{title}</h3>
      </div>
      
      <div className="card-amount">
        <span className="currency-amount">{formatCurrency(amount)}</span>
      </div>
      
      {total > 0 && (
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <div className="progress-text">
            <span>{formatPercentage(progress / 100)}</span>
            <span>of {formatCurrency(total)}</span>
          </div>
        </div>
      )}
      
      {trendText && (
        <div className="trend-container">
          <span className="trend-icon">{trendIcon}</span>
          <span className="trend-text">{trendText}</span>
        </div>
      )}
    </div>
  );
};

BudgetSummaryCard.propTypes = {
  title: PropTypes.string.isRequired,
  amount: PropTypes.number.isRequired,
  total: PropTypes.number,
  icon: PropTypes.string,
  trend: PropTypes.oneOf(['up', 'down', 'neutral']),
  trendText: PropTypes.string,
  colorClass: PropTypes.string
};

export default BudgetSummaryCard;