const express = require('express');
const router = express.Router();
const { 
  getBudget,
  updateBudget,
  getBudgetSummary,
  getSpendingByCategory
} = require('../controllers/budgetController');
const { protect } = require('../middleware/authMiddleware');

// All budget routes require authentication
router.use(protect);

// Budget routes
router.route('/')
  .get(getBudget)
  .post(updateBudget);

// Budget summary route
router.get('/summary', getBudgetSummary);

// Spending by category route
router.get('/spending-by-category', getSpendingByCategory);

module.exports = router;