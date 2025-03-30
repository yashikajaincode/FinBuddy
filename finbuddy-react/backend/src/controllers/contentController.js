const db = require('../models/db');
const { awardBadge } = require('./userController');

// Get financial tips
const getFinancialTips = async (req, res) => {
  try {
    const userId = req.user.id;
    const { category, limit } = req.query;
    
    // Build query
    let query = 'SELECT * FROM financial_tips';
    const values = [];
    
    if (category) {
      query += ' WHERE category = $1';
      values.push(category);
    }
    
    query += ' ORDER BY created_at DESC';
    
    if (limit && !isNaN(parseInt(limit))) {
      query += ' LIMIT $' + (values.length + 1);
      values.push(parseInt(limit));
    }
    
    // Execute query
    const result = await db.query(query, values);
    
    // Track tip views for user
    const viewCount = await db.query(
      'SELECT COUNT(*) FROM user_tips_viewed WHERE user_id = $1',
      [userId]
    );
    
    // Award badges based on tip views
    const currentCount = parseInt(viewCount.rows[0].count);
    
    if (currentCount === 0) {
      // First time viewing tips
      await db.query(
        'INSERT INTO user_tips_viewed (user_id, tip_count) VALUES ($1, 1)',
        [userId]
      );
      await awardBadge(userId, 'Tip Seeker');
    } else if (currentCount < 5) {
      // Increment tip count
      await db.query(
        'UPDATE user_tips_viewed SET tip_count = $1 WHERE user_id = $2',
        [currentCount + 1, userId]
      );
      
      // Award badge at 5 tips
      if (currentCount + 1 >= 5) {
        await awardBadge(userId, 'Finance Guru');
      }
    }
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('Error getting financial tips:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get financial tips',
      error: error.message
    });
  }
};

// Get investment education modules
const getInvestmentModules = async (req, res) => {
  try {
    const userId = req.user.id;
    const { difficulty } = req.query;
    
    // Build query for modules
    let moduleQuery = 'SELECT * FROM investment_modules';
    const moduleValues = [];
    
    if (difficulty) {
      moduleQuery += ' WHERE difficulty = $1';
      moduleValues.push(difficulty);
    }
    
    moduleQuery += ' ORDER BY difficulty, id';
    
    // Get all modules
    const modulesResult = await db.query(moduleQuery, moduleValues);
    
    // Get user's completed modules
    const completedResult = await db.query(
      'SELECT module_id, completed_at, quiz_score FROM user_completed_modules WHERE user_id = $1',
      [userId]
    );
    
    // Map completed modules
    const completedModules = {};
    completedResult.rows.forEach(row => {
      completedModules[row.module_id] = {
        completed: true,
        completed_at: row.completed_at,
        quiz_score: row.quiz_score
      };
    });
    
    // Format response
    const modules = modulesResult.rows.map(module => {
      return {
        ...module,
        completed: completedModules[module.id] ? true : false,
        completed_at: completedModules[module.id] ? completedModules[module.id].completed_at : null,
        quiz_score: completedModules[module.id] ? completedModules[module.id].quiz_score : null
      };
    });
    
    res.status(200).json({
      success: true,
      data: modules
    });
    
  } catch (error) {
    console.error('Error getting investment modules:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get investment modules',
      error: error.message
    });
  }
};

