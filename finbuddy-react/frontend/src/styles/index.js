// Global styles
import './variables.css';
import './global.css';

// Page specific styles
import './AuthPages.css';
import './HomePage.css';
import './DashboardPage.css';

// Component styles
import './Navbar.css';
import './Footer.css';
import './LoadingScreen.css';
import './LoadingSpinner.css';
import './BudgetSummaryCard.css';
import './SavingsGoalCard.css';
import './TransactionItem.css';
import './Currency.css';
import './ChartComponents.css';

// Theme colors for the application
export const THEME_COLORS = {
  primary: {
    light: '#6366F1',
    main: '#4F46E5',
    dark: '#4338CA',
    text: '#FFFFFF'
  },
  success: {
    light: '#34D399',
    main: '#10B981',
    dark: '#059669',
    text: '#FFFFFF'
  },
  warning: {
    light: '#FBBF24',
    main: '#F59E0B',
    dark: '#D97706',
    text: '#FFFFFF'
  },
  danger: {
    light: '#F87171',
    main: '#EF4444',
    dark: '#DC2626',
    text: '#FFFFFF'
  }
};

// Financial mascot types
export const MASCOT_TYPES = {
  coin: {
    name: 'Coin',
    description: 'A friendly coin character'
  },
  piggy: {
    name: 'Piggy',
    description: 'The classic savings mascot'
  },
  chart: {
    name: 'Chart',
    description: 'For the data-driven investor'
  },
  rocket: {
    name: 'Rocket',
    description: 'For ambitious financial goals'
  },
  bull: {
    name: 'Bull',
    description: 'For positive market outlook'
  },
  bear: {
    name: 'Bear',
    description: 'For cautious market outlook'
  },
  guru: {
    name: 'Guru Ji',
    description: 'Wise financial mentor'
  }
};