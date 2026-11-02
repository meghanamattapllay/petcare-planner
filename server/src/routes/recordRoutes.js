const express = require('express');
const router = express.Router();
const {
  getUpcomingCareRecords,
  getRecords,
  createRecord,
  updateRecord,
  deleteRecord,
} = require('../controllers/recordController');

/**
 * Care Record Routes
 * Assigned: BODASU NITHIN & MATAPALLY MEGHANA
 * Integrated by: Godishala Kruthik Roshan
 */

router.get('/upcoming', getUpcomingCareRecords);
router.get('/', getRecords);
router.post('/', createRecord);
router.put('/:id', updateRecord);
router.patch('/:id', updateRecord);
router.delete('/:id', deleteRecord);

module.exports = router;
