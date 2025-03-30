const db = require('../models/db');
const { awardBadge } = require('./userController');

// Get all savings goals for a user
const getSavingsGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all savings goals
    const result = await db.query(
      'SELECT * FROM savings_goals WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    
    res.status(200).json({
      success: true,
      data: result.rows
    });
    
  } catch (error) {
    console.error('Error getting savings goals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get savings goals',
      error: error.message
    });
  }
};

// Get a single savings goal
const getSavingsGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const goalId = req.params.id;
    
    // Get savings goal
    const result = await db.query(
      'SELECT * FROM savings_goals WHERE id = $1 AND user_id = $2',
      [goalId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found'
      });
    }
    
    // Get contributions
    const contributionsResult = await db.query(
      'SELECT * FROM savings_contributions WHERE goal_id = $1 ORDER BY date DESC',
      [goalId]
    );
    
    const goal = result.rows[0];
    goal.contributions = contributionsResult.rows;
    
    res.status(200).json({
      success: true,
      data: goal
    });
    
  } catch (error) {
    console.error('Error getting savings goal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get savings goal',
      error: error.message
    });
  }
};

// Create a new savings goal
const createSavingsGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, target_amount, target_date, category, description } = req.body;
    
    // Validate required fields
    if (!name || !target_amount) {
      return res.status(400).json({
        success: false,
        message: 'Name and target amount are required'
      });
    }
    
    // Create goal
    const result = await db.query(
      `INSERT INTO savings_goals 
       (user_id, name, target_amount, target_date, category, description, current_amount) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [userId, name, target_amount, target_date || null, category || 'General', description || '', 0]
    );
    
    // Count goals created
    const goalCount = await db.query(
      'SELECT COUNT(*) FROM savings_goals WHERE user_id = $1',
      [userId]
    );
    
    // Award badges based on number of goals
    if (parseInt(goalCount.rows[0].count) === 1) {
      // First savings goal created
      await awardBadge(userId, 'Goal Setter');
    } else if (parseInt(goalCount.rows[0].count) >= 3) {
      // Three or more savings goals
      await awardBadge(userId, 'Super Saver');
    }
    
    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error creating savings goal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create savings goal',
      error: error.message
    });
  }
};

// Update a savings goal
const updateSavingsGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const goalId = req.params.id;
    const { name, target_amount, target_date, category, description } = req.body;
    
    // Check if goal exists
    const checkResult = await db.query(
      'SELECT * FROM savings_goals WHERE id = $1 AND user_id = $2',
      [goalId, userId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found'
      });
    }
    
    // Validate target amount
    if (target_amount && target_amount < checkResult.rows[0].current_amount) {
      return res.status(400).json({
        success: false,
        message: 'Target amount cannot be less than current savings'
      });
    }
    
    // Update goal
    const result = await db.query(
      `UPDATE savings_goals 
       SET name = COALESCE($1, name),
           target_amount = COALESCE($2, target_amount),
           target_date = COALESCE($3, target_date),
           category = COALESCE($4, category),
           description = COALESCE($5, description),
           updated_at = NOW()
       WHERE id = $6 AND user_id = $7
       RETURNING *`,
      [
        name || null, 
        target_amount || null, 
        target_date || null, 
        category || null, 
        description || null, 
        goalId, 
        userId
      ]
    );
    
    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error updating savings goal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update savings goal',
      error: error.message
    });
  }
};

// Delete a savings goal
const deleteSavingsGoal = async (req, res) => {
  try {
    const userId = req.user.id;
    const goalId = req.params.id;
    
    // Check if goal exists
    const checkResult = await db.query(
      'SELECT * FROM savings_goals WHERE id = $1 AND user_id = $2',
      [goalId, userId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found'
      });
    }
    
    // Delete goal and all related contributions (cascade delete handles this)
    await db.query(
      'DELETE FROM savings_goals WHERE id = $1 AND user_id = $2',
      [goalId, userId]
    );
    
    res.status(200).json({
      success: true,
      message: 'Savings goal deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting savings goal:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete savings goal',
      error: error.message
    });
  }
};

// Add a contribution to a savings goal
const addContribution = async (req, res) => {
  try {
    const userId = req.user.id;
    const goalId = req.params.id;
    const { amount, date, notes } = req.body;
    
    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid contribution amount is required'
      });
    }
    
    // Check if goal exists
    const checkResult = await db.query(
      'SELECT * FROM savings_goals WHERE id = $1 AND user_id = $2',
      [goalId, userId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found'
      });
    }
    
    const goal = checkResult.rows[0];
    
    // Add contribution
    const contributionResult = await db.query(
      `INSERT INTO savings_contributions 
       (goal_id, amount, date, notes) 
       VALUES ($1, $2, $3, $4) 
       RETURNING *`,
      [goalId, amount, date || new Date(), notes || '']
    );
    
    // Update goal current amount
    const newAmount = parseFloat(goal.current_amount) + parseFloat(amount);
    
    await db.query(
      `UPDATE savings_goals 
       SET current_amount = $1,
           updated_at = NOW(),
           completed = $2
       WHERE id = $3`,
      [newAmount, newAmount >= goal.target_amount, goalId]
    );
    
    // Award badge if goal is reached
    if (newAmount >= goal.target_amount) {
      await awardBadge(userId, 'Goal Achiever');
      
      // Check if all goals are completed
      const allGoalsResult = await db.query(
        'SELECT COUNT(*) FROM savings_goals WHERE user_id = $1',
        [userId]
      );
      
      const completedGoalsResult = await db.query(
        'SELECT COUNT(*) FROM savings_goals WHERE user_id = $1 AND completed = true',
        [userId]
      );
      
      const totalGoals = parseInt(allGoalsResult.rows[0].count);
      const completedGoals = parseInt(completedGoalsResult.rows[0].count);
      
      if (totalGoals >= 3 && totalGoals === completedGoals) {
        await awardBadge(userId, 'Savings Master');
      }
    }
    
    // Get updated goal
    const updatedGoalResult = await db.query(
      'SELECT * FROM savings_goals WHERE id = $1',
      [goalId]
    );
    
    res.status(201).json({
      success: true,
      data: {
        contribution: contributionResult.rows[0],
        updated_goal: updatedGoalResult.rows[0]
      }
    });
    
  } catch (error) {
    console.error('Error adding contribution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add contribution',
      error: error.message
    });
  }
};

// Remove a contribution from a savings goal
const removeContribution = async (req, res) => {
  try {
    const userId = req.user.id;
    const goalId = req.params.id;
    const contributionId = req.params.contributionId;
    
    // Check if goal exists and belongs to user
    const checkResult = await db.query(
      'SELECT * FROM savings_goals WHERE id = $1 AND user_id = $2',
      [goalId, userId]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Savings goal not found'
      });
    }
    
    // Get contribution amount before deleting
    const contributionResult = await db.query(
      'SELECT * FROM savings_contributions WHERE id = $1 AND goal_id = $2',
      [contributionId, goalId]
    );
    
    if (contributionResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Contribution not found'
      });
    }
    
    const contribution = contributionResult.rows[0];
    const goal = checkResult.rows[0];
    
    // Remove contribution
    await db.query(
      'DELETE FROM savings_contributions WHERE id = $1 AND goal_id = $2',
      [contributionId, goalId]
    );
    
    // Update goal current amount
    const newAmount = Math.max(0, parseFloat(goal.current_amount) - parseFloat(contribution.amount));
    
    await db.query(
      `UPDATE savings_goals 
       SET current_amount = $1,
           updated_at = NOW(),
           completed = $2
       WHERE id = $3`,
      [newAmount, newAmount >= goal.target_amount, goalId]
    );
    
    // Get updated goal
    const updatedGoalResult = await db.query(
      'SELECT * FROM savings_goals WHERE id = $1',
      [goalId]
    );
    
    res.status(200).json({
      success: true,
      message: 'Contribution removed successfully',
      data: {
        updated_goal: updatedGoalResult.rows[0]
      }
    });
    
  } catch (error) {
    console.error('Error removing contribution:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove contribution',
      error: error.message
    });
  }
};

// Get savings summary for a user
const getSavingsSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get total saved across all goals
    const totalSavedResult = await db.query(
      'SELECT SUM(current_amount) as total_saved FROM savings_goals WHERE user_id = $1',
      [userId]
    );
    
    // Get counts of goals by status
    const goalCountsResult = await db.query(
      `SELECT 
         COUNT(*) as total_goals,
         COUNT(CASE WHEN completed = true THEN 1 END) as completed_goals,
         COUNT(CASE WHEN completed = false THEN 1 END) as in_progress_goals
       FROM savings_goals 
       WHERE user_id = $1`,
      [userId]
    );
    
    // Get recent contributions
    const recentContributionsResult = await db.query(
      `SELECT c.*, g.name as goal_name
       FROM savings_contributions c
       JOIN savings_goals g ON c.goal_id = g.id
       WHERE g.user_id = $1
       ORDER BY c.date DESC
       LIMIT 5`,
      [userId]
    );
    
    // Get goals by category
    const categoriesResult = await db.query(
      `SELECT 
         category, 
         COUNT(*) as goal_count,
         SUM(current_amount) as total_saved,
         SUM(target_amount) as total_target
       FROM savings_goals
       WHERE user_id = $1
       GROUP BY category`,
      [userId]
    );
    
    res.status(200).json({
      success: true,
      data: {
        total_saved: parseFloat(totalSavedResult.rows[0].total_saved) || 0,
        goal_counts: goalCountsResult.rows[0],
        recent_contributions: recentContributionsResult.rows,
        categories: categoriesResult.rows
      }
    });
    
  } catch (error) {
    console.error('Error getting savings summary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get savings summary',
      error: error.message
    });
  }
};

module.exports = {
  getSavingsGoals,
  getSavingsGoal,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  addContribution,
  removeContribution,
  getSavingsSummary
};