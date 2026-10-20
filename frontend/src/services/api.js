import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const getHealth = () => api.get('/health').then(res => res.data);

export const getProjects = () => api.get('/projects').then(res => res.data);
export const createProject = (data) => api.post('/projects', data).then(res => res.data);

export const analyzeCode = (data) => api.post('/analyze', data).then(res => res.data);
export const getAnalyses = () => api.get('/analyses').then(res => res.data);
export const getAnalysis = (id) => api.get(`/analyses/${id}`).then(res => res.data);

export const reviewCode = (data) => api.post('/reviews', data).then(res => res.data);
export const getReviews = () => api.get('/reviews').then(res => res.data);
export const getReview = (id) => api.get(`/reviews/${id}`).then(res => res.data);
export const addReviewComment = (reviewId, content) => api.post(`/reviews/${reviewId}/comments`, { content }).then(res => res.data);
export const updateReviewCommentStatus = (reviewId, commentId, status) => api.patch(`/reviews/${reviewId}/comments/${commentId}`, { status }).then(res => res.data);
export const updateReviewStatus = (reviewId, status) => api.patch(`/reviews/${reviewId}/status`, { status }).then(res => res.data);

export const getAnalytics = () => api.get('/analytics/overview').then(res => res.data);

// Project Intelligence
export const uploadProjectZip = (formData) => api.post('/project-intelligence/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
}).then(res => res.data);

export const analyzeFullProject = (data) => api.post('/project-intelligence/analyze', data).then(res => res.data);
export const getProjectAnalyses = () => api.get('/project-intelligence').then(res => res.data);
