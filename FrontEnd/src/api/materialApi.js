import axios from 'axios';

const API_URL = 'https://huepro-workspace.onrender.com/api/materials';

export const getMaterials = (contractorId) => {
    return axios.get(`${API_URL}/contractor/${contractorId}`);
};

export const addMaterial = (materialData) => {
    return axios.post(API_URL, materialData);
};

export const updateMaterial = (id, materialData) => {
    return axios.put(`${API_URL}/${id}`, materialData);
};

export const deleteMaterial = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};