import axios from 'axios';

const API_URL = 'http://localhost:8082/api/workers'; 

export const getWorkers = () => axios.get(API_URL);
export const createWorker = (data) => axios.post(API_URL, data);
export const updateWorker = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteWorker = (id) => axios.delete(`${API_URL}/${id}`);