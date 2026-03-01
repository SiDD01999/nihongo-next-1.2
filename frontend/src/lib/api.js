import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nn_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Posts
export const getPosts = (params) => api.get('/posts', { params });
export const getPost = (slug) => api.get(`/posts/${slug}`);
export const addComment = (slug, data) => api.post(`/posts/${slug}/comments`, data);
export const likeComment = (slug, commentId) => api.post(`/posts/${slug}/comments/${commentId}/like`);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);

export default api;
