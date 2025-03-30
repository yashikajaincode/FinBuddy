const db = require('../models/db');
const { awardBadge } = require('./userController');

// Get user budget
const getBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get budget
    const budgetResult = await db.query(
      'SELECT * FROM budgets WHERE user_id = $1',
      [userId]
    );
    
    // Get income items
    const incomeResult = await db.query(
      'SELECT * FROM income_items WHERE user_id = $1 ORDER BY amount DESC',
      [userId]
    );
    
    // Get expense items
    const expenseResult = await db.query(
      'SELECT * FROM expense_items WHERE user_id = $1 ORDER BY category, amount DESC',
      [userId]
    );
    
    // Format response
    const budget = budgetResult.rows.length > 0 ? budgetResult.rows[0] : {
      user_id: userId,
      total_income: 0,
      total_expenses: 0,
      savings_target: 0,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const response = {
      budget: budget,
      income: incomeResult.rows,
      expenses: expenseResult.rows,
      summary: {
        total_income: parseFloat(budget.total_income) || 0,
        total_expenses: parseFloat(budget.total_expenses) || 0,
        net: (parseFloat(budget.total_income) || 0) - (parseFloat(budget.total_expenses) || 0),
        savings_target: parseFloat(budget.savings_target) || 0
      }
    };
    
    res.status(200).json({
      success: true,
      data: response
    });
    
  } catch (error) {
    console.error('Error getting budget:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get budget',
      error: error.message
    });
  }
};

// Create or update budget
const updateBudget = async (req, res) => {
  try {
    const userId = req.user.id;
    const { income, expenses, savings_target } = req.body;
    
    // Validate input
    if (!Array.isArray(income) || !Array.isArray(expenses)) {
      return res.status(400).json({
        success: false,
        message: 'Income and expenses must be arrays'
      });
    }
    
    // Calculate totals
    const totalIncome = income.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0);
    
    // Begin transaction
    await db.query('BEGIN');
    
    // Check if budget exists
    const budgetCheck = await db.query(
      'SELECT * FROM budgets WHERE user_id = $1',
      [userId]
    );
    
    // Create or update budget
    if (budgetCheck.rows.length === 0) {
      // Create new budget
      await db.query(
        `INSERT INTO budgets 
         (user_id, total_income, total_expenses, savings_target) 
         VALUES ($1, $2, $3, $4)`,
        [userId, totalIncome, totalExpenses, savings_target || 0]
      );
      
      // Award badge for first budget
      await awardBadge(userId, 'Budget Beginner');
    } else {
      // Update existing budget
      await db.query(
        `UPDATE budgets 
         SET total_income = $1, 
             total_expenses = $2, 
             savings_target = $3, 
             updated_at = NOW() 
         WHERE user_id = $4`,
        [totalIncome, totalExpenses, savings_target || 0, userId]
      );
    }
    
    // Clear existing income and expenses
    await db.query('DELETE FROM income_items WHERE user_id = $1', [userId]);
    await db.query('DELETE FROM expense_items WHERE user_id = $1', [userId]);
    
    // Add income items
    for (const item of income) {
      if (item.name && !isNaN(parseFloat(item.amount))) {
        await db.query(
          'INSERT INTO income_items (user_id, name, amount) VALUES ($1, $2, $3)',
          [userId, item.name, parseFloat(item.amount)]
        );
      }
    }
    
    // Add expense items
    for (const item of expenses) {
      if (item.name && !isNaN(parseFloat(item.amount))) {
        await db.query(
          'INSERT INTO expense_items (user_id, name, amount, category) VALUES ($1, $2, $3, $4)',
          [userId, item.name, parseFloat(item.amount), item.category || 'Other']
        );
      }
    }
    
    // Award badge if expenses are categorized
    const categories = new Set(expenses.map(e => e.category).filter(Boolean));
    if (categories.size >= 3) {
      await awardBadge(userId, 'Budget Master');
    }
    
    // Award badge if saving at least 20% of income
    const savingsRate = totalIncome > 0 ? (totalIncome - totalExpenses) / totalIncome : 0;
    if (savingsRate >= 0.2 && totalIncome > 0) {
      await awardBadge(userId, 'Savings Pro');
    }
    
    // Commit transaction
    await db.query('COMMIT');
    
    res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      data: {
        total_income: totalIncome,
        total_expenses: totalExpenses,
        net: totalIncome - totalExpenses,
        savings_target: savings_target || 0
      }
    });
    
  } catch (error) {
    // Rollback transaction on error
    await db.query('ROLLBACK');
    
    console.error('Error updating budget:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update budget',
      error: error.message
    });
  }
};

