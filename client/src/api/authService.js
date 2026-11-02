import apiClient from './apiClient';

/**
 * Authentication Service
 * Assigned Backend: CHIPPA VASU (Roll: 2303A51618)
 * Integrated by: Godishala Kruthik Roshan
 */

export const authService = {
  // Register a new user
  register: (userData) => apiClient.post('/auth/register', userData),

  // Login existing user
  login: (credentials) => apiClient.post('/auth/login', credentials),

  // Get current user profile
  getProfile: () => apiClient.get('/auth/me'),
};

export default authService;

