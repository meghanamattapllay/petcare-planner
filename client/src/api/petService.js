import apiClient from './apiClient';

/**
 * Pet Profiles API Service
 * Frontend Component: SIDDARTHA RAJ (Roll: 2303A51917)
 * Backend CRUD: BODASU NITHIN (Roll: 2303A51803)
 * Integrated by: Godishala Kruthik Roshan
 */

export const petService = {
  // Fetch all pets
  getAllPets: () => apiClient.get('/pets'),

  // Fetch pet by ID
  getPetById: (id) => apiClient.get(`/pets/${id}`),

  // Create new pet profile
  createPet: (petData) => apiClient.post('/pets', petData),

  // Update existing pet profile
  updatePet: (id, petData) => apiClient.put(`/pets/${id}`, petData),

  // Delete pet profile
  deletePet: (id) => apiClient.delete(`/pets/${id}`),
};

export default petService;

