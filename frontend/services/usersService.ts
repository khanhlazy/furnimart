import { createBaseService } from './baseService';
import apiClient from './api';

const baseService = createBaseService('users');

export const usersService = {
  ...baseService,
  getProfile: async () => {
    return apiClient.get('/users/profile') as Promise<any>;
  },
};

