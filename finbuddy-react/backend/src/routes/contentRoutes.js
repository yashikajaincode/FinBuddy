const express = require('express');
const router = express.Router();
const { 
  getFinancialTips, 
  getInvestmentModules, 
  completeInvestmentModule,
  getAffordabilityAnalysis
} = require('../controllers/contentController');
const { protect } = require('../middleware/authMiddleware');

// All content routes require authentication
router.use(protect);

// Financial Tips Routes
router.get('/tips', getFinancialTips);

// Investment Education Routes
router.get('/investment/modules', getInvestmentModules);
router.post('/investment/modules/:id/complete', completeInvestmentModule);

// Affordability Calculator Routes
router.get('/affordability', getAffordabilityAnalysis);

module.exports = router;