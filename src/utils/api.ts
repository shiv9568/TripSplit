import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const tripApi = {
  getAll: () => api.get('/trips'),
  getById: (id: string) => api.get(`/trips/${id}`),
  create: (data: any) => api.post('/trips', data),
  update: (id: string, data: any) => api.put(`/trips/${id}`, data),
  delete: (id: string) => api.delete(`/trips/${id}`),
  join: (code: string, name: string, email?: string) => api.post('/trips/join', { code, name, email }),
  getByInviteCode: (code: string) => api.get(`/trips/invite/${code}`),
};

export const expenseApi = {
  getAll: (tripId: string) => api.get(`/expenses/trip/${tripId}`),
  create: (data: any) => api.post('/expenses', data),
  update: (id: string, data: any) => api.put(`/expenses/${id}`, data),
  delete: (id: string) => api.delete(`/expenses/${id}`),
  getSummary: (tripId: string) => api.get(`/expenses/summary/${tripId}`),
  parseWhatsApp: (text: string, tripId: string, defaultPayer?: string) => 
    api.post('/expenses/parse-whatsapp', { text, tripId, defaultPayer }),
  bulkCreate: (tripId: string, expenses: any[]) => 
    api.post('/expenses/bulk', { tripId, expenses }),
};

export const utilityApi = {
  getQR: (upiId: string, amount: number, name: string) => 
    api.get(`/utilities/qr/${upiId}/${amount}/${name}`),
  getPDF: (tripId: string) => 
    api.get(`/utilities/pdf/${tripId}`, { responseType: 'blob' }),
};

export default api;
