import { useAuthStore } from '@store/authStore';

export interface UploadResponse {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimetype: string;
}

// Helper to get token
const getToken = (): string | null => {
  const state = useAuthStore.getState();
  if (state.token) {
    return state.token;
  }
  
  // Fallback: get from cookies
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
    if (tokenCookie) {
      const tokenValue = tokenCookie.trim().substring('auth-token='.length);
      return tokenValue || null;
    }
  }
  
  return null;
};

export const uploadService = {
  uploadImage: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = getToken();
    if (!token) {
      throw new Error('Không tìm thấy token đăng nhập. Vui lòng đăng nhập lại.');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/upload/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - browser will set it automatically with boundary for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `Upload failed: ${response.status} ${response.statusText}` }));
      throw new Error(error.message || 'Upload failed');
    }

    const result = await response.json();
    // Backend ResponseInterceptor wraps response in { success, statusCode, message, data }
    // Extract data if wrapped, otherwise return result directly
    return (result.data !== undefined ? result.data : result) as UploadResponse;
  },

  uploadImages: async (files: File[]): Promise<UploadResponse[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const token = getToken();
    if (!token) {
      throw new Error('Không tìm thấy token đăng nhập. Vui lòng đăng nhập lại.');
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/upload/images`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type - browser will set it automatically with boundary for FormData
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: `Upload failed: ${response.status} ${response.statusText}` }));
      throw new Error(error.message || 'Upload failed');
    }

    const result = await response.json();
    // Backend ResponseInterceptor wraps response in { success, statusCode, message, data }
    // Extract data if wrapped, otherwise return result directly
    const data = result.data !== undefined ? result.data : result;
    // Ensure it's always an array
    return Array.isArray(data) ? data : [data];
  },
};

