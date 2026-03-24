import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://tripsplit-server.onrender.com/api';
export const SOCKET_URL = API_URL.replace(/\/api\/?$/, '');

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

const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 mins

const getCached = async (url: string, config?: any) => {
  if (cache.has(url)) {
    const cached = cache.get(url)!;
    if (Date.now() - cached.timestamp < CACHE_DURATION) {
      // Stale-while-revalidate background fetch
      api.get(url, config)
        .then(res => cache.set(url, { data: res.data, timestamp: Date.now() }))
        .catch(() => {});
      return { data: cached.data };
    }
  }
  const res = await api.get(url, config);
  cache.set(url, { data: res.data, timestamp: Date.now() });
  return res;
};

// Clear cache when mutations happen to keep data fresh
const invalidateCache = () => { cache.clear(); };

export const tripApi = {
  getAll: (name: string, email?: string) => 
    getCached(`/trips?name=${encodeURIComponent(name)}${email ? `&email=${encodeURIComponent(email)}` : ''}`),
  getById: (id: string) => getCached(`/trips/${id}`),
  getTripByInviteCode: (code: string) => getCached(`/trips/invite/${code}`),
  renameUser: (oldName: string, newName: string) => { invalidateCache(); return api.post('/trips/rename', { oldName, newName }); },
  create: (data: any) => { invalidateCache(); return api.post('/trips', data); },
  update: (id: string, data: any) => { invalidateCache(); return api.put(`/trips/${id}`, data); },
  delete: (id: string) => { invalidateCache(); return api.delete(`/trips/${id}`); },
  join: (code: string, name: string, email?: string) => { invalidateCache(); return api.post('/trips/join', { code, name, email }); },
  checkStatus: (id: string, name: string) => getCached(`/trips/check-status/${id}/${name}`),
  approve: (tripId: string, memberName: string) => { invalidateCache(); return api.post('/trips/approve', { tripId, memberName }); },
  reject: (tripId: string, memberName: string) => { invalidateCache(); return api.post('/trips/reject', { tripId, memberName }); },
  addMember: (tripId: string, name: string, email?: string) => { invalidateCache(); return api.post('/trips/add-member', { tripId, name, email }); },
  removeMember: (tripId: string, memberName: string) => { invalidateCache(); return api.post('/trips/remove-member', { tripId, memberName }); },
  leave: (tripId: string, memberName: string) => { invalidateCache(); return api.post('/trips/remove-member', { tripId, memberName }); },
  transferAdmin: (tripId: string, newAdminName: string) => { invalidateCache(); return api.post('/trips/transfer-admin', { tripId, newAdminName }); },
  getByInviteCode: (code: string) => getCached(`/trips/invite/${code}`),
};

export const expenseApi = {
  getAll: (tripId: string) => getCached(`/expenses/trip/${tripId}`),
  getById: (id: string) => getCached(`/expenses/${id}`),
  create: (data: any) => { invalidateCache(); return api.post('/expenses', data); },
  update: (id: string, data: any) => { invalidateCache(); return api.put(`/expenses/${id}`, data); },
  delete: (id: string) => { invalidateCache(); return api.delete(`/expenses/${id}`); },
  getSummary: (tripId: string) => getCached(`/expenses/summary/${tripId}`),
  parseWhatsApp: (text: string, tripId: string, defaultPayer?: string) => 
    api.post('/expenses/parse-whatsapp', { text, tripId, defaultPayer }),
  bulkCreate: (tripId: string, expenses: any[]) => { invalidateCache(); return api.post('/expenses/bulk', { tripId, expenses }); },
};

export const utilityApi = {
  getQR: (upiId: string, amount: number, name: string) => 
    getCached(`/utilities/qr/${upiId}/${amount}/${name}`),
  getPDF: (tripId: string) => 
    api.get(`/utilities/pdf/${tripId}`, { responseType: 'blob' }),
};

export default api;
