import { api } from './client';

export const authApi = {
  login: (payload) => api.request('/login', { method: 'POST', body: payload, auth: false }),
  register: (payload) => api.request('/users', { method: 'POST', body: payload, auth: false }),
  verify: () => api.request('/verify'),
  deleteUser: (id) => api.request(`/users/${id}`, { method: 'DELETE' }),
};
