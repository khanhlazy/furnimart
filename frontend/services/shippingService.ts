import apiClient from './api';

export const shippingService = {
  getByOrderId: async (orderId: string) => {
    return apiClient.get(`/shipping/order/${orderId}`) as Promise<any>;
  },

  getMyDeliveries: async () => {
    return apiClient.get('/shipping/my-deliveries') as Promise<any>;
  },

  updateStatus: async (orderId: string, data: any) => {
    return apiClient.put(`/shipping/order/${orderId}/update`, data) as Promise<any>;
  },
};

