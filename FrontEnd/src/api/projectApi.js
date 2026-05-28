import axios from 'axios';

const API_URL = 'http://localhost:8081/api/projects';

// Exporting both names so it perfectly matches with both App.jsx and Projects.jsx!
export const getProjects = () => axios.get(API_URL);
export const fetchAllProjectsApi = () => axios.get(API_URL);

export const createProject = (data) => axios.post(API_URL, data);
export const createProjectApi = (data) => axios.post(API_URL, data);

export const updateProject = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const updateProjectApi = (id, data) => axios.put(`${API_URL}/${id}`, data);

export const deleteProject = (id) => axios.delete(`${API_URL}/${id}`);
export const deleteProjectApi = (id) => axios.delete(`${API_URL}/${id}`);