// Mark an investment module as completed
const completeInvestmentModule = async (req, res) => {
  try {
    const userId = req.user.id;
    const moduleId = req.params.id;
    const { quiz_score } = req.body;
    
    // Check if module exists
    const moduleCheck = await db.query(
      'SELECT * FROM investment_modules WHERE id = $1',
      [moduleId]
    );
    
    if (moduleCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Investment module not found'
      });
    }
    
    // Check if already completed
    const completedCheck = await db.query(
      'SELECT * FROM user_completed_modules WHERE user_id = $1 AND module_id = $2',
      [userId, moduleId]
    );
    
    let message = '';
    
    if (completedCheck.rows.length === 0) {
      // First time completing this module
      await db.query(
        'INSERT INTO user_completed_modules (user_id, module_id, quiz_score) VALUES ($1, $2, $3)',
        [userId, moduleId, quiz_score || null]
      );
      message = 'Module marked as completed';
      
      // Count completed modules
      const completedCount = await db.query(
        'SELECT COUNT(*) FROM user_completed_modules WHERE user_id = $1',
        [userId]
      );
      
      // Award badges
      if (parseInt(completedCount.rows[0].count) === 1) {
        // First module completed
        await awardBadge(userId, 'Investment Student');
      } else if (parseInt(completedCount.rows[0].count) >= 3) {
        // Three or more modules completed
        await awardBadge(userId, 'Investment Explorer');
      }
      
      // Award quiz badge if high score
      if (quiz_score && quiz_score >= 80) {
        await awardBadge(userId, 'Investment Guru');
      }
    } else {
      // Update existing completion
      await db.query(
        'UPDATE user_completed_modules SET completed_at = NOW(), quiz_score = $1 WHERE user_id = $2 AND module_id = $3',
        [quiz_score || completedCheck.rows[0].quiz_score, userId, moduleId]
      );
      message = 'Module completion updated';
      
      // Award quiz badge if high score
      if (quiz_score && quiz_score >= 80 && completedCheck.rows[0].quiz_score < 80) {
        await awardBadge(userId, 'Investment Guru');
      }
    }
    
    res.status(200).json({
      success: true,
      message: message,
      data: {
        module_id: moduleId,
        completed_at: new Date(),
        quiz_score: quiz_score
      }
    });
    
  } catch (error) {
    console.error('Error completing investment module:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to complete investment module',
      error: error.message
    });
  }
};

// Get affordability analysis
const getAffordabilityAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;
    const { item_name, item_price, item_necessity } = req.query;
    
    // Validate input
    if (!item_name || !item_price || isNaN(parseFloat(item_price))) {
      return res.status(400).json({
        success: false,
        message: 'Item name and valid price are required'
      });
    }
    
    // Parse inputs
    const price = parseFloat(item_price);
    const necessity = item_necessity || 'want'; // want or need
    
    // Get user's budget
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
    
    // Calculate discretionary income
    const discretionaryIncome = budget.total_income - budget.total_expenses;
    
    // Determine affordability
    let affordable = false;
    let impact = 'high';
    let recommendation = '';
    
    if (discretionaryIncome <= 0) {
      affordable = false;
      recommendation = 'You currently have no discretionary income. This purchase is not recommended.';
    } else if (price <= discretionaryIncome * 0.1) {
      affordable = true;
      impact = 'low';
      recommendation = 'This purchase has a low impact on your finances and is affordable.';
    } else if (price <= discretionaryIncome * 0.5) {
      affordable = true;
      impact = 'medium';
      recommendation = 'This purchase is affordable but will use a significant portion of your monthly discretionary income.';
    } else if (price <= discretionaryIncome) {
      affordable = true;
      impact = 'high';
      recommendation = 'This purchase will use most of your monthly discretionary income. Consider saving for it over time.';
    } else if (price <= discretionaryIncome * 3) {
      affordable = false;
      recommendation = 'This purchase exceeds your monthly discretionary income. Consider saving for it over 3 months.';
    } else {
      affordable = false;
      recommendation = 'This purchase is significant compared to your income. It requires a dedicated savings plan.';
    }
    
    // Calculate months to save
    const monthsToSave = Math.ceil(price / (discretionaryIncome * 0.5));
    
    // Award badge for using calculator
    await awardBadge(userId, 'Smart Shopper');
    
    res.status(200).json({
      success: true,
      data: {
        item_name: item_name,
        item_price: price,
        is_affordable: affordable,
        impact: impact,
        monthly_discretionary_income: discretionaryIncome,
        recommendation: recommendation,
        savings_plan: {
          suggested_monthly_savings: discretionaryIncome * 0.5,
          months_to_save: monthsToSave
        }
      }
    });
    
  } catch (error) {
    console.error('Error analyzing affordability:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze affordability',
      error: error.message
    });
  }
};

module.exports = {
  getFinancialTips,
  getInvestmentModules,
  completeInvestmentModule,
  getAffordabilityAnalysis
};