import { createBaseService } from './baseService';
import apiClient from './api';

const baseService = createBaseService('disputes');

export const disputesService = {
  ...baseService,
  getAll: async (status?: string) => {
    return apiClient.get('/disputes', { params: { status } }) as Promise<any>;
  },
  getMyDisputes: async () => {
    return apiClient.get('/disputes/my-disputes') as Promise<any>;
  },
  getByOrderId: async (orderId: string) => {
    return apiClient.get(`/disputes/order/${orderId}`) as Promise<any>;
  },
  getStats: async () => {
    return apiClient.get('/disputes/stats') as Promise<any>;
  },
};

