// Financial Advisor Service

// Side hustle suggestions based on skills and interests
const sideHustleRecommendations = {
  tech: [
    { title: 'Freelance Web Development', description: 'Build websites and web applications for clients', platforms: ['Upwork', 'Fiverr', 'Toptal'], focus: 'Programming', income: '₹2000-5000/hr' },
    { title: 'Mobile App Development', description: 'Create mobile applications', platforms: ['Freelancer', 'PeoplePerHour', 'Guru'], focus: 'Mobile Development', income: '₹2500-6000/hr' },
    { title: 'Technical Writing', description: 'Create technical documentation and tutorials', platforms: ['Medium', 'Dev.to', 'Technical Writing Jobs'], focus: 'Documentation', income: '₹1000-3000/article' },
    { title: 'UI/UX Design', description: 'Design user interfaces and experiences', platforms: ['Behance', 'Dribbble', '99designs'], focus: 'Design', income: '₹1500-4000/hr' },
    { title: 'Data Analysis', description: 'Analyze data and create insights', platforms: ['Kaggle', 'Upwork', 'LinkedIn'], focus: 'Data Science', income: '₹2000-5000/hr' }
  ],
  creative: [
    { title: 'Content Creation', description: 'Create videos, blogs, or social media content', platforms: ['YouTube', 'Instagram', 'TikTok'], focus: 'Content', income: '₹500-2000/piece' },
    { title: 'Graphic Design', description: 'Design logos, banners, and marketing materials', platforms: ['Behance', 'Dribbble', '99designs'], focus: 'Design', income: '₹1000-3000/design' },
    { title: 'Digital Marketing', description: 'Help businesses with their online presence', platforms: ['LinkedIn', 'Facebook Ads', 'Google Ads'], focus: 'Marketing', income: '₹1500-4000/project' },
    { title: 'Photography', description: 'Capture and edit photos for clients', platforms: ['Instagram', 'Shutterstock', '500px'], focus: 'Photography', income: '₹2000-5000/session' },
    { title: 'Video Editing', description: 'Edit and produce videos', platforms: ['YouTube', 'Fiverr', 'Upwork'], focus: 'Video Production', income: '₹1000-3000/video' }
  ],
  general: [
    { title: 'Virtual Assistance', description: 'Provide administrative support remotely', platforms: ['Virtual Staff Finder', 'Fancy Hands', 'Belay'], focus: 'Administration', income: '₹300-800/hr' },
    { title: 'Online Tutoring', description: 'Teach subjects or skills online', platforms: ['Chegg', 'VIPKid', 'Vedantu'], focus: 'Education', income: '₹500-1500/hr' },
    { title: 'Translation Services', description: 'Translate documents and content', platforms: ['ProZ', 'TranslatorsCafe', 'Gengo'], focus: 'Languages', income: '₹1-3/word' },
    { title: 'Customer Service', description: 'Provide customer support remotely', platforms: ['Amazon', 'LiveOps', 'Working Solutions'], focus: 'Support', income: '₹200-500/hr' },
    { title: 'Data Entry', description: 'Input and manage data', platforms: ['Clickworker', 'Appen', 'Lionbridge'], focus: 'Data Management', income: '₹150-300/hr' }
  ]
};

// Budgeting app recommendations with detailed features
const budgetingTools = [
  {
    name: 'Mint',
    features: ['Expense tracking', 'Budget planning', 'Bill reminders', 'Credit score monitoring', 'Investment tracking'],
    cost: 'Free',
    bestFor: 'Overall financial management',
    platforms: ['Web', 'iOS', 'Android'],
    rating: 4.5
  },
  {
    name: 'YNAB',
    features: ['Zero-based budgeting', 'Goal tracking', 'Debt payoff planning', 'Real-time budget alerts', 'Educational resources'],
    cost: '₹1200/month',
    bestFor: 'Detailed budget management',
    platforms: ['Web', 'iOS', 'Android'],
    rating: 4.8
  },
  {
    name: 'Personal Capital',
    features: ['Investment tracking', 'Retirement planning', 'Net worth monitoring', 'Fee analyzer', 'Investment checkup'],
    cost: 'Free with premium options',
    bestFor: 'Investment management',
    platforms: ['Web', 'iOS', 'Android'],
    rating: 4.6
  },
  {
    name: 'Goodbudget',
    features: ['Envelope budgeting', 'Debt tracking', 'Savings goals', 'Shared budgets', 'Spending reports'],
    cost: 'Free with premium plan',
    bestFor: 'Envelope budgeting method',
    platforms: ['Web', 'iOS', 'Android'],
    rating: 4.3
  }
];

