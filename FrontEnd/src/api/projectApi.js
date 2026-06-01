import axios from 'axios';

const API_URL = 'https://huepro-workspace.onrender.com/api/projects';

export const getProjects = (contractorId) => {
    return axios.get(`${API_URL}/contractor/${contractorId}`);
};

export const createProject = (projectData) => {
    return axios.post(API_URL, projectData);
};

export const updateProject = (id, projectData) => {
    return axios.put(`${API_URL}/${id}`, projectData);
};

export const deleteProject = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};