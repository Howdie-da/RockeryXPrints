// src/services/api.js
// Axios instance wired to the backend API
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Auth ──────────────────────────────────────────────────────────────────
export const registerUser   = (data) => api.post('/users/register', data);
export const loginUser      = (data) => api.post('/users/login', data);
export const logoutUser     = ()     => api.get('/users/logout');
export const getCurrentUser = ()     => api.get('/users/current-user');
export const updateDetails  = (data) => api.post('/users/update-details', data);
export const changePassword = (data) => api.post('/users/change-password', data);
export const updateAvatarAPI = (data) => api.post('/users/update-avatar', data, { headers: { 'Content-Type': 'multipart/form-data' } });

// ─── Cart ──────────────────────────────────────────────────────────────────
export const getUserCart    = ()     => api.get('/users/cart');
export const addToCartAPI   = (data) => api.post('/users/add-cart', data);
export const removeFromCartAPI = (productId) =>
  api.delete(`/users/remove-cart/${productId}`);

// ─── Products ──────────────────────────────────────────────────────────────
export const getCategories    = (isAdmin = false) => isAdmin ? api.get('/prods/admin/categories') : api.get('/prods/categories');
export const getProducts      = (params) => api.get('/prods/products', { params });
export const getProductBySlug = (slug)   => api.get(`/prods/products/${slug}`);
export const addCategoryAPI   = (data)   => api.post('/prods/add-category', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteCategoryAPI = (categoryId) => api.delete(`/prods/delete-category/${categoryId}`);
export const addProductAPI    = (data)   => api.post('/prods/add-product', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProductAPI = (productId, data) => api.post(`/prods/update-product/${productId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProductAPI = (productId) => api.delete(`/prods/delete-product/${productId}`);

// ─── Orders ────────────────────────────────────────────────────────────────
export const createOrder = (data) => api.post('/orders/create', data);
export const getOrders   = ()     => api.get('/orders/get-orders');
export const getAllOrdersAPI = () => api.get('/orders/get-all-orders');
export const updateOrderStatusAPI = (orderId, data) => api.patch(`/orders/update-status/${orderId}`, data);

export default api;

