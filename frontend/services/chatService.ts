import apiClient from './api';

export const chatService = {
  createOrGet: async (data?: { subject?: string }) => {
    return apiClient.post('/chat', data) as Promise<any>;
  },

  sendMessage: async (chatId: string, message: string, images?: string[]) => {
    return apiClient.post(`/chat/${chatId}/message`, {
      message,
      images,
    }) as Promise<any>;
  },

  getMyChats: async () => {
    return apiClient.get('/chat/my-chats') as Promise<any>;
  },

  getOpenChats: async () => {
    return apiClient.get('/chat/open') as Promise<any>;
  },

  getById: async (chatId: string) => {
    return apiClient.get(`/chat/${chatId}`) as Promise<any>;
  },

  assignToEmployee: async (chatId: string) => {
    return apiClient.put(`/chat/${chatId}/assign`) as Promise<any>;
  },

  updateStatus: async (chatId: string, status: string) => {
    return apiClient.put(`/chat/${chatId}/status`, { status }) as Promise<any>;
  },

  markAsRead: async (chatId: string) => {
    return apiClient.put(`/chat/${chatId}/read`) as Promise<any>;
  },
};

