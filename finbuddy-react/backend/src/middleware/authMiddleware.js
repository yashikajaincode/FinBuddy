const jwt = require('jsonwebtoken');
const db = require('../models/db');

// Protect routes middleware
const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token'
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const result = await db.query(
        'SELECT id, name, email FROM users WHERE id = $1',
        [decoded.id]
      );
      
      if (result.rows.length === 0) {
        return res.status(401).json({
          success: false,
          message: 'Not authorized, user not found'
        });
      }
      
      // Set user in request
      req.user = result.rows[0];
      next();
    } catch (error) {
      console.error('Token verification error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized, invalid token'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

module.exports = { protect };