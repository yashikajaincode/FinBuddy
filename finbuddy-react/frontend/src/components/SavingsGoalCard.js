import React from 'react';
import PropTypes from 'prop-types';
import { formatCurrency, formatDate, formatPercentage } from '../utils/formatters';
import '../styles/variables.css';

/**
 * Component to display a savings goal card with progress
 * 
 * @param {Object} props - Component props
 * @param {Object} props.goal - Savings goal data
 * @param {string} props.goal.id - Unique identifier
 * @param {string} props.goal.name - Goal name
 * @param {number} props.goal.target - Target amount
 * @param {number} props.goal.current - Current amount saved
 * @param {string} props.goal.deadline - Target date (optional)
 * @param {string} props.goal.icon - Icon for the goal (emoji)
 * @param {string} props.goal.category - Category of the goal
 * @param {Function} props.onContribute - Callback when user contributes to goal
 * @param {Function} props.onEdit - Callback to edit the goal
 * @param {Function} props.onDelete - Callback to delete the goal
 * @returns {JSX.Element} Savings goal card component
 */
const SavingsGoalCard = ({ goal, onContribute, onEdit, onDelete }) => {
  const { id, name, target, current, deadline, icon, category } = goal;
  
  // Calculate progress percentage
  const progress = (current / target) * 100;
  const isCompleted = current >= target;
  
  // Calculate days remaining if deadline exists
  let daysRemaining = null;
  if (deadline) {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate - today;
    daysRemaining = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  // Determine status color
  let statusColor;
  if (isCompleted) {
    statusColor = 'success';
  } else if (daysRemaining !== null && daysRemaining < 30) {
    statusColor = 'warning';
  } else {
    statusColor = 'primary';
  }
  
  return (
    <div className={`savings-goal-card ${statusColor}`}>
      <div className="goal-header">
        <span className="goal-icon">{icon}</span>
        <h3 className="goal-name">{name}</h3>
        
        <div className="goal-actions">
          {onEdit && (
            <button 
              className="edit-button" 
              onClick={() => onEdit(id)}
              aria-label="Edit goal"
            >
              ✏️
            </button>
          )}
          
          {onDelete && (
            <button 
              className="delete-button" 
              onClick={() => onDelete(id)}
              aria-label="Delete goal"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
      
      <div className="goal-body">
        <div className="goal-details">
          <div className="goal-amount-container">
            <div className="goal-current">
              <span className="label">Saved</span>
              <span className="amount">{formatCurrency(current)}</span>
            </div>
            
            <div className="goal-target">
              <span className="label">Target</span>
              <span className="amount">{formatCurrency(target)}</span>
            </div>
          </div>
          
          {category && (
            <div className="goal-category">
              <span className="label">Category</span>
              <span className="badge">{category}</span>
            </div>
          )}
          
          {deadline && (
            <div className="goal-deadline">
              <span className="label">Deadline</span>
              <span className="date">{formatDate(deadline)}</span>
              {daysRemaining > 0 && (
                <span className="days-remaining">
                  ({daysRemaining} days left)
                </span>
              )}
            </div>
          )}
        </div>
        
        <div className="goal-progress-container">
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${Math.min(100, progress)}%` }}
            />
          </div>
          <div className="progress-text">
            <span>{formatPercentage(progress / 100)}</span>
            <span>{formatCurrency(current)} of {formatCurrency(target)}</span>
          </div>
        </div>
        
        {!isCompleted && onContribute && (
          <button 
            className="contribute-button primary" 
            onClick={() => onContribute(id)}
          >
            Add Contribution
          </button>
        )}
        
        {isCompleted && (
          <div className="goal-completed">
            <span className="completed-icon">🎉</span>
            <span className="completed-text">Goal achieved!</span>
          </div>
        )}
      </div>
    </div>
  );
};

SavingsGoalCard.propTypes = {
  goal: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    target: PropTypes.number.isRequired,
    current: PropTypes.number.isRequired,
    deadline: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    icon: PropTypes.string,
    category: PropTypes.string
  }).isRequired,
  onContribute: PropTypes.func,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default SavingsGoalCard;