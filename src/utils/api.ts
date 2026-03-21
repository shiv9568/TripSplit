import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://tripsplit-server.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('tripsplit_token');
  const userData = localStorage.getItem('tripsplit_user_data');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  if (userData) {
    try {
      const user = JSON.parse(userData);
      if (user?.name) {
        config.headers['x-user-name'] = user.name;
      }
    } catch (e) {
      // ignore
    }
  }
  
  return config;
});

export const tripApi = {
  getAll: (name: string, email?: string) => 
    api.get(`/trips?name=${encodeURIComponent(name)}${email ? `&email=${encodeURIComponent(email)}` : ''}`),
  getById: (id: string) => api.get(`/trips/${id}`),
  getTripByInviteCode: (code: string) => api.get(`/trips/invite/${code}`),
  renameUser: (oldName: string, newName: string) => api.post('/trips/rename', { oldName, newName }),
  create: (data: any) => api.post('/trips', data),
  update: (id: string, data: any) => api.put(`/trips/${id}`, data),
  delete: (id: string) => api.delete(`/trips/${id}`),
  join: (code: string, name: string, email?: string) => api.post('/trips/join', { code, name, email }),
  checkStatus: (id: string, name: string) => api.get(`/trips/check-status/${id}/${name}`),
  approve: (tripId: string, memberName: string) => api.post('/trips/approve', { tripId, memberName }),
  reject: (tripId: string, memberName: string) => api.post('/trips/reject', { tripId, memberName }),
  addMember: (tripId: string, name: string, email?: string) => api.post('/trips/add-member', { tripId, name, email }),
  removeMember: (tripId: string, memberName: string) => api.post('/trips/remove-member', { tripId, memberName }),
  leave: (tripId: string, memberName: string) => api.post('/trips/remove-member', { tripId, memberName }),
  transferAdmin: (tripId: string, newAdminName: string) => api.post('/trips/transfer-admin', { tripId, newAdminName }),
  getByInviteCode: (code: string) => api.get(`/trips/invite/${code}`),
};

export const expenseApi = {
  getAll: (tripId: string) => api.get(`/expenses/trip/${tripId}`),
  getById: (id: string) => api.get(`/expenses/${id}`),
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
