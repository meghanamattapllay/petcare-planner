import apiClient from './apiClient';

export const petService = {

  getAllPets: () => apiClient.get('/pets'),

  getPetById: (id) => apiClient.get(`/pets/${id}`),

  createPet: (petData) => apiClient.post('/pets', petData),

  updatePet: (id, petData) => apiClient.put(`/pets/${id}`, petData),

  deletePet: (id) => apiClient.delete(`/pets/${id}`),
};

export default petService;

