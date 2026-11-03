const express = require('express');
const router = express.Router();
const {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
  getPetCareRecords,
  createPetCareRecord,
} = require('../controllers/petController');
const { optionalAuth } = require('../middleware/authMiddleware');

/**
 * Express Router: Pet Profiles CRUD Endpoints
 * Assigned Member: BODASU NITHIN (Backend: Database & APIs)
 * Integrated by: Godishala Kruthik Roshan
 */

router.use(optionalAuth);

router.route('/')
  .get(getPets)
  .post(createPet);

// Sub-routes for pet care records
router.get('/:id/care-records', getPetCareRecords);
router.post('/:id/care-records', createPetCareRecord);

router.route('/:id')
  .get(getPetById)
  .put(updatePet)
  .patch(updatePet)
  .delete(deletePet);

module.exports = router;
