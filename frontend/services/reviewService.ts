import { createBaseService } from './baseService';
import apiClient from './api';

const baseService = createBaseService('reviews');

export const reviewService = {
  ...baseService,
  getByProduct: async (productId: string) => {
    return apiClient.get(`/reviews/product/${productId}`) as Promise<any>;
  },
  getMyReviews: async () => {
    return apiClient.get('/reviews/my-reviews') as Promise<any>;
  },
  create: async (data: { productId: string; rating: number; comment: string; customerName: string; images?: string[] }) => {
    return apiClient.post('/reviews', data) as Promise<any>;
  },
};
