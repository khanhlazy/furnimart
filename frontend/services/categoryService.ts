import { createBaseService } from './baseService';
import apiClient from './api';

const baseService = createBaseService('categories');

export const categoryService = {
  ...baseService,
  getAll: async (includeInactive?: boolean) => {
    return apiClient.get('/categories', {
      params: { includeInactive },
    }) as Promise<any>;
  },
  getBySlug: async (slug: string) => {
    return apiClient.get(`/categories/slug/${slug}`) as Promise<any>;
  },
  getByParent: async (parentId?: string) => {
    return apiClient.get(`/categories/by-parent/${parentId || ''}`) as Promise<any>;
  },
};

