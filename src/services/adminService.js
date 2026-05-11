import apiClient from './apiClient';

export const adminService = {
  // ── Categories ──
  getCategories: () => apiClient.get('/api/materials/categories'),
  createCategory: (data) => apiClient.post('/api/materials/categories', data),
  updateCategory: (id, data) => apiClient.patch(`/api/materials/categories/${id}`, data),
  deleteCategory: (id) => apiClient.delete(`/api/materials/categories/${id}`),

  // ── Fabrics ──
  getFabrics: (params) => apiClient.get('/api/materials/fabrics', { params }),
  createFabric: (data) => apiClient.post('/api/materials/fabrics', data),
  createFabricsBulk: (data) => apiClient.post('/api/materials/fabrics/bulk', data),
  getFabric: (id) => apiClient.get(`/api/materials/fabrics/${id}`),
  updateFabric: (id, data) => apiClient.patch(`/api/materials/fabrics/${id}`, data),
  deactivateFabric: (id) => apiClient.patch(`/api/materials/fabrics/${id}/deactivate`),
  deleteFabric: (id) => apiClient.delete(`/api/materials/fabrics/${id}`),

  // ── Fabric Parts (Components) ──
  getFabricParts: () => apiClient.get('/api/fabric-parts'),
  createFabricPart: (data) => apiClient.post('/api/fabric-parts', data),
  getFabricPart: (id) => apiClient.get(`/api/fabric-parts/${id}`),
  updateFabricPart: (id, data) => apiClient.patch(`/api/fabric-parts/${id}`, data),
  deleteFabricPart: (id) => apiClient.delete(`/api/fabric-parts/${id}`),

  // ── Groups ──
  getGroups: () => apiClient.get('/api/groups'),
  createGroup: (data) => apiClient.post('/api/groups', data),
  getGroup: (id) => apiClient.get(`/api/groups/${id}`),
  updateGroup: (id, data) => apiClient.patch(`/api/groups/${id}`, data),
  deleteGroup: (id) => apiClient.delete(`/api/groups/${id}`),
  updateGroupItems: (id, items) => apiClient.put(`/api/groups/${id}/items`, { items }),

  // ── Customization Mappings ──
  getMapping: (fabricId) => apiClient.get(`/api/mapping/${fabricId}`),
  getMappingByPart: (partType) => apiClient.get(`/api/mapping/part/${partType}`),
  createMapping: (data) => apiClient.post('/api/mapping', data),
  updateMapping: (id, data) => apiClient.put(`/api/mapping/${id}`, data),

  // ── Fabric Master (Attributes) ──
  getAttributes: (params) => apiClient.get('/api/attributes', { params }),
  createAttribute: (data) => apiClient.post('/api/attributes', data),
  updateAttribute: (id, data) => apiClient.patch(`/api/attributes/${id}`, data),
  deleteAttribute: (id) => apiClient.delete(`/api/attributes/${id}`),

  // ── Assets ──
  uploadAsset: (formData) => apiClient.post('/api/assets/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getAssets: () => apiClient.get('/api/assets'),
  getAsset: (id) => apiClient.get(`/api/assets/${id}`),
  deleteAsset: (id) => apiClient.delete(`/api/assets/${id}`),

  // ── Admin Settings / General ──
  getSettings: () => apiClient.get('/api/admin/settings'),
  createSetting: (data) => apiClient.post('/api/admin/settings', data),
  updateSetting: (id, data) => apiClient.patch(`/api/admin/settings/${id}`, data),
  deleteSetting: (id) => apiClient.delete(`/api/admin/settings/${id}`),

  // ── Tenants ──
  getTenants: () => apiClient.get('/api/admin/tenants'),
  createTenant: (data) => apiClient.post('/api/admin/tenants', data),
  getTenant: (id) => apiClient.get(`/api/admin/tenants/${id}`),
};
