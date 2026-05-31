/**
 * Centralized API Configuration
 * Reads from environment variables or uses fallback values
 * To update the API endpoint, set VITE_API_URL in your .env.local file
 */

// Get API base URL from environment or use fallback
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://apperal-clothing-app-production.up.railway.app";

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  RESET_PASSWORD: `${API_BASE_URL}/api/auth/reset-password`,
  FORGOT_PASSWORD: `${API_BASE_URL}/api/auth/forgot-password`,
  VERIFY_EMAIL: `${API_BASE_URL}/api/auth/verify-email`,
  LOGOUT: `${API_BASE_URL}/api/auth/logout`,
  
  // User endpoints
  GET_PROFILE: `${API_BASE_URL}/api/user/profile`,
  UPDATE_PROFILE: `${API_BASE_URL}/api/user/profile`,
  GET_USER: `${API_BASE_URL}/api/user`,
  
  // Design endpoints
  GET_DESIGNS: `${API_BASE_URL}/api/designs`,
  SAVE_DESIGN: `${API_BASE_URL}/api/designs`,
  GET_DESIGN: `${API_BASE_URL}/api/designs/:id`,
  UPDATE_DESIGN: `${API_BASE_URL}/api/designs/:id`,
  DELETE_DESIGN: `${API_BASE_URL}/api/designs/:id`,
  
  // Order endpoints
  GET_ORDERS: `${API_BASE_URL}/api/orders`,
  CREATE_ORDER: `${API_BASE_URL}/api/orders`,
  GET_ORDER: `${API_BASE_URL}/api/orders/:id`,
  UPDATE_ORDER: `${API_BASE_URL}/api/orders/:id`,
  
  // Fabric endpoints
  GET_FABRICS: `${API_BASE_URL}/api/fabrics`,
  GET_FABRIC: `${API_BASE_URL}/api/fabrics/:id`,
};

// API Configuration
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT || 30000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Tenant Configuration (for multi-tenant support)
export const TENANT_SLUG = localStorage.getItem('tenantSlug') || import.meta.env.VITE_TENANT_SLUG || 'test-tenant';

export const API_BASE = API_BASE_URL;

export default API_BASE_URL;
