const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/models/db');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import routes
const userRoutes = require('./src/routes/userRoutes');
const budgetRoutes = require('./src/routes/budgetRoutes');
const savingsRoutes = require('./src/routes/savingsRoutes');

// Start server function
const startServer = async () => {
  try {
    // Test database connection
    const connected = await db.testConnection();
    
    if (connected) {
      // Initialize database schema
      await db.initDatabase();
      
      // Import routes
      const contentRoutes = require('./src/routes/contentRoutes');
      const chatRoutes = require('./src/routes/chatRoutes');
      
      // API routes
      app.use('/api/users', userRoutes);
      app.use('/api/budget', budgetRoutes);
      app.use('/api/savings', savingsRoutes);
      app.use('/api/content', contentRoutes);
      app.use('/api/chat', chatRoutes);
      
      // Basic route
      app.get('/', (req, res) => {
        res.send('FinBuddy API is running');
      });
      
      // Start server
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } else {
      console.error('Could not connect to the database. Server not started.');
    }
  } catch (error) {
    console.error('Error starting server:', error);
  }
};

// Start the server
startServer();

module.exports = db;