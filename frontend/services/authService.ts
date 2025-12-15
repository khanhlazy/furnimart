import apiClient from './api';

export const authService = {
  register: async (data: any) => {
    return apiClient.post('/auth/register', data) as Promise<any>;
  },

  login: async (data: any) => {
    return apiClient.post('/auth/login', data) as Promise<any>;
  },

  getMe: async () => {
    return apiClient.post('/auth/me', {}) as Promise<any>;
  },
};
