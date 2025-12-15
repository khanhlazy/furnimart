import apiClient from './api';

export const orderService = {
  create: async (data: any) => {
    return apiClient.post('/orders', data) as Promise<any>;
  },

  getMyOrders: async () => {
    return apiClient.get('/orders/my-orders') as Promise<any>;
  },

  getAll: async (filters?: any) => {
    return apiClient.get('/orders', { params: filters }) as Promise<any>;
  },

  getById: async (id: string) => {
    return apiClient.get(`/orders/${id}`) as Promise<any>;
  },

  updateStatus: async (id: string, status: string) => {
    return apiClient.put(`/orders/${id}/status`, { status }) as Promise<any>;
  },

  assignShipper: async (orderId: string, shipperId: string) => {
    return apiClient.put(`/orders/${orderId}/assign-shipper`, { shipperId }) as Promise<any>;
  },
};
