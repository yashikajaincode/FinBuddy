/**
 * Format a number as Indian Rupees (INR)
 * 
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the ₹ symbol (default: true)
 * @param {boolean} showDecimals - Whether to show decimal places (default: true)
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, showSymbol = true, showDecimals = true) => {
  if (amount === null || amount === undefined) {
    return showSymbol ? '₹0' : '0';
  }

  // Convert to number if it's a string
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  // Format the number using Indian locale and INR currency
  const formatter = new Intl.NumberFormat('en-IN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'INR',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  });
  
  return formatter.format(numAmount);
};

/**
 * Format a number with Indian number system (commas)
 * 
 * @param {number} number - The number to format
 * @returns {string} Formatted number with commas (e.g., 1,00,000)
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) {
    return '0';
  }
  
  // Convert to number if it's a string
  const num = typeof number === 'string' ? parseFloat(number) : number;
  
  // Format the number using Indian locale
  return new Intl.NumberFormat('en-IN').format(num);
};

/**
 * Format a percentage
 * 
 * @param {number} value - The percentage value (e.g., 0.25 for 25%)
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted percentage string with % symbol
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) {
    return '0%';
  }
  
  // Convert to number if it's a string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // If the value is already in percentage (e.g., 25 instead of 0.25)
  const percentage = numValue > 1 && numValue <= 100 ? numValue : numValue * 100;
  
  return `${percentage.toFixed(decimals)}%`;
};

/**
 * Format a date as DD MMM YYYY (e.g., 15 Apr 2023)
 * 
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

/**
 * Format a large number in a more readable form (K for thousands, L for lakhs, Cr for crores)
 * 
 * @param {number} number - The number to format
 * @param {number} decimals - Number of decimal places (default: 1)
 * @returns {string} Formatted number with appropriate suffix
 */
export const formatCompactNumber = (number, decimals = 1) => {
  if (number === null || number === undefined) {
    return '0';
  }
  
  const num = typeof number === 'string' ? parseFloat(number) : number;
  
  if (num >= 10000000) { // 1 crore
    return `${(num / 10000000).toFixed(decimals)} Cr`;
  } else if (num >= 100000) { // 1 lakh
    return `${(num / 100000).toFixed(decimals)} L`;
  } else if (num >= 1000) { // 1 thousand
    return `${(num / 1000).toFixed(decimals)}K`;
  }
  
  return num.toString();
};