const express = require('express');
const router = express.Router();
const { 
  getChatResponse, 
  getChatHistory, 
  saveChatMessage 
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

// All chat routes require authentication
router.use(protect);

// Chat Routes
router.post('/message', getChatResponse);
router.get('/history', getChatHistory);
router.post('/history', saveChatMessage);

module.exports = router;