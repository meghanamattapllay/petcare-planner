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

router.use(optionalAuth);

router.route('/')
  .get(getPets)
  .post(createPet);

router.get('/:id/care-records', getPetCareRecords);
router.post('/:id/care-records', createPetCareRecord);

router.route('/:id')
  .get(getPetById)
  .put(updatePet)
  .patch(updatePet)
  .delete(deletePet);

module.exports = router;

