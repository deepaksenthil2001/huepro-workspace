import axios from 'axios';

const API_URL = 'https://huepro-workspace.onrender.com/api/workers';

export const getWorkers = (contractorId) => {
    return axios.get(`${API_URL}/contractor/${contractorId}`);
};

export const addWorker = (workerData) => {
    return axios.post(API_URL, workerData);
};

// FIX: Added update functionality for existing workers
export const updateWorker = (id, workerData) => {
    return axios.put(`${API_URL}/${id}`, workerData);
};

export const deleteWorker = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};