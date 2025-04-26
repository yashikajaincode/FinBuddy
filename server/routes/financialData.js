const router = require('express').Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user's financial data
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.financialData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update financial data
router.put('/', auth, async (req, res) => {
  try {
    const { totalBalance, monthlyIncome, monthlyExpenses, goals } = req.body;

    // Validate financial data
    if (monthlyExpenses > monthlyIncome) {
      return res.status(400).json({ message: 'Monthly expenses cannot exceed monthly income' });
    }
    if (totalBalance < 0 || monthlyIncome < 0 || monthlyExpenses < 0) {
      return res.status(400).json({ message: 'Financial values cannot be negative' });
    }
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.financialData.totalBalance = totalBalance;
    user.financialData.monthlyIncome = monthlyIncome;
    user.financialData.monthlyExpenses = monthlyExpenses;

    if (goals && goals.length > 0) {
      user.financialData.goals = goals.map(goal => {
        const targetDate = new Date(goal.targetDate);
        const monthsRemaining = Math.ceil((targetDate - new Date()) / (1000 * 60 * 60 * 24 * 30));
        const remainingAmount = goal.targetAmount - (goal.currentAmount || 0);
        const disposableIncome = monthlyIncome - monthlyExpenses;
        
        // Calculate recommended monthly saving based on timeline and financial capacity
        const idealMonthlySaving = remainingAmount / monthsRemaining;
        const recommendedMonthlySaving = Math.min(idealMonthlySaving, disposableIncome * 0.7);

        return {
          name: goal.name,
          targetAmount: goal.targetAmount,
          targetDate: goal.targetDate,
          currentAmount: goal.currentAmount || 0,
          recommendedMonthlySaving: Math.round(recommendedMonthlySaving)
        };
      });
    }

    await user.save();
    res.json(user.financialData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;