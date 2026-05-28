import axios from 'axios';
const API_URL = 'http://localhost:8082/api/invoices';
export const getInvoices = () => axios.get(API_URL);
export const createInvoice = (data) => axios.post(API_URL, data);
export const updateInvoice = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deleteInvoice = (id) => axios.delete(`${API_URL}/${id}`);