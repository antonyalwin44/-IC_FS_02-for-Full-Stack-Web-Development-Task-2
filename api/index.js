// Vercel serverless function entry point
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('../server/config/database');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database on cold start
let dbConnected = false;
const ensureDbConnection = async () => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error('DB connection failed:', error);
    }
  }
};

// Ensure DB connection before handling requests
app.use(async (req, res, next) => {
  await ensureDbConnection();
  next();
});

// Routes
app.use('/api/auth', require('../server/routes/auth'));
app.use('/api/certificates', require('../server/routes/certificates'));
app.use('/api/templates', require('../server/routes/templates'));
app.use('/api/analytics', require('../server/routes/analytics'));

// Health check
app.get('/api/health', async (req, res) => {
  await ensureDbConnection();
  res.json({ 
    success: true, 
    message: 'API is running',
    timestamp: new Date().toISOString(),
    env: {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV
    }
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Something went wrong!'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

module.exports = app;
