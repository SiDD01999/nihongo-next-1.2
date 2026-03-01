import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: `${API_BASE}/api`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30 second timeout for Render cold starts
});

// Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('nn_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Retry logic for failed requests (handles Render free-tier cold starts)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    // Only retry GET requests, max 2 retries
    if (
      config &&
      config.method === 'get' &&
      (!config._retryCount || config._retryCount < 2) &&
      (!error.response || error.response.status >= 500)
    ) {
      config._retryCount = (config._retryCount || 0) + 1;
      // Wait before retry: 3s first, 5s second
      await new Promise((r) => setTimeout(r, config._retryCount === 1 ? 3000 : 5000));
      return api(config);
    }
    return Promise.reject(error);
  }
);

// Posts
export const getPosts = (params) => api.get('/posts', { params });
export const getPost = (slug) => api.get(`/posts/${slug}`);
export const createPost = (data) => api.post('/posts', data);
export const updatePost = (slug, data) => api.put(`/posts/${slug}`, data);
export const deletePost = (slug) => api.delete(`/posts/${slug}`);

// Comments
export const addComment = (slug, data) => api.post(`/posts/${slug}/comments`, data);
export const likeComment = (slug, commentId) => api.post(`/posts/${slug}/comments/${commentId}/like`);

// Auth
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const googleLogin = (credential) => api.post('/auth/google', { credential });

// Upload
export const uploadImage = (file) => {
  const formData = new FormData();
  formData.append('image', file);
  return api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export default api;
