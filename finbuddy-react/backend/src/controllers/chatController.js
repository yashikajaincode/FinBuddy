const db = require('../models/db');
const openai = require('openai');

// Create a new instance of the OpenAI API
const openaiClient = new openai.OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// System message defining the AI assistant's behavior
const SYSTEM_MESSAGE = `You are FinBuddy, an AI assistant that helps users learn about personal finance, budgeting, saving, and investing. 
Your responses should be friendly, informative, and geared toward financial education for beginners.

Key guidelines:
1. Keep explanations simple and easy to understand.
2. Use examples relevant to young adults or students when possible.
3. Be encouraging and positive about small financial steps.
4. Avoid suggesting specific investments or financial products.
5. For investment questions, focus on educational content about concepts and risks rather than specific recommendations.
6. Use a conversational, friendly tone with GenZ-appropriate language, but remain professional.
7. Provide actionable tips that are practical for people with limited income.
8. Remind users that you are not a licensed financial advisor for complex questions.`;

// Fallback responses when API is not available
const FALLBACK_RESPONSES = [
  "As a budgeting tip, try the 50/30/20 rule: 50% of income for needs, 30% for wants, and 20% for savings and debt repayment.",
  "A simple way to save money is to wait 24 hours before making any non-essential purchase over $50.",
  "For beginners, investing in low-cost index funds is often recommended due to their simplicity and diversification.",
  "Building an emergency fund that covers 3-6 months of expenses should be a priority before investing.",
  "Credit cards can be useful tools when used responsibly - always pay the full balance each month to avoid interest charges.",
  "When saving for goals, consider using separate savings accounts for different purposes to track progress better.",
  "Compound interest is powerful - even small amounts invested early can grow significantly over time.",
  "A good first step in budgeting is tracking all expenses for a month to see where your money actually goes.",
  "Student loans: federal loans typically offer more flexible repayment options than private loans.",
  "For retirement savings, take advantage of any employer match in your 401(k) - it's essentially free money."
];

// Get chat response
const getChatResponse = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;
    
    // Validate input
    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required'
      });
    }
    
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      // Use fallback response if no API key
      const randomIndex = Math.floor(Math.random() * FALLBACK_RESPONSES.length);
      return res.status(200).json({
        success: true,
        data: {
          response: FALLBACK_RESPONSES[randomIndex],
          is_fallback: true
        }
      });
    }
    
    // Get chat history from request (optional)
    const history = req.body.history || [];
    
    // Format messages for OpenAI
    const messages = [
      { role: 'system', content: SYSTEM_MESSAGE },
      ...history.map(msg => ({ 
        role: msg.is_user ? 'user' : 'assistant', 
        content: msg.content 
      })),
      { role: 'user', content: message }
    ];
    
    // Call OpenAI API
    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });
    
    // Extract response
    const response = completion.choices[0].message.content;
    
    // Return response
    res.status(200).json({
      success: true,
      data: {
        response: response,
        is_fallback: false
      }
    });
    
  } catch (error) {
    console.error('Error getting chat response:', error);
    
    // Use fallback response if error occurs
    const randomIndex = Math.floor(Math.random() * FALLBACK_RESPONSES.length);
    res.status(200).json({
      success: true,
      data: {
        response: FALLBACK_RESPONSES[randomIndex],
        is_fallback: true,
        error: error.message
      }
    });
  }
};

// Get user chat history
const getChatHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit } = req.query;
    
    // Build query
    let query = 'SELECT * FROM chat_messages WHERE user_id = $1 ORDER BY created_at DESC';
    const values = [userId];
    
    if (limit && !isNaN(parseInt(limit))) {
      query += ' LIMIT $2';
      values.push(parseInt(limit));
    }
    
    // Execute query
    const result = await db.query(query, values);
    
    // Format messages
    const messages = result.rows.map(row => ({
      id: row.id,
      content: row.content,
      is_user: row.is_user,
      created_at: row.created_at
    }));
    
    res.status(200).json({
      success: true,
      data: messages.reverse() // Return in chronological order
    });
    
  } catch (error) {
    console.error('Error getting chat history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get chat history',
      error: error.message
    });
  }
};

// Save chat message
const saveChatMessage = async (req, res) => {
  try {
    const userId = req.user.id;
    const { content, is_user } = req.body;
    
    // Validate input
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }
    
    // Insert message
    const result = await db.query(
      'INSERT INTO chat_messages (user_id, content, is_user) VALUES ($1, $2, $3) RETURNING *',
      [userId, content, is_user]
    );
    
    res.status(201).json({
      success: true,
      data: result.rows[0]
    });
    
  } catch (error) {
    console.error('Error saving chat message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save chat message',
      error: error.message
    });
  }
};

module.exports = {
  getChatResponse,
  getChatHistory,
  saveChatMessage
};