import axios from 'axios';
import axiosRetry from 'axios-retry';

// Get base URL from environment or fallback
const baseURL = import.meta.env.VITE_API_URL || 'https://apperal-clothing-app-production.up.railway.app';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosRetry(apiClient, { 
  retries: 3, 
  retryDelay: axiosRetry.exponentialDelay,
  retryCondition: (error) => {
    // Retry on network errors or 5xx status codes
    return axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status >= 500;
  }
});

// Request interceptor to attach JWT + tenant slug
apiClient.interceptors.request.use(
  (config) => {
    // Token priority: localStorage > env variable
    const token = localStorage.getItem('token') || import.meta.env.VITE_AUTH_TOKEN;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Always send tenant slug
    if (!config.headers['x-tenant-slug']) {
      config.headers['x-tenant-slug'] = 'test-tenant';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      console.warn('Unauthorized — token may be expired.');
    }
    console.error('API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default apiClient;
