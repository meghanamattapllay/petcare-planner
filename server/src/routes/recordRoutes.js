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

router.use(optionalAuth);

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

