/**
 * Axios HTTP Client Configuration
 * Centralized API request/response handling
 */

import axios from 'axios';
import { API_CONFIG, API_BASE } from '../config/api';
import { getAuthToken, removeAuthToken, isAuthenticated } from '../utils/storage';

// Create axios instance with default config
const httpClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
});

// ========== REQUEST INTERCEPTOR ==========
httpClient.interceptors.request.use(
  (config) => {
    // Add auth token to every request if available
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add tenant slug if available
    const tenantSlug = localStorage.getItem('tenantSlug') || 'test-tenant';
    config.headers['X-Tenant-Slug'] = tenantSlug;

    // Log request in debug mode
    if (import.meta.env.VITE_ENABLE_DEBUG) {
      console.log(`[API] ${config.method.toUpperCase()} ${config.url}`, config.data);
    }

    return config;
  },
  (error) => {
    console.error('[API] Request error:', error);
    return Promise.reject(error);
  }
);

// ========== RESPONSE INTERCEPTOR ==========
httpClient.interceptors.response.use(
  (response) => {
    // Log successful response in debug mode
    if (import.meta.env.VITE_ENABLE_DEBUG) {
      console.log(`[API] ${response.status} ${response.config.url}`, response.data);
    }

    return response;
  },
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      const { status, data } = error.response;

      // Handle 401 Unauthorized - Token expired or invalid
      if (status === 401) {
        console.error('[API] Unauthorized - Token invalid or expired');
        removeAuthToken();
        
        // Redirect to login if not already there
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }

      // Handle 403 Forbidden
      if (status === 403) {
        console.error('[API] Forbidden - Access denied');
      }

      // Handle 404 Not Found
      if (status === 404) {
        console.error('[API] Not Found', data.message || 'Resource not found');
      }

      // Handle 500 Server Error
      if (status >= 500) {
        console.error('[API] Server Error', data.message || 'Internal server error');
      }

      // Log detailed error
      if (import.meta.env.VITE_ENABLE_DEBUG) {
        console.error(`[API] Error ${status}:`, {
          url: error.config.url,
          data: error.config.data,
          response: data,
        });
      }
    } else if (error.request) {
      // Request made but no response
      console.error('[API] No response from server:', error.request);
    } else {
      // Error in request setup
      console.error('[API] Error setting up request:', error.message);
    }

    return Promise.reject(error);
  }
);

/**
 * Utility function for making API calls
 * @param {string} method - HTTP method (get, post, put, delete, patch)
 * @param {string} url - API endpoint URL
 * @param {object} data - Request data (for POST, PUT, PATCH)
 * @param {object} config - Additional axios config
 */
export const apiCall = async (method, url, data = null, config = {}) => {
  try {
    const response = await httpClient({
      method,
      url,
      data,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw {
      message: error.response?.data?.message || error.message,
      status: error.response?.status,
      data: error.response?.data,
      originalError: error,
    };
  }
};

/**
 * GET request
 */
export const get = (url, config = {}) => apiCall('get', url, null, config);

/**
 * POST request
 */
export const post = (url, data, config = {}) => apiCall('post', url, data, config);

/**
 * PUT request
 */
export const put = (url, data, config = {}) => apiCall('put', url, data, config);

/**
 * PATCH request
 */
export const patch = (url, data, config = {}) => apiCall('patch', url, data, config);

/**
 * DELETE request
 */
export const remove = (url, config = {}) => apiCall('delete', url, null, config);

/**
 * Upload file (multipart/form-data)
 */
export const uploadFile = (url, formData, config = {}) => {
  return apiCall('post', url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...config,
  });
};

/**
 * Batch requests
 */
export const batch = (requests) => {
  return Promise.all(requests);
};

export default httpClient;
