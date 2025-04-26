// Financial planning utility functions

const calculateIncomeGrowthPlan = (currentIncome, requiredSaving, timeline) => {
  const suggestions = [];
  const monthlyDeficit = requiredSaving - (currentIncome * 0.5); // Assuming 50% of income can be saved

  if (monthlyDeficit > 0) {
    // Calculate required annual income growth
    const requiredAnnualIncome = (requiredSaving + currentIncome * 0.5) * 12;
    const currentAnnualIncome = currentIncome * 12;
    const growthRate = Math.pow(requiredAnnualIncome / currentAnnualIncome, 1 / timeline) - 1;
    const annualGrowthPercentage = (growthRate * 100).toFixed(1);

    suggestions.push({
      type: 'income_growth',
      title: 'Income Growth Target',
      description: `Aim for ${annualGrowthPercentage}% annual income growth through:`,
      steps: [
        'Seek promotion opportunities in current role',
        'Develop high-demand skills in your industry',
        'Consider additional certifications or education',
        'Start freelancing on platforms like Upwork or Fiverr',
        'Create and monetize online courses in your expertise',
        'Build a professional network on LinkedIn',
        'Consider part-time consulting in your field',
        'Look for higher-paying positions in the market'
      ]
    });

    suggestions.push({
      type: 'side_hustle',
      title: 'Additional Income Streams',
      description: 'Explore these side income opportunities:',
      steps: [
        'Start a blog or YouTube channel in your area of expertise',
        'Invest in dividend-paying stocks for passive income',
        'Rent out spare space or parking',
        'Participate in paid online surveys and user testing',
        'Offer services on gig economy platforms',
        'Create and sell digital products or templates',
        'Start dropshipping or print-on-demand business'
      ]
    });
  } else {
    // Provide optimization suggestions when income exceeds required savings
    suggestions.push({
      type: 'income_optimization',
      title: 'Income Optimization Opportunities',
      description: 'Your current income provides good savings potential. Consider these strategies to maximize your financial growth:',
      steps: [
        'Invest surplus income in high-yield savings accounts or fixed deposits',
        'Consider tax-saving investment options to optimize take-home income',
        'Explore passive income opportunities through dividend stocks or rental property',
        'Build an emergency fund with 6-12 months of expenses',
        'Consider early debt repayment to reduce interest expenses',
        'Automate your savings with scheduled transfers',
        'Maximize employer benefits and matching programs',
        'Consider tax-advantaged retirement accounts'
      ]
    });

    suggestions.push({
      type: 'wealth_building',
      title: 'Long-term Wealth Building',
      description: 'Strategies to grow your wealth over time:',
      steps: [
        'Diversify investments across multiple asset classes',
        'Consider real estate investment opportunities',
        'Start a small business with surplus funds',
        'Invest in your professional development',
        'Create multiple streams of passive income',
        'Consider peer-to-peer lending or crowdfunding',
        'Explore angel investing or startup opportunities'
      ]
    });
  }

  return suggestions;
};

const generateInvestmentPlan = (amount, riskTolerance, timeline) => {
  const plans = {
    conservative: {
      allocation: [
        { type: 'Fixed Deposits', percentage: 40, description: 'Safe returns with bank guarantees' },
        { type: 'Government Bonds', percentage: 30, description: 'Steady, low-risk returns' },
        { type: 'Blue-chip Stocks', percentage: 20, description: 'Stable large-cap companies' },
        { type: 'Gold', percentage: 10, description: 'Hedge against market volatility' }
      ],
      expectedReturn: '8-10%'
    },
    moderate: {
      allocation: [
        { type: 'Mutual Funds', percentage: 40, description: 'Mix of equity and debt funds' },
        { type: 'Index Funds', percentage: 30, description: 'Market-tracking investments' },
        { type: 'Corporate Bonds', percentage: 20, description: 'Higher yields than govt. bonds' },
        { type: 'Real Estate Funds', percentage: 10, description: 'Property market exposure' }
      ],
      expectedReturn: '10-12%'
    },
    aggressive: {
      allocation: [
        { type: 'Growth Stocks', percentage: 50, description: 'High-potential companies' },
        { type: 'Mid-cap Funds', percentage: 25, description: 'Balance of growth and stability' },
        { type: 'International Stocks', percentage: 15, description: 'Global market exposure' },
        { type: 'Cryptocurrency', percentage: 10, description: 'High-risk, high-reward potential' }
      ],
      expectedReturn: '12-15%'
    }
  };

  return {
    monthlyInvestmentPlan: plans[riskTolerance],
    timeline: timeline,
    totalInvestmentAmount: amount
  };
};

const generateSavingsStrategies = (monthlyIncome, monthlyExpenses, targetSaving) => {
  const currentSavings = monthlyIncome - monthlyExpenses;
  const additionalSavingsNeeded = targetSaving - currentSavings;
  
  const strategies = [];

  if (additionalSavingsNeeded > 0) {
    strategies.push({
      type: 'expense_reduction',
      title: 'Expense Optimization',
      suggestions: [
        'Review and optimize monthly subscriptions',
        'Find better deals on insurance and utilities',
        'Consider cost-effective transportation options',
        'Plan meals and reduce dining out expenses',
        'Look for cheaper housing options if feasible'
      ]
    });

    strategies.push({
      type: 'income_increase',
      title: 'Additional Income Sources',
      suggestions: [
        'Start a side business in your expertise area',
        'Explore freelance opportunities',
        'Invest in dividend-paying stocks',
        'Consider rental income from property',
        'Monetize your skills through online platforms'
      ]
    });
  }

  return strategies;
};

export const generateFinancialPlan = (financialData) => {
  const {
    monthlyIncome,
    monthlyExpenses,
    targetAmount,
    targetDate,
    riskTolerance,
    recommendedMonthlySaving
  } = financialData;

  const today = new Date();
  const timelineYears = (new Date(targetDate).getFullYear() - today.getFullYear());

  const plan = {
    summary: {
      monthlyIncome,
      monthlyExpenses,
      targetAmount,
      timelineYears,
      recommendedMonthlySaving
    },
    incomeGrowth: calculateIncomeGrowthPlan(monthlyIncome, recommendedMonthlySaving, timelineYears),
    investment: generateInvestmentPlan(recommendedMonthlySaving, riskTolerance, timelineYears),
    savingsStrategies: generateSavingsStrategies(monthlyIncome, monthlyExpenses, recommendedMonthlySaving)
  };

  return plan;
};