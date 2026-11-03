const express = require('express');
const router = express.Router();
const {
  getPets,
  getPetById,
  createPet,
  updatePet,
  deletePet,
} = require('../controllers/petController');
const { optionalAuth } = require('../middleware/authMiddleware');

/**
 * Express Router: Pet Profiles CRUD Endpoints
 * Assigned Member: BODASU NITHIN (Backend: Database & APIs)
 * Roll Number: 2303A51803 · Branch: CSE
 * Integrated by: Godishala Kruthik Roshan
 */

// Attach user authentication context when Bearer token is provided
router.use(optionalAuth);

// Routes definition
router.route('/')
  .get(getPets)
  .post(createPet);

router.route('/:id')
  .get(getPetById)
  .put(updatePet)
  .delete(deletePet);

module.exports = router;
