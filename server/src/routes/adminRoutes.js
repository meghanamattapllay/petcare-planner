const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllUsers,
  updateUserRole,
  getAllPetsAdmin,
  deletePetAdmin,
  getCareCategories,
  addCareCategory,
} = require('../controllers/adminController');

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:id/role', updateUserRole);
router.get('/pets', getAllPetsAdmin);
router.delete('/pets/:id', deletePetAdmin);
router.get('/care-categories', getCareCategories);
router.post('/care-categories', addCareCategory);

module.exports = router;

