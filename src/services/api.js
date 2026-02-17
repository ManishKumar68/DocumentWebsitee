import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with auth header
const api = axios.create({
    baseURL: API_URL
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle 401 errors (token expired)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

// User APIs
export const getUserData = async () => {
    const response = await api.get('/user/data');
    return response.data;
};

export const updateUserPreferences = async (data) => {
    const response = await api.put('/user/preferences', data);
    return response.data;
};

// Project APIs
export const getProjects = async () => {
    const response = await api.get('/projects');
    return response.data;
};

export const createProject = async (projectData) => {
    const response = await api.post('/projects', projectData);
    return response.data;
};

export const getProject = async (projectId) => {
    const response = await api.get(`/projects/${projectId}`);
    return response.data;
};

export const updateProject = async (projectId, projectData) => {
    const response = await api.put(`/projects/${projectId}`, projectData);
    return response.data;
};

export const deleteProject = async (projectId) => {
    const response = await api.delete(`/projects/${projectId}`);
    return response.data;
};

export const selectProject = async (projectId) => {
    const response = await api.put(`/projects/${projectId}/select`);
    return response.data;
};

export default api;
