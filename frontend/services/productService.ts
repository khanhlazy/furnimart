import { createBaseService } from './baseService';
import apiClient from './api';

const baseService = createBaseService('products');

export const productService = {
  ...baseService,
  getAll: async (filters?: any) => {
    return apiClient.get('/products', { params: filters }) as Promise<any>;
  },
};
