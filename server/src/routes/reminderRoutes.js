const express = require('express');
const router = express.Router();
const { getReminders } = require('../controllers/reminderController');

/**
 * Reminder & Timeline Routes
 * Assigned: MATAPALLY MEGHANA (Reminders & Timeline)
 * Integrated by: Godishala Kruthik Roshan
 */

router.get('/', getReminders);

module.exports = router;

