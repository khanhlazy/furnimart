import apiClient from './api';

export const warehouseService = {
  getAll: async () => {
    return apiClient.get('/warehouse') as Promise<any>;
  },

  getById: async (id: string) => {
    return apiClient.get(`/warehouse/${id}`) as Promise<any>;
  },

  getByProductId: async (productId: string) => {
    return apiClient.get(`/warehouse/product/${productId}`) as Promise<any>;
  },

  getLowStock: async (threshold?: number) => {
    return apiClient.get('/warehouse/low-stock', { params: { threshold } }) as Promise<any>;
  },

  create: async (data: any) => {
    return apiClient.post('/warehouse', data) as Promise<any>;
  },

  addTransaction: async (id: string, data: any) => {
    return apiClient.post(`/warehouse/${id}/transaction`, data) as Promise<any>;
  },

  adjustStock: async (id: string, data: any) => {
    return apiClient.put(`/warehouse/${id}/adjust`, data) as Promise<any>;
  },

  reserveStock: async (productId: string, quantity: number) => {
    return apiClient.post(`/warehouse/reserve/${productId}`, { quantity }) as Promise<any>;
  },

  releaseStock: async (productId: string, quantity: number) => {
    return apiClient.post(`/warehouse/release/${productId}`, { quantity }) as Promise<any>;
  },
};

