import apiClient from './apiClient';

/**
 * Care Record Service
 * Backend: BODASU NITHIN (Roll: 2303A51803)
 * Timeline: MATAPALLY MEGHANA (Roll: 2303A52505)
 * Integrated by Lead: Godishala Kruthik Roshan
 */

export const recordService = {
  // Get all records with optional query parameters
  getRecords: (params = {}) => apiClient.get('/records', { params }),

  // Create new care record
  createRecord: (recordData) => apiClient.post('/records', recordData),

  // Delete record
  deleteRecord: (id) => apiClient.delete(`/records/${id}`),
};

export default recordService;
