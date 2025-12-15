import apiClient from './api';

export const reviewService = {
  create: async (data: any) => {
    const response = await apiClient.post('/reviews', data);
    return response;
  },

  getByProduct: async (productId: string) => {
    const response = await apiClient.get(`/reviews/product/${productId}`);
    return response;
  },

  getMyReviews: async () => {
    const response = await apiClient.get('/reviews/my-reviews');
    return response;
  },

  update: async (id: string, data: any) => {
    const response = await apiClient.put(`/reviews/${id}`, data);
    return response;
  },

  delete: async (id: string) => {
    const response = await apiClient.delete(`/reviews/${id}`);
    return response;
  },
};
