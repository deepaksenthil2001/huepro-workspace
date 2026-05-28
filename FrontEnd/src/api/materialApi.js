import axios from 'axios';
const API_URL = 'http://localhost:8082/api/materials';
export const getMaterials = () => axios.get(API_URL);
export const createMaterial = (data) => axios.post(API_URL, data);
export const updateMaterial = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteMaterial = (id) => axios.delete(`${API_URL}/${id}`);