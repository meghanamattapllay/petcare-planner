const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();
const { connectDB, getDBStatus } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(
  cors({
    origin: (origin, callback) => {

      callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url} — ${new Date().toLocaleTimeString()}`);
  next();
});

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
    suggestedEndpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/pets',
      'POST /api/pets',
      'GET /api/pets/:id',
      'PATCH /api/pets/:id',
      'DELETE /api/pets/:id',
      'GET /api/pets/:id/care-records',
      'POST /api/pets/:id/care-records',
      'PATCH /api/care-records/:id',
      'DELETE /api/care-records/:id',
      'GET /api/care-records/upcoming',
    ],
    adminEndpoints: [
      'GET /api/admin/stats',
      'GET /api/admin/users',
      'PATCH /api/admin/users/:id/role',
      'GET /api/admin/pets',
      'DELETE /api/admin/pets/:id',
      'GET /api/admin/care-categories',
      'POST /api/admin/care-categories',
    ],
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pets', require('./routes/petRoutes'));
app.use('/api/records', require('./routes/recordRoutes'));
app.use('/api/care-records', require('./routes/recordRoutes'));
app.use('/api/reminders', require('./routes/reminderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

const distPath = path.join(__dirname, '../../client/dist');
const altDistPath = path.join(__dirname, '../client/dist');
const clientDist = fs.existsSync(distPath) ? distPath : (fs.existsSync(altDistPath) ? altDistPath : null);

if (clientDist) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(clientDist, 'index.html'));
  });
} else {

  app.get('/', (req, res) => {
    res.json({
      message: 'Welcome to the PetCare Planner Backend API Server',
      healthCheck: '/api/health',
      team: 'PawTech Innovators',
    });
  });
}

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on this server`,
  });
});

app.use((err, req, res, next) => {
  console.error(`[Server Error] ${err.stack || err.message}`);
  const statusCode = err.statusCode || res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 PetCare Planner Server listening on port ${PORT}`);
    console.log(`📡 Health Check URL: http://localhost:${PORT}/api/health`);
    console.log(`👨‍💻 Integration: Godishala Kruthik Roshan (Roll: 2303A52339)`);
    console.log(`====================================================`);
  });
}

module.exports = app;

