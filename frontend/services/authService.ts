import apiClient from './api';

export const authService = {
  register: async (data: any) => {
    const response = await apiClient.post('/auth/register', data);
    return response;
  },

  login: async (data: any) => {
    const response = await apiClient.post('/auth/login', data);
    return response;
  },

  getMe: async () => {
    const response = await apiClient.post('/auth/me', {});
    return response;
  },
};
