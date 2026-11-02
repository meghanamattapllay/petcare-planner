import axios from 'axios';

/**
 * PetCare Planner - Centralized API Client
 * Integration: Godishala Kruthik Roshan (Roll: 2303A52339)
 * Purpose: Coordinates communication between React Frontend and Express Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('petcare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[API Client Request Error]', error);
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Unauthorized and Network Errors
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errorDetails = {
      message: error.response?.data?.message || error.message || 'API Request Failed',
      status: error.response?.status,
      timestamp: new Date().toISOString(),
    };

    if (error.response?.status === 401) {
      console.warn('[API Client] Unauthorized request. Token may be expired.');
      // Optional: clear token if needed
      // localStorage.removeItem('petcare_token');
    }

    return Promise.reject(errorDetails);
  }
);

/**
 * Check backend connection status and health metadata
 */
export const checkApiHealth = async () => {
  try {
    const data = await apiClient.get('/health');
    return { success: true, data };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Backend server is currently offline or unreachable',
    };
  }
};

export default apiClient;

