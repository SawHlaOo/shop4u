import { api } from './client';

export const productApi = {
  listGames: () => api.request('/games'),
  // added missing listApps so Home.jsx can call productApi.listApps
  listApps: () => api.request('/apps'),
  getGame: (id) => api.request(`/games/${id}`),
  updateGame: (id, payload) => api.request(`/games/${id}`, { method: 'PATCH', body: payload }),
  deleteGame: (id) => api.request(`/games/${id}`, { method: 'DELETE' }),
  getApp: (id) => api.request(`/apps/${id}`),
  updateApp: (id, payload) => api.request(`/apps/${id}`, { method: 'PATCH', body: payload }),
  deleteApp: (id) => api.request(`/apps/${id}`, { method: 'DELETE' }),
  getPowerpoint: (id) => api.request(`/powerpoints/${id}`),
  listPowerpoints: () => api.request('/powerpoints'),
  updatePowerpoint: (id, payload) => api.request(`/powerpoints/${id}`, { method: 'PATCH', body: payload }),
  deletePowerpoint: (id) => api.request(`/powerpoints/${id}`, { method: 'DELETE' }),
  createGame: (payload) => api.request('/games', { method: 'POST', body: payload }),
  createApp: (payload) => api.request('/apps', { method: 'POST', body: payload }),
  createPowerpoint: (payload) => api.request('/powerpoints', { method: 'POST', body: payload }),
};
