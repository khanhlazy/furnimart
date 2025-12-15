import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useAuthStore } from '@store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const isDev = process.env.NODE_ENV === 'development';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Helper function to get token from store or cookies
const getToken = (): string | null => {
  // First try to get from store
  const state = useAuthStore.getState();
  if (state.token) {
    return state.token;
  }
  
  // Fallback: get from cookies (for cases where store hasn't hydrated yet)
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
    if (tokenCookie) {
      // Handle case where token might contain '=' characters
      const tokenValue = tokenCookie.trim().substring('auth-token='.length);
      return tokenValue || null;
    }
  }
  
  return null;
};

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from store or cookies
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (isDev) {
        console.log('%c🔑 Token attached', 'color: green', config.url);
      }
    } else {
      const protectedPaths = ['/orders', '/account', '/auth/me'];
      if (protectedPaths.some(path => config.url?.includes(path)) && isDev) {
        console.warn('⚠️ Token missing:', config.url);
      }
    }

    if (isDev) {
      console.log('📤', config.method?.toUpperCase(), config.url);
    }

    return config;
  },
  (error) => {
    if (isDev) console.error('❌ Request Error:', error);
    return Promise.reject(error);
  },
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    if (isDev) {
      console.log('✅', response.status, response.config.url);
    }

    // Backend ResponseInterceptor wraps response in { success, statusCode, message, data }
    // If wrapped, return data; otherwise return response.data directly
    if (response.data && typeof response.data === 'object' && 'data' in response.data && 'success' in response.data) {
      return response.data.data as any;
    }
    return response.data as any;
  },
  (error: AxiosError<any>) => {
    const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
    const status = error.response?.status;

    if (isDev) {
      console.error('❌', status, error.config?.url, message);
    }

    if (status === 401) {
      // Only logout and show toast if not already on login page
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      if (!currentPath.includes('/auth/login')) {
        useAuthStore.getState().logout();
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
      }
    } else if (status === 403) {
      toast.error('Bạn không có quyền truy cập');
    } else if (status === 404 && isDev) {
      console.warn('⚠️ Endpoint not found:', error.config?.url);
    } else if (status !== 404 && status) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

// API service loaded

export default apiClient;
