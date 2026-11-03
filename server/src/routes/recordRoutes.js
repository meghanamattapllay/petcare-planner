const express = require('express');
const router = express.Router();
const {
  getUpcomingCareRecords,
  getRecords,
  getRecordById,
  createRecord,
  updateRecord,
  deleteRecord,
} = require('../controllers/recordController');
const { optionalAuth } = require('../middleware/authMiddleware');

/**
 * Express Router: Care Record CRUD Endpoints
 * Assigned Member: BODASU NITHIN (Backend: Database & APIs)
 * Timeline Integration: MATAPALLY MEGHANA (Reminders & Timeline)
 * Integrated by: Godishala Kruthik Roshan
 */

router.use(optionalAuth);

// IMPORTANT: /upcoming must be mounted BEFORE /:id
router.get('/upcoming', getUpcomingCareRecords);

router.route('/')
  .get(getRecords)
  .post(createRecord);

router.route('/:id')
  .get(getRecordById)
  .put(updateRecord)
  .patch(updateRecord)
  .delete(deleteRecord);

module.exports = router;
