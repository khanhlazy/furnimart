import apiClient from './api';

export interface ThemeSettings {
  newsletter?: {
    title?: string;
    subtitle?: string;
    placeholder?: string;
    buttonText?: string;
    enabled?: boolean;
  };
  footer?: {
    about?: string;
    address?: string;
    phone?: string;
    email?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
      twitter?: string;
    };
    quickLinks?: Array<{ label: string; url: string }>;
    supportLinks?: Array<{ label: string; url: string }>;
    copyright?: string;
  };
  header?: {
    logoText?: string;
    searchPlaceholder?: string;
  };
}

export const settingsService = {
  getTheme: async (): Promise<ThemeSettings> => {
    return apiClient.get('/settings/theme') as Promise<ThemeSettings>;
  },

  updateTheme: async (data: { value: ThemeSettings }): Promise<ThemeSettings> => {
    return apiClient.put('/settings/theme', data) as Promise<ThemeSettings>;
  },
};

