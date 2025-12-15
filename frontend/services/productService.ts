import apiClient from './api';

export const productService = {
  getAll: async (filters?: any) => {
    const response = await apiClient.get('/products', { params: filters });
    return response;
  },

  getById: async (id: string) => {
    const response = await apiClient.get(`/products/${id}`);
    return response;
  },

  create: async (data: any) => {
    const response = await apiClient.post('/products', data);
    return response;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/products/${id}`, data);
    return response;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/products/${id}`);
    return response;
  },
};
