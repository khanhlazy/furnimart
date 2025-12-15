import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { useAuthStore } from '@store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

console.log('🔧 API Configuration:');
console.log('  URL:', API_URL);
console.log('  Environment:', process.env.NODE_ENV);

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('%c📤 API REQUEST', 'color: blue; font-weight: bold', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  },
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response) => {
    console.log('%c✅ API RESPONSE', 'color: green; font-weight: bold', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });

    return response.data;
  },
  (error: AxiosError<any>) => {
    const message = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
    const status = error.response?.status;

    console.error('%c❌ API ERROR', 'color: red; font-weight: bold', {
      url: error.config?.url,
      status: status,
      message: message,
      response: error.response?.data,
    });

    if (status === 401) {
      useAuthStore.getState().logout();
      toast.error('Phiên đăng nhập đã hết hạn');
    } else if (status === 403) {
      toast.error('Bạn không có quyền truy cập');
    } else if (status === 404) {
      console.warn('⚠️  Endpoint không tìm thấy:', error.config?.url);
    } else if (status !== 404 && status) {
      toast.error(message);
    }

    return Promise.reject(error);
  },
);

// Ensure CSS/JS loaded: log to console when api.ts is loaded
console.log('%c🚀 FurniMart API service loaded!', 'color:#eab308;font-weight:bold;font-size:16px;');

export default apiClient;