// Skill development resources with detailed information
const skillDevelopmentResources = {
  programming: [
    { platform: 'freeCodeCamp', focus: 'Web Development', cost: 'Free', certification: true, duration: 'Self-paced', jobSupport: true },
    { platform: 'Coursera', focus: 'Computer Science', cost: '₹3000-5000/course', certification: true, duration: '4-8 weeks', jobSupport: true },
    { platform: 'Udacity', focus: 'Tech Nanodegrees', cost: '₹20000-40000/program', certification: true, duration: '3-6 months', jobSupport: true },
    { platform: 'DataCamp', focus: 'Data Science', cost: '₹2000/month', certification: true, duration: 'Self-paced', jobSupport: true },
    { platform: 'Pluralsight', focus: 'Software Development', cost: '₹1500/month', certification: true, duration: 'Self-paced', jobSupport: false }
  ],
  business: [
    { platform: 'LinkedIn Learning', focus: 'Professional Development', cost: '₹1400/month', certification: true, duration: 'Self-paced', jobSupport: true },
    { platform: 'Udemy', focus: 'Business Skills', cost: '₹500-2000/course', certification: true, duration: 'Variable', jobSupport: false },
    { platform: 'Google Digital Garage', focus: 'Digital Marketing', cost: 'Free', certification: true, duration: '40 hours', jobSupport: false },
    { platform: 'HubSpot Academy', focus: 'Marketing & Sales', cost: 'Free', certification: true, duration: 'Self-paced', jobSupport: false },
    { platform: 'edX', focus: 'Business Management', cost: '₹10000-30000/course', certification: true, duration: '8-12 weeks', jobSupport: true }
  ],
  finance: [
    { platform: 'Wall Street Survivor', focus: 'Stock Market', cost: 'Free/Premium', certification: false, duration: 'Self-paced', jobSupport: false },
    { platform: 'Investopedia Academy', focus: 'Financial Education', cost: '₹15000/course', certification: true, duration: 'Variable', jobSupport: false },
    { platform: 'Khan Academy', focus: 'Personal Finance', cost: 'Free', certification: false, duration: 'Self-paced', jobSupport: false },
    { platform: 'CFI', focus: 'Financial Analysis', cost: '₹25000/certification', certification: true, duration: '6-8 months', jobSupport: true },
    { platform: 'Bloomberg Market Concepts', focus: 'Financial Markets', cost: '₹12000', certification: true, duration: '8-10 hours', jobSupport: false }
  ]
};

