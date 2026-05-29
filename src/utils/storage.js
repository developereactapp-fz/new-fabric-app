/**
 * Local Storage Utility Functions
 * Helps manage user data, preferences, and session storage
 */

const STORAGE_PREFIX = import.meta.env.VITE_STORAGE_PREFIX || 'fabric_app_';

/**
 * Set item in localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (auto-serializes objects)
 */
export const setStorageItem = (key, value) => {
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(`${STORAGE_PREFIX}${key}`, serialized);
  } catch (error) {
    console.error(`Error storing item ${key}:`, error);
  }
};

/**
 * Get item from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if not found
 */
export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    if (!item) return defaultValue;
    
    try {
      return JSON.parse(item);
    } catch {
      return item;
    }
  } catch (error) {
    console.error(`Error retrieving item ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch (error) {
    console.error(`Error removing item ${key}:`, error);
  }
};

/**
 * Clear all app-related items from localStorage
 */
export const clearAppStorage = () => {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing app storage:', error);
  }
};

// ========== User Data Management ==========

/**
 * Save user profile data
 */
export const saveUserProfile = (userData) => {
  setStorageItem('user_profile', userData);
  setStorageItem('userName', userData.name || userData.firstName);
  setStorageItem('userEmail', userData.email);
};

/**
 * Get user profile data
 */
export const getUserProfile = () => {
  return getStorageItem('user_profile', null);
};

/**
 * Get user name
 */
export const getUserName = () => {
  return getStorageItem('userName', 'Guest');
};

/**
 * Save authentication token
 */
export const saveAuthToken = (token) => {
  setStorageItem('auth_token', token);
};

/**
 * Get authentication token
 */
export const getAuthToken = () => {
  return getStorageItem('auth_token', null);
};

/**
 * Remove authentication token (logout)
 */
export const removeAuthToken = () => {
  removeStorageItem('auth_token');
  removeStorageItem('user_profile');
  removeStorageItem('userName');
  removeStorageItem('userEmail');
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// ========== Design Data Management ==========

/**
 * Save design
 */
export const saveDesign = (designData) => {
  const designs = getStorageItem('saved_designs', []);
  const newDesign = {
    id: Date.now().toString(),
    ...designData,
    savedAt: new Date().toISOString(),
  };
  designs.push(newDesign);
  setStorageItem('saved_designs', designs);
  return newDesign;
};

/**
 * Get all saved designs
 */
export const getSavedDesigns = () => {
  return getStorageItem('saved_designs', []);
};

/**
 * Get design by ID
 */
export const getDesignById = (designId) => {
  const designs = getSavedDesigns();
  return designs.find(d => d.id === designId);
};

/**
 * Delete design
 */
export const deleteDesign = (designId) => {
  const designs = getSavedDesigns();
  const filtered = designs.filter(d => d.id !== designId);
  setStorageItem('saved_designs', filtered);
};

/**
 * Update design
 */
export const updateDesign = (designId, updates) => {
  const designs = getSavedDesigns();
  const design = designs.find(d => d.id === designId);
  if (design) {
    Object.assign(design, updates);
    setStorageItem('saved_designs', designs);
  }
  return design;
};

// ========== Preference Management ==========

/**
 * Save user preferences
 */
export const savePreferences = (preferences) => {
  setStorageItem('user_preferences', preferences);
};

/**
 * Get user preferences
 */
export const getPreferences = () => {
  return getStorageItem('user_preferences', {
    theme: 'light',
    language: 'en',
    currency: 'INR',
    notifications: true,
  });
};

/**
 * Update specific preference
 */
export const updatePreference = (key, value) => {
  const preferences = getPreferences();
  preferences[key] = value;
  savePreferences(preferences);
};

// ========== Session Management ==========

/**
 * Save session data
 */
export const saveSessionData = (key, data) => {
  setStorageItem(`session_${key}`, data);
};

/**
 * Get session data
 */
export const getSessionData = (key, defaultValue = null) => {
  return getStorageItem(`session_${key}`, defaultValue);
};

/**
 * Clear session data
 */
export const clearSessionData = () => {
  const keys = Object.keys(localStorage);
  keys.forEach(key => {
    if (key.includes('session_')) {
      localStorage.removeItem(key);
    }
  });
};

export default {
  setStorageItem,
  getStorageItem,
  removeStorageItem,
  clearAppStorage,
  saveUserProfile,
  getUserProfile,
  getUserName,
  saveAuthToken,
  getAuthToken,
  removeAuthToken,
  isAuthenticated,
  saveDesign,
  getSavedDesigns,
  getDesignById,
  deleteDesign,
  updateDesign,
  savePreferences,
  getPreferences,
  updatePreference,
  saveSessionData,
  getSessionData,
  clearSessionData,
};
