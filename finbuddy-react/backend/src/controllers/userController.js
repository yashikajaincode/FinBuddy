const db = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password'
      });
    }
    
    // Check if user already exists
    const userCheck = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    
    if (userCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const result = await db.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email, created_at',
      [name, email.toLowerCase(), hashedPassword]
    );
    
    const user = result.rows[0];
    
    // Generate JWT token
    const token = generateToken(user.id);
    
    // Create welcome badge
    await awardBadge(user.id, 'Welcome');
    
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token: token
      }
    });
    
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message
    });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }
    
    // Find user
    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email.toLowerCase()]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    const user = result.rows[0];
    
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate JWT token
    const token = generateToken(user.id);
    
    // Update last login
    await db.query(
      'UPDATE users SET last_login = NOW() WHERE id = $1',
      [user.id]
    );
    
    res.status(200).json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        token: token
      }
    });
    
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login',
      error: error.message
    });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user data without password
    const result = await db.query(
      'SELECT id, name, email, created_at, last_login FROM users WHERE id = $1',
      [userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const user = result.rows[0];
    
    // Get user badges
    const badgesResult = await db.query(
      'SELECT badge_name, emoji, awarded_at FROM user_badges WHERE user_id = $1 ORDER BY awarded_at DESC',
      [userId]
    );
    
    // Get user stats
    const statsResult = await db.query(
      `SELECT 
         (SELECT COUNT(*) FROM budgets WHERE user_id = $1) as has_budget,
         (SELECT COUNT(*) FROM savings_goals WHERE user_id = $1) as savings_goals_count,
         (SELECT COUNT(*) FROM savings_goals WHERE user_id = $1 AND completed = true) as completed_goals_count
       FROM users WHERE id = $1`,
      [userId]
    );
    
    res.status(200).json({
      success: true,
      data: {
        user: user,
        badges: badgesResult.rows,
        stats: statsResult.rows[0]
      }
    });
    
  } catch (error) {
    console.error('Error getting user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get profile',
      error: error.message
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, email, current_password, new_password } = req.body;
    
    // Check if user exists
    const userCheck = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [userId]
    );
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const user = userCheck.rows[0];
    
    // Handle password change if requested
    if (current_password && new_password) {
      // Verify current password
      const isMatch = await bcrypt.compare(current_password, user.password);
      
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect'
        });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(new_password, salt);
      
      // Update password
      await db.query(
        'UPDATE users SET password = $1 WHERE id = $2',
        [hashedPassword, userId]
      );
    }
    
    // Update other fields if provided
    if (name || email) {
      // Check if email already exists if changing email
      if (email && email !== user.email) {
        const emailCheck = await db.query(
          'SELECT * FROM users WHERE email = $1 AND id != $2',
          [email.toLowerCase(), userId]
        );
        
        if (emailCheck.rows.length > 0) {
          return res.status(400).json({
            success: false,
            message: 'Email already in use'
          });
        }
      }
      
      // Update profile
      await db.query(
        `UPDATE users 
         SET name = COALESCE($1, name),
             email = COALESCE($2, email)
         WHERE id = $3`,
        [name || null, email ? email.toLowerCase() : null, userId]
      );
    }
    
    // Get updated user data
    const result = await db.query(
      'SELECT id, name, email, created_at, last_login FROM users WHERE id = $1',
      [userId]
    );
    
    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// Award a badge to a user
const awardBadge = async (userId, badgeName) => {
  try {
    // Get badge info
    const badgeResult = await db.query(
      'SELECT * FROM badges WHERE name = $1',
      [badgeName]
    );
    
    if (badgeResult.rows.length === 0) {
      console.error(`Badge '${badgeName}' not found`);
      return false;
    }
    
    const badge = badgeResult.rows[0];
    
    // Check if user already has this badge
    const userBadgeCheck = await db.query(
      'SELECT * FROM user_badges WHERE user_id = $1 AND badge_name = $2',
      [userId, badgeName]
    );
    
    if (userBadgeCheck.rows.length > 0) {
      // User already has this badge
      return false;
    }
    
    // Award badge
    await db.query(
      'INSERT INTO user_badges (user_id, badge_name, emoji) VALUES ($1, $2, $3)',
      [userId, badgeName, badge.emoji]
    );
    
    return true;
  } catch (error) {
    console.error('Error awarding badge:', error);
    return false;
  }
};

// Get all badges (available and earned)
const getAllBadges = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all badges
    const allBadgesResult = await db.query('SELECT * FROM badges ORDER BY id');
    
    // Get user's earned badges
    const userBadgesResult = await db.query(
      'SELECT badge_name, awarded_at FROM user_badges WHERE user_id = $1',
      [userId]
    );
    
    // Map earned badges
    const earnedBadges = {};
    userBadgesResult.rows.forEach(badge => {
      earnedBadges[badge.badge_name] = {
        earned: true,
        awarded_at: badge.awarded_at
      };
    });
    
    // Format response
    const badges = allBadgesResult.rows.map(badge => {
      return {
        name: badge.name,
        description: badge.description,
        emoji: badge.emoji,
        earned: !!earnedBadges[badge.name],
        awarded_at: earnedBadges[badge.name] ? earnedBadges[badge.name].awarded_at : null
      };
    });
    
    // Group badges by category
    const categorizedBadges = {};
    badges.forEach(badge => {
      const category = badge.name.includes('Budget') ? 'Budget' :
                      badge.name.includes('Savings') || badge.name.includes('Goal') ? 'Savings' :
                      badge.name.includes('Investment') ? 'Investment' :
                      'General';
      
      if (!categorizedBadges[category]) {
        categorizedBadges[category] = [];
      }
      
      categorizedBadges[category].push(badge);
    });
    
    res.status(200).json({
      success: true,
      data: {
        all_badges: badges,
        earned_count: userBadgesResult.rows.length,
        total_count: allBadgesResult.rows.length,
        categorized: categorizedBadges
      }
    });
    
  } catch (error) {
    console.error('Error getting badges:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get badges',
      error: error.message
    });
  }
};

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  getAllBadges,
  awardBadge
};