const express = require('express');
const router = express.Router();
const { 
  getSavingsGoals,
  getSavingsGoal,
  createSavingsGoal,
  updateSavingsGoal,
  deleteSavingsGoal,
  addContribution,
  removeContribution,
  getSavingsSummary
} = require('../controllers/savingsController');
const { protect } = require('../middleware/authMiddleware');

// All savings routes require authentication
router.use(protect);

// Savings summary route
router.get('/summary', getSavingsSummary);

// Savings goals routes
router.route('/')
  .get(getSavingsGoals)
  .post(createSavingsGoal);

// Single goal routes
router.route('/:id')
  .get(getSavingsGoal)
  .put(updateSavingsGoal)
  .delete(deleteSavingsGoal);

// Contribution routes
router.post('/:id/contributions', addContribution);
router.delete('/:id/contributions/:contributionId', removeContribution);

module.exports = router;