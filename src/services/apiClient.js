import axios from 'axios';

// Get base URL from environment or fallback
const baseURL = import.meta.env.VITE_API_URL || 'https://apperal-clothing-app-production.up.railway.app';

const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
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
