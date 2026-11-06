import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

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

    }

    return Promise.reject(errorDetails);
  }
);

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