// Get budget summary with insights
const getBudgetSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get budget data
    const budgetResult = await db.query(
      'SELECT * FROM budgets WHERE user_id = $1',
      [userId]
    );
    
    if (budgetResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No budget found. Please create a budget first.'
      });
    }
    
    const budget = budgetResult.rows[0];
    
    // Get expenses by category
    const categoriesResult = await db.query(
      `SELECT category, SUM(amount) as total
       FROM expense_items 
       WHERE user_id = $1 
       GROUP BY category 
       ORDER BY total DESC`,
      [userId]
    );
    
    // Calculate metrics
    const totalIncome = parseFloat(budget.total_income) || 0;
    const totalExpenses = parseFloat(budget.total_expenses) || 0;
    const savingsAmount = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? (savingsAmount / totalIncome) * 100 : 0;
    
    // Generate insights
    const insights = [];
    
    // Savings rate insight
    if (savingsRate < 10) {
      insights.push({
        type: 'warning',
        message: 'Your savings rate is below 10%. Consider reducing expenses to save more.'
      });
    } else if (savingsRate >= 20) {
      insights.push({
        type: 'success',
        message: 'Great job! You\'re saving more than 20% of your income.'
      });
    }
    
    // Expense category insights
    if (categoriesResult.rows.length > 0) {
      const topCategory = categoriesResult.rows[0];
      const topCategoryPercentage = (parseFloat(topCategory.total) / totalExpenses) * 100;
      
      if (topCategoryPercentage > 50) {
        insights.push({
          type: 'info',
          message: `${topCategory.category} accounts for over ${Math.round(topCategoryPercentage)}% of your expenses. Consider if this aligns with your priorities.`
        });
      }
    }
    
    // Budget improvements
    const improvements = [];
    
    // Check if any expense categories are unusually high
    const categoryBenchmarks = {
      'Housing': 0.33, // Should be no more than 33% of income
      'Food': 0.15,    // Should be no more than 15% of income
      'Entertainment': 0.10, // Should be no more than 10% of income
      'Transportation': 0.15 // Should be no more than 15% of income
    };
    
    for (const category of categoriesResult.rows) {
      const benchmark = categoryBenchmarks[category.category];
      if (benchmark) {
        const percentage = parseFloat(category.total) / totalIncome;
        if (percentage > benchmark) {
          improvements.push({
            category: category.category,
            message: `Your ${category.category} expenses are ${Math.round(percentage * 100)}% of your income, which is higher than the recommended ${Math.round(benchmark * 100)}%.`
          });
        }
      }
    }
    
    // Final response
    res.status(200).json({
      success: true,
      data: {
        summary: {
          total_income: totalIncome,
          total_expenses: totalExpenses,
          net: savingsAmount,
          savings_rate: savingsRate
        },
        expense_breakdown: categoriesResult.rows,
        insights: insights,
        improvements: improvements
      }
    });
    
  } catch (error) {
    console.error('Error getting budget summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get budget summary',
      error: error.message
    });
  }
};

// Get spending by category (for charts)
const getSpendingByCategory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get spending by category
    const result = await db.query(
      `SELECT category, SUM(amount) as total
       FROM expense_items 
       WHERE user_id = $1 
       GROUP BY category 
       ORDER BY total DESC`,
      [userId]
    );
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('Error getting spending by category:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get spending by category',
      error: error.message
    });
  }
};

module.exports = {
  getBudget,
  updateBudget,
  getBudgetSummary,
  getSpendingByCategory
};