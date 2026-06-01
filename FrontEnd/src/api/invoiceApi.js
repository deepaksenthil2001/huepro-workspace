import axios from 'axios';

const API_URL = 'https://huepro-workspace.onrender.com/api/invoices';

// Fetching data specifically for the logged-in user
export const getInvoices = (contractorId) => {
    return axios.get(`${API_URL}/contractor/${contractorId}`);
};

export const createInvoice = (invoiceData) => {
    return axios.post(API_URL, invoiceData);
};

export const updateInvoice = (id, invoiceData) => {
    return axios.put(`${API_URL}/${id}`, invoiceData);
};

export const deleteInvoice = (id) => {
    return axios.delete(`${API_URL}/${id}`);
};