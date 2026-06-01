import axios from 'axios';

const API_URL = 'https://huepro-workspace.onrender.com/api/auth';

export const registerContractor = (userData) => {
    return axios.post(`${API_URL}/register`, userData);
};

export const loginContractor = (loginData) => {
    return axios.post(`${API_URL}/login`, loginData);
};

export const updateContractor = (id, userData) => {
    return axios.put(`${API_URL}/update/${id}`, userData);
};