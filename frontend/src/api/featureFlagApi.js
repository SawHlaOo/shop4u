import { api } from './client';

export const featureFlagApi = {
  list: () => api.request('/feature-flags'),
  get: (key) => api.request(`/feature-flags/${key}`),
  create: (payload) => api.request('/feature-flags', { method: 'POST', body: payload }),
  update: (key, payload) => api.request(`/feature-flags/${key}`, { method: 'PATCH', body: payload }),
  remove: (key) => api.request(`/feature-flags/${key}`, { method: 'DELETE' })
};
