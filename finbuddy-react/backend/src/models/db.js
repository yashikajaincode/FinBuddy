const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Initialize database pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Test database connection
const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    client.release();
    
    console.log('Database connection successful.');
    console.log('Server time:', result.rows[0].now);
    
    return true;
  } catch (error) {
    console.error('Database connection error:', error.message);
    
    // Specific error reporting
    if (error.code === 'ECONNREFUSED') {
      console.error('Connection refused. Is the database server running?');
    } else if (error.code === '28P01') {
      console.error('Authentication failed. Check your database credentials.');
    } else if (error.code === '3D000') {
      console.error('Database does not exist. Make sure you have created the database.');
    }
    
    return false;
  }
};

// Initialize database schema
const initDatabase = async () => {
  try {
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    const client = await pool.connect();
    await client.query(schema);
    client.release();
    
    console.log('Database schema initialized successfully.');
    return true;
  } catch (error) {
    console.error('Error initializing database schema:', error.message);
    return false;
  }
};

// Query wrapper function
const query = async (text, params) => {
  const start = Date.now();
  
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (process.env.NODE_ENV === 'development') {
      console.log('Executed query:', { text, duration, rows: result.rowCount });
    }
    
    return result;
  } catch (error) {
    console.error('Query error:', error.message);
    console.error('Query:', text);
    console.error('Params:', params);
    throw error;
  }
};

module.exports = {
  query,
  testConnection,
  initDatabase,
  pool
};