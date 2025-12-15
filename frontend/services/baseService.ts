import apiClient from './api';

/**
 * Base service factory để tạo các CRUD service với pattern chung
 * Giảm code trùng lặp trong các service
 */
export function createBaseService<T = any>(endpoint: string) {
  return {
    getAll: async (params?: any) => {
      return apiClient.get(`/${endpoint}`, { params }) as Promise<T[]>;
    },

    getById: async (id: string) => {
      return apiClient.get(`/${endpoint}/${id}`) as Promise<T>;
    },

    create: async (data: any) => {
      return apiClient.post(`/${endpoint}`, data) as Promise<T>;
    },

    update: async (id: string, data: any) => {
      return apiClient.put(`/${endpoint}/${id}`, data) as Promise<T>;
    },

    delete: async (id: string) => {
      return apiClient.delete(`/${endpoint}/${id}`) as Promise<void>;
    },
  };
}

