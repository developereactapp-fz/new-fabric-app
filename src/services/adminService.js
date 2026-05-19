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

  // ── Groups (Fabric Sets) ──
  getGroups: () => apiClient.get('/api/groups'),
  createGroup: (data) => apiClient.post('/api/groups', data),
  getGroup: (id) => apiClient.get(`/api/groups/${id}`),
  updateGroup: (id, data) => apiClient.patch(`/api/groups/${id}`, data),
  deleteGroup: (id) => apiClient.delete(`/api/groups/${id}`),
  toggleGroup: (id, isActive) => apiClient.patch(`/api/groups/${id}`, { isActive }),
  updateGroupItems: (id, fabricIds) => apiClient.put(`/api/groups/${id}/items`, { fabricIds }),
  validateGroupAssets: (id) => apiClient.get(`/api/groups/${id}/validate-assets`),

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

  // ── Catalog (Garment Components) ──
  getCatalogCategories: () => apiClient.get('/api/catalog/categories'),
  createCatalogCategory: (data) => apiClient.post('/api/catalog/categories', data),
  getCatalogCategory: (id) => apiClient.get(`/api/catalog/categories/${id}`),
  updateCatalogCategory: (id, data) => apiClient.patch(`/api/catalog/categories/${id}`, data),
  deleteCatalogCategory: (id) => apiClient.delete(`/api/catalog/categories/${id}`),

  getProducts: (params) => apiClient.get('/api/catalog/products', { params }),
  createProduct: (data) => apiClient.post('/api/catalog/products', data),
  getProduct: (id) => apiClient.get(`/api/catalog/products/${id}`),
  updateProduct: (id, data) => apiClient.patch(`/api/catalog/products/${id}`, data),
  deleteProduct: (id) => apiClient.delete(`/api/catalog/products/${id}`),
  getProductTree: (productId) => apiClient.get(`/api/catalog/products/${productId}/tree`),

  getParts: (params) => apiClient.get('/api/catalog/parts', { params }),
  getProductParts: (productId) => apiClient.get(`/api/catalog/products/${productId}/parts`),
  createProductPart: (productId, data) => apiClient.post(`/api/catalog/products/${productId}/parts`, data),
  createPart: (data) => apiClient.post('/api/catalog/parts', data),
  getPart: (id) => apiClient.get(`/api/catalog/parts/${id}`),
  updatePart: (id, data) => apiClient.patch(`/api/catalog/parts/${id}`, data),
  deletePart: (id) => apiClient.delete(`/api/catalog/parts/${id}`),

  getPartTypes: (partId) => apiClient.get(`/api/catalog/parts/${partId}/types`),
  createPartType: (partId, data) => apiClient.post(`/api/catalog/parts/${partId}/types`, data),
  updatePartType: (id, data) => apiClient.patch(`/api/catalog/part-types/${id}`, data),
  deletePartType: (id) => apiClient.delete(`/api/catalog/part-types/${id}`),

  getPartOptions: (partTypeId) => apiClient.get(`/api/catalog/part-types/${partTypeId}/options`),
  createPartOption: (partTypeId, data) => apiClient.post(`/api/catalog/part-types/${partTypeId}/options`, data),
  updatePartOption: (id, data) => apiClient.patch(`/api/catalog/part-options/${id}`, data),
  deletePartOption: (id) => apiClient.delete(`/api/catalog/part-options/${id}`),

  // ── Tenants ──
  getTenants: () => apiClient.get('/api/admin/tenants'),
  createTenant: (data) => apiClient.post('/api/admin/tenants', data),
  getTenant: (id) => apiClient.get(`/api/admin/tenants/${id}`),

  // ── Sub-Categories ──
  getSubCategories: (partId) => apiClient.get(`/api/catalog/parts/${partId}/sub-categories`),
  createSubCategory: (partId, data) => apiClient.post(`/api/catalog/parts/${partId}/sub-categories`, data),
  getSubCategory: (id) => apiClient.get(`/api/catalog/sub-categories/${id}`),
  updateSubCategory: (id, data) => apiClient.patch(`/api/catalog/sub-categories/${id}`, data),
  deleteSubCategory: (id) => apiClient.delete(`/api/catalog/sub-categories/${id}`),

  // ── Sub-Category Values ──
  getSubCategoryValues: (subCategoryId, params) => apiClient.get(`/api/catalog/sub-categories/${subCategoryId}/values`, { params }),
  createSubCategoryValue: (subCategoryId, data) => apiClient.post(`/api/catalog/sub-categories/${subCategoryId}/values`, data),
  getSubCategoryValue: (id) => apiClient.get(`/api/catalog/sub-category-values/${id}`),
  updateSubCategoryValue: (id, data) => apiClient.patch(`/api/catalog/sub-category-values/${id}`, data),
  deleteSubCategoryValue: (id) => apiClient.delete(`/api/catalog/sub-category-values/${id}`),
};

