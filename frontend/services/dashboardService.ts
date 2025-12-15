import apiClient from './api';

export const dashboardService = {
  getStats: async () => {
    return apiClient.get('/dashboard/stats') as Promise<any>;
  },

  getOrderStats: async (days = 30) => {
    return apiClient.get('/dashboard/orders-stats', { params: { days } }) as Promise<any>;
  },

  getTopProducts: async (limit = 10) => {
    return apiClient.get('/dashboard/top-products', { params: { limit } }) as Promise<any>;
  },

  getOrdersByStatus: async () => {
    return apiClient.get('/dashboard/orders-by-status') as Promise<any>;
  },
};
