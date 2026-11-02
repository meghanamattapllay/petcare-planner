const express = require('express');
const router = express.Router();
const {
  getRecords,
  createRecord,
  deleteRecord,
} = require('../controllers/recordController');

/**
 * Care Record Routes
 * Assigned: BODASU NITHIN & MATAPALLY MEGHANA
 * Integrated by: Godishala Kruthik Roshan
 */

router.get('/', getRecords);
router.post('/', createRecord);
router.delete('/:id', deleteRecord);

module.exports = router;

