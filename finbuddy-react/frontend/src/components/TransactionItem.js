import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../utils/formatters';
import Currency from './Currency';
import '../styles/variables.css';

/**
 * Component to display a single transaction (income or expense)
 * 
 * @param {Object} props - Component props
 * @param {Object} props.transaction - Transaction data
 * @param {string} props.transaction.id - Unique identifier
 * @param {string} props.transaction.name - Transaction name/description
 * @param {number} props.transaction.amount - Transaction amount
 * @param {string} props.transaction.date - Transaction date
 * @param {string} props.transaction.category - Transaction category (optional)
 * @param {string} props.transaction.type - Transaction type ('income' or 'expense')
 * @param {Function} props.onEdit - Edit handler function (optional)
 * @param {Function} props.onDelete - Delete handler function (optional)
 * @returns {JSX.Element} Transaction item component
 */
const TransactionItem = ({ transaction, onEdit, onDelete }) => {
  const { id, name, amount, date, category, type } = transaction;
  const isExpense = type === 'expense';
  
  // Icon mapping for categories (emoji are just placeholders, can be replaced with actual icons)
  const categoryIcons = {
    // Income categories
    salary: '💰',
    business: '🏢',
    investments: '📈',
    side_hustle: '🛠️',
    gifts: '🎁',
    other_income: '💵',
    
    // Expense categories
    housing: '🏠',
    food: '🍔',
    transportation: '🚗',
    entertainment: '🎬',
    healthcare: '🏥',
    education: '🎓',
    shopping: '🛍️',
    utilities: '💡',
    debt: '💳',
    savings: '🏦',
    insurance: '🛡️',
    other_expense: '📋'
  };
  
  // Get icon for category or use default
  const icon = category ? (categoryIcons[category.toLowerCase()] || '📝') : '📝';
  
  return (
    <div className={`transaction-item ${isExpense ? 'expense' : 'income'}`}>
      <div className="transaction-icon">
        <span>{icon}</span>
      </div>
      
      <div className="transaction-details">
        <h4 className="transaction-name">{name}</h4>
        <div className="transaction-meta">
          {category && (
            <span className="transaction-category">
              {category}
            </span>
          )}
          <span className="transaction-date">{formatDate(date)}</span>
        </div>
      </div>
      
      <div className="transaction-amount">
        <Currency 
          amount={amount} 
          showSymbol={true} 
          showDecimals={true}
          className={isExpense ? 'expense-amount' : 'income-amount'}
        />
      </div>
      
      {(onEdit || onDelete) && (
        <div className="transaction-actions">
          {onEdit && (
            <button 
              className="edit-button"
              onClick={() => onEdit(id)}
              aria-label="Edit transaction"
            >
              ✏️
            </button>
          )}
          
          {onDelete && (
            <button 
              className="delete-button" 
              onClick={() => onDelete(id)}
              aria-label="Delete transaction"
            >
              🗑️
            </button>
          )}
        </div>
      )}
    </div>
  );
};

TransactionItem.propTypes = {
  transaction: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
    amount: PropTypes.number.isRequired,
    date: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]).isRequired,
    category: PropTypes.string,
    type: PropTypes.oneOf(['income', 'expense']).isRequired
  }).isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func
};

export default TransactionItem;