import axios from 'axios';

const API = axios.create({ 
  baseURL: 'https://astronomy-platform.onrender.com/api'
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const register = (data) => API.post('/auth/register', data);
export const verifyRegistration = (email, code) => API.post('/auth/verify-registration', { email, code });
export const resendCode = (email, type) => API.post('/auth/resend-code', { email, type });
export const login = (data) => API.post('/auth/login', data);
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const resetPassword = (token, password) => API.post('/auth/reset-password', { token, password });

export const getPosts = () => API.get('/posts');
export const getPost = (id) => API.get(`/posts/${id}`);
export const createPost = (data) => API.post('/posts', data);
export const updatePost = (id, data) => API.put(`/posts/${id}`, data);
export const deletePost = (id) => API.delete(`/posts/${id}`);

export const createComment = (data) => API.post('/comments', data);
export const deleteComment = (id) => API.delete(`/comments/${id}`);

export const getNews = () => API.get('/news');
export const getNewsItem = (id) => API.get(`/news/${id}`);
export const createNews = (data) => API.post('/news', data);
export const updateNews = (id, data) => API.put(`/news/${id}`, data);
export const deleteNews = (id) => API.delete(`/news/${id}`);

export const getMaterials = (category) => API.get('/materials', { params: category ? { category } : {} });
export const getMaterial = (id) => API.get(`/materials/${id}`);
export const createMaterial = (data) => API.post('/materials', data);
export const updateMaterial = (id, data) => API.put(`/materials/${id}`, data);
export const deleteMaterial = (id) => API.delete(`/materials/${id}`);

export const getMe = () => API.get('/users/me');
export const updateMe = (data) => API.put('/users/me', data);
export const requestEmailChange = (data) => API.post('/users/me/email/request', data);
export const confirmEmailChange = (code) => API.post('/users/me/email/confirm', { code });
export const changePassword = (data) => API.put('/users/me/password', data);
export const deleteAccount = (password) => API.delete('/users/me', { data: { password } });
export const uploadAvatar = (formData) => API.post('/users/me/avatar', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
export const getPublicProfile = (id) => API.get(`/users/${id}`);
export const getUserCommentCount = (id) => API.get(`/users/${id}/comments/count`);
export const getApod = () => API.get('/apod');
export const getUsers = () => API.get('/users');
export const updateUserRole = (id, role) => API.put(`/users/${id}/role`, { role });
export const updateUserStatus = (id, status) => API.put(`/users/${id}/status`, { status });

export const AVATAR_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';

export default API;
