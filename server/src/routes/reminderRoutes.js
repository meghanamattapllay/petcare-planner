const express = require('express');
const router = express.Router();
const { getReminders, getPetTimeline } = require('../controllers/reminderController');

/**
 * Reminder & Timeline Routes
 * Assigned: MATAPALLY MEGHANA (Reminders & Timeline)
 * Roll Number: 2303A52505 · Branch: CSE (AIML)
 * Integrated by: Godishala Kruthik Roshan
 */

// Route to get aggregated and categorized reminders
router.get('/', getReminders);

// Route to get timeline for a specific pet
router.get('/pet/:petId', getPetTimeline);

module.exports = router;
