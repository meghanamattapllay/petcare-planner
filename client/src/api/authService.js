import apiClient from './apiClient';

export const authService = {

  register: (userData) => apiClient.post('/auth/register', userData),

  login: (credentials) => apiClient.post('/auth/login', credentials),

  getProfile: () => apiClient.get('/auth/me'),
};

export default authService;