// Investment recommendations based on risk profile with detailed analysis
export const getInvestmentRecommendations = (riskTolerance, investmentAmount) => {
  const recommendations = {
    conservative: {
      allocation: [
        { type: 'Fixed Deposits', percentage: 40, description: 'Safe, guaranteed returns', expectedReturn: '5-6%', risk: 'Very Low' },
        { type: 'Government Bonds', percentage: 30, description: 'Low-risk, stable returns', expectedReturn: '6-7%', risk: 'Low' },
        { type: 'Blue-chip Stocks', percentage: 20, description: 'Established companies', expectedReturn: '8-10%', risk: 'Moderate' },
        { type: 'Gold ETFs', percentage: 10, description: 'Hedge against inflation', expectedReturn: '7-8%', risk: 'Low' }
      ],
      suggestedFunds: [
        { name: 'Government Securities Funds', type: 'Debt', risk: 'Low', minInvestment: 5000 },
        { name: 'Corporate Bond Funds', type: 'Debt', risk: 'Low-Moderate', minInvestment: 5000 },
        { name: 'Large-cap Index Funds', type: 'Equity', risk: 'Moderate', minInvestment: 1000 }
      ],
      expectedReturns: '6-8% annually',
      rebalancingFrequency: 'Yearly',
      minimumInvestmentPeriod: '3-5 years'
    },
    moderate: {
      allocation: [
        { type: 'Mutual Funds', percentage: 40, description: 'Balanced risk-return', expectedReturn: '10-12%', risk: 'Moderate' },
        { type: 'Index Funds', percentage: 30, description: 'Market-linked returns', expectedReturn: '10-11%', risk: 'Moderate' },
        { type: 'Corporate Bonds', percentage: 20, description: 'Regular income', expectedReturn: '7-8%', risk: 'Low-Moderate' },
        { type: 'Real Estate Investment Trusts', percentage: 10, description: 'Property exposure', expectedReturn: '8-10%', risk: 'Moderate' }
      ],
      suggestedFunds: [
        { name: 'Balanced Mutual Funds', type: 'Hybrid', risk: 'Moderate', minInvestment: 5000 },
        { name: 'Dividend Yield Funds', type: 'Equity', risk: 'Moderate', minInvestment: 5000 },
        { name: 'Multi-cap Funds', type: 'Equity', risk: 'Moderate-High', minInvestment: 1000 }
      ],
      expectedReturns: '10-12% annually',
      rebalancingFrequency: 'Semi-annually',
      minimumInvestmentPeriod: '5-7 years'
    },
    aggressive: {
      allocation: [
        { type: 'Growth Stocks', percentage: 50, description: 'High growth potential', expectedReturn: '15-18%', risk: 'High' },
        { type: 'Small-cap Funds', percentage: 25, description: 'Aggressive growth', expectedReturn: '14-16%', risk: 'Very High' },
        { type: 'International Funds', percentage: 15, description: 'Global exposure', expectedReturn: '12-14%', risk: 'High' },
        { type: 'Cryptocurrency', percentage: 10, description: 'High risk, high reward', expectedReturn: '20-25%', risk: 'Very High' }
      ],
      suggestedFunds: [
        { name: 'Small-cap Growth Funds', type: 'Equity', risk: 'High', minInvestment: 5000 },
        { name: 'Sector-specific Funds', type: 'Equity', risk: 'Very High', minInvestment: 5000 },
        { name: 'International Growth Funds', type: 'Equity', risk: 'High', minInvestment: 1000 }
      ],
      expectedReturns: '14-16% annually',
      rebalancingFrequency: 'Quarterly',
      minimumInvestmentPeriod: '7-10 years'
    }
  };

  const recommendation = recommendations[riskTolerance] || recommendations.moderate;
  
  // Calculate suggested investment amounts
  recommendation.allocation = recommendation.allocation.map(asset => ({
    ...asset,
    suggestedAmount: (investmentAmount * asset.percentage) / 100
  }));

  return recommendation;
};

