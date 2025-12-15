import apiClient from './api';

export const dashboardService = {
  getStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response;
  },

  getOrderStats: async (days = 30) => {
    const response = await apiClient.get('/dashboard/orders-stats', { params: { days } });
    return response;
  },

  getTopProducts: async (limit = 10) => {
    const response = await apiClient.get('/dashboard/top-products', { params: { limit } });
    return response;
  },

  getOrdersByStatus: async () => {
    const response = await apiClient.get('/dashboard/orders-by-status');
    return response;
  },
};
