const mongoose = require('mongoose');

/**
 * Connect to MongoDB instance with graceful error handling
 * Designed for PetCare Planner by PawTech Innovators
 */
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/petcare_planner';
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[MongoDB] Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[MongoDB Warning] Could not connect to MongoDB at ${process.env.MONGODB_URI || 'default URI'}.`);
    console.warn(`[MongoDB Details] Reason: ${error.message}`);
    console.warn(`[MongoDB Note] The server will continue running. Ensure MongoDB service is running for database persistence.`);
    return false;
  }
};

const getDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

module.exports = { connectDB, getDBStatus };

