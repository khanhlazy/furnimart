import apiClient from './api';

export const orderService = {
  create: async (data: any) => {
    const response = await apiClient.post('/orders', data);
    return response;
  },

  getMyOrders: async () => {
    const response = await apiClient.get('/orders/my-orders');
    return response;
  },

  getAll: async (filters?: any) => {
    const response = await apiClient.get('/orders', { params: filters });
    return response;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/orders/${id}`);
    return response;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await apiClient.put(`/orders/${id}/status`, { status });
    return response;
  },

  assignShipper: async (orderId: string, shipperId: string) => {
    const response = await apiClient.put(`/orders/${orderId}/assign-shipper`, { shipperId });
    return response;
  },
};
