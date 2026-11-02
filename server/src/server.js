const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, getDBStatus } = require('./config/db');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Core Middleware
const clientOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(
  cors({
    origin: [clientOrigin, 'http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Lightweight request logger for integration tracing
app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url} — ${new Date().toLocaleTimeString()}`);
  next();
});

// ==========================================
// INTEGRATION & HEALTHCHECK ROUTE (Member 5 Task)
// ==========================================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ONLINE',
    project: 'PetCare Planner — Pet Care Records & Reminder Board',
    team: 'PawTech Innovators',
    integration: 'Godishala Kruthik Roshan (2303A52339)',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: getDBStatus(),
    version: '1.0.0',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me',
      },
      pets: {
        list: 'GET /api/pets',
        getById: 'GET /api/pets/:id',
        create: 'POST /api/pets',
        update: 'PUT /api/pets/:id',
        delete: 'DELETE /api/pets/:id',
      },
      records: {
        list: 'GET /api/records',
        create: 'POST /api/records',
        delete: 'DELETE /api/records/:id',
      },
      reminders: {
        list: 'GET /api/reminders',
      },
    },
  });
});

// ==========================================
// MOUNT MODULE ROUTERS
// ==========================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pets', require('./routes/petRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/care-records', require('./routes/recordRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root Fallback Info
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the PetCare Planner Backend API Server',
    healthCheck: '/api/health',
    team: 'PawTech Innovators',
  });
});

// Error Handling Middleware
app.use(notFoundHandler);
app.use(errorHandler);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log('====================================================');
    console.log(`🚀 PetCare Planner Server listening on port ${PORT}`);
    console.log(`📡 Health Check URL: http://localhost:${PORT}/api/health`);
    console.log(`🌐 Allowed Frontend Origin: ${clientOrigin}`);
    console.log(`👨‍💻 Integration: Godishala Kruthik Roshan (Roll: 2303A52339)`);
    console.log('====================================================');
  });
}

module.exports = app;

