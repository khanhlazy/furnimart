import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  phone?: string;
  address?: string;
  isActive?: boolean;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  isAuthenticated: () => boolean;
  hasRole: (role: string | string[]) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      login: (token: string, user: User) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      setUser: (user: User) => set({ user }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      isAuthenticated: () => !!get().token && !!get().user,
      hasRole: (role: string | string[]) => {
        const userRole = get().user?.role;
        if (typeof role === 'string') {
          return userRole === role;
        }
        return role.includes(userRole || '');
      },
    }),
    {
      name: 'auth-storage',
    },
  ),
);
