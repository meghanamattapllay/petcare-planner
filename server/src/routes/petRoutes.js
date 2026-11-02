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

/**
 * Pet Routes
 * Assigned: BODASU NITHIN (Backend: Database & APIs)
 * Integrated by: Godishala Kruthik Roshan
 */

router.get('/', getPets);
router.get('/:id', getPetById);
router.post('/', createPet);
router.put('/:id', updatePet);
router.patch('/:id', updatePet);
router.delete('/:id', deletePet);

// Sub-routes for pet care records
router.get('/:id/care-records', getPetCareRecords);
router.post('/:id/care-records', createPetCareRecord);

module.exports = router;
