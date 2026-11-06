import apiClient from './apiClient';

export const recordService = {

  getRecords: (params = {}) => apiClient.get('/records', { params }),

  createRecord: (recordData) => apiClient.post('/records', recordData),

  deleteRecord: (id) => apiClient.delete(`/records/${id}`),
};

export default recordService;