// Analyze financial goals and provide comprehensive recommendations
export const analyzeFinancialGoals = (financialData) => {
  if (!financialData) return [];

  const { monthlyIncome = 0, monthlyExpenses = 0, goals = [], investments = {}, riskTolerance = 'moderate' } = financialData;
  const monthlySavings = monthlyIncome - monthlyExpenses;
  const recommendations = [];

  // Analyze each goal
  goals.forEach(goal => {
    const targetDate = new Date(goal.targetDate);
    const today = new Date();
    const monthsToGoal = (targetDate.getFullYear() - today.getFullYear()) * 12 + 
                       (targetDate.getMonth() - today.getMonth());
    
    const requiredMonthlySaving = (goal.targetAmount - goal.currentAmount) / monthsToGoal;
    const isAchievable = monthlySavings >= requiredMonthlySaving;

    const recommendation = {
      goalId: goal.id,
      name: goal.name,
      isAchievable,
      gap: isAchievable ? 0 : requiredMonthlySaving - monthlySavings,
      timeToGoal: monthsToGoal,
      progressPercentage: (goal.currentAmount / goal.targetAmount) * 100,
      suggestions: []
    };

    // If goal is not achievable with current savings
    if (!isAchievable) {
      // Calculate required income increase
      const requiredIncomeIncrease = requiredMonthlySaving - monthlySavings;
      const percentageIncrease = (requiredIncomeIncrease / monthlyIncome) * 100;

      // Suggest side hustles based on income requirements
      const relevantSideHustles = [...sideHustleRecommendations.tech, ...sideHustleRecommendations.creative, ...sideHustleRecommendations.general]
        .filter(hustle => {
          const estimatedIncome = parseFloat(hustle.income.match(/\d+/)[0]); // Extract minimum income
          return estimatedIncome * 160 >= requiredIncomeIncrease; // Assuming 160 hours per month
        })
        .sort((a, b) => {
          const incomeA = parseFloat(a.income.match(/\d+/)[0]);
          const incomeB = parseFloat(b.income.match(/\d+/)[0]);
          return incomeB - incomeA;
        })
        .slice(0, 3);

      recommendation.suggestions.push({
        type: 'income',
        title: `Increase Income (Need ₹${Math.round(requiredIncomeIncrease).toLocaleString()}/month)`,
        options: relevantSideHustles
      });

      // Suggest budgeting tools based on expense management needs
      const relevantTools = budgetingTools
        .filter(tool => {
          const hasExpenseTracking = tool.features.some(f => f.toLowerCase().includes('expense') || f.toLowerCase().includes('budget'));
          return hasExpenseTracking;
        })
        .sort((a, b) => b.rating - a.rating);

      recommendation.suggestions.push({
        type: 'budgeting',
        title: 'Optimize Your Budget',
        options: relevantTools
      });

      // Suggest skill development based on goal amount
      const relevantSkills = [
        ...skillDevelopmentResources.finance,
        ...skillDevelopmentResources.business,
        ...skillDevelopmentResources.programming
      ].filter(skill => skill.jobSupport)
        .sort((a, b) => {
          const costA = typeof a.cost === 'string' ? parseFloat(a.cost.match(/\d+/)[0]) : 0;
          const costB = typeof b.cost === 'string' ? parseFloat(b.cost.match(/\d+/)[0]) : 0;
          return costA - costB;
        })
        .slice(0, 3);

      recommendation.suggestions.push({
        type: 'skills',
        title: 'Invest in Your Skills',
        options: relevantSkills
      });

      // Investment recommendations based on goal timeline and risk tolerance
      const investmentSuggestions = getInvestmentRecommendations(
        riskTolerance || 'moderate',
        goal.targetAmount - goal.currentAmount
      );

      recommendation.suggestions.push({
        type: 'investment',
        title: 'Optimize Your Investments',
        options: investmentSuggestions
      });
    }

    recommendations.push(recommendation);
  });

  return recommendations;
};

// Get personalized investment recommendations with detailed analysis
export const getPersonalizedInvestments = (riskTolerance, monthlyInvestment, investmentHorizon) => {
  const recommendations = getInvestmentRecommendations(riskTolerance, monthlyInvestment * 12);
  
  // Calculate potential returns
  const projectedReturns = recommendations.allocation.map(asset => {
    const [minReturn, maxReturn] = asset.expectedReturn.split('-').map(r => parseFloat(r));
    const averageReturn = (minReturn + maxReturn) / 2;
    const monthlyAmount = (monthlyInvestment * asset.percentage) / 100;
    
    return {
      type: asset.type,
      monthlyAmount,
      yearlyAmount: monthlyAmount * 12,
      projectedValue: monthlyAmount * 12 * investmentHorizon * (1 + averageReturn/100),
      riskLevel: asset.risk,
      expectedReturn: asset.expectedReturn
    };
  });

  return {
    ...recommendations,
    projectedReturns,
    totalProjectedValue: projectedReturns.reduce((sum, asset) => sum + asset.projectedValue, 0),
    investmentHorizon,
    monthlyInvestment,
    yearlyInvestment: monthlyInvestment * 12
  };
};