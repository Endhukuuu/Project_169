import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Request interceptor: attach Authorization header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('udih_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Response interceptor: handle 401 unauthorized
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If unauthorized and not already on login page, clear token
      if (!window.location.pathname.includes('/login') && !window.location.pathname.includes('/register')) {
        localStorage.removeItem('udih_token');
        localStorage.removeItem('udih_user');
      }
    }
    return Promise.reject(error);
  }
);

// --- Health & Presence ---
export const getHealth = () => api.get('/health').then(res => res.data);
export const ping = () => api.get('/auth/ping').then(res => res.data);

// --- Authentication ---
export const login = (data) => api.post('/auth/login', data).then(res => res.data);
export const register = (data) => api.post('/auth/register', data).then(res => res.data);
export const getMe = () => api.get('/auth/me').then(res => res.data);
export const forgotPassword = (data) => api.post('/auth/forgot-password', data).then(res => res.data);
export const resetPassword = (data) => api.post('/auth/reset-password', data).then(res => res.data);
export const logout = () => api.post('/auth/logout').then(res => res.data);

// --- Projects ---
export const getProjects = () => api.get('/projects').then(res => res.data);
export const getProject = (id) => api.get(`/projects/${id}`).then(res => res.data);
export const getProjectDetails = (id) => api.get(`/projects/${id}/details`).then(res => res.data);
export const createProject = (data) => api.post('/projects', data).then(res => res.data);

// --- Code Analyzer ---
export const analyzeCode = (data) => api.post('/analyze', data).then(res => res.data);
export const getAnalyses = () => api.get('/analyses').then(res => res.data);
export const getAnalysis = (id) => api.get(`/analyses/${id}`).then(res => res.data);

// --- Code Reviews ---
export const reviewCode = (data) => api.post('/reviews', data).then(res => res.data);
export const getReviews = () => api.get('/reviews').then(res => res.data);
export const getReview = (id) => api.get(`/reviews/${id}`).then(res => res.data);
export const addReviewComment = (reviewId, content) => api.post(`/reviews/${reviewId}/comments`, { content }).then(res => res.data);
export const updateReviewCommentStatus = (reviewId, commentId, status) => api.patch(`/reviews/${reviewId}/comments/${commentId}`, { status }).then(res => res.data);
export const updateReviewStatus = (reviewId, status) => api.patch(`/reviews/${reviewId}/status`, { status }).then(res => res.data);

// --- Project Intelligence ---
export const uploadProjectZip = (formData) => api.post('/project-intelligence/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
}).then(res => res.data);
export const analyzeFullProject = (data) => api.post('/project-intelligence/analyze', data).then(res => res.data);
export const getProjectAnalyses = () => api.get('/project-intelligence').then(res => res.data);
export const getProjectAnalysis = (id) => api.get(`/project-intelligence/${id}`).then(res => res.data);

// --- Analytics ---
export const getAnalytics = () => api.get('/analytics/overview').then(res => res.data);

// --- Activity & Notifications ---
export const getUserActivity = () => api.get('/activity').then(res => res.data);
export const getNotifications = () => api.get('/notifications').then(res => res.data);
export const markNotificationRead = (id) => api.patch(`/notifications/${id}/read`).then(res => res.data);
export const markAllNotificationsRead = () => api.post('/notifications/read-all').then(res => res.data);

// --- Admin Management ---
export const getAdminStats = () => api.get('/admin/stats').then(res => res.data);
export const getAdminUsers = (params) => api.get('/admin/users', { params }).then(res => res.data);
export const getAdminUser = (id) => api.get(`/admin/users/${id}`).then(res => res.data);
export const updateUserStatus = (id, status) => api.patch(`/admin/users/${id}/status`, { status }).then(res => res.data);
export const updateUserRole = (id, role) => api.patch(`/admin/users/${id}/role`, { role }).then(res => res.data);
export const getAdminActivity = (params) => api.get('/admin/activity', { params }).then(res => res.data);

export default api;
