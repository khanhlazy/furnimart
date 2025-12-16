import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export interface User {
  _id: string; // Changed from id to match backend
  email: string;
  name: string;
  role: string;
  phone?: string;
  address?: string; // Legacy field
  addresses?: Array<{ // Added to match backend
    _id?: string;
    name: string;
    phone: string;
    street: string;
    ward: string;
    district: string;
    city: string;
    isDefault?: boolean;
  }>;
  isActive?: boolean;
}

interface AuthStore {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  hasHydrated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setLoading: (loading: boolean) => void;
  setHasHydrated: (hasHydrated: boolean) => void;
  isAuthenticated: () => boolean;
  hasRole: (role: string | string[]) => boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isLoading: false,
      hasHydrated: false,
      login: (token: string, user: User) => {
        set({ token, user, hasHydrated: true });
        // Set cookie for middleware to read (since middleware can't access localStorage)
        if (typeof window !== 'undefined') {
          // Use secure cookies with longer expiration
          const maxAge = 60 * 60 * 24 * 30; // 30 days
          document.cookie = `auth-token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
          document.cookie = `auth-user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
          console.log('✅ Login: Token and cookies set successfully');
        }
      },
      logout: () => {
        set({ token: null, user: null });
        // Clear cookies
        if (typeof window !== 'undefined') {
          document.cookie = 'auth-token=; path=/; max-age=0';
          document.cookie = 'auth-user=; path=/; max-age=0';
        }
      },
      setUser: (user: User) => set({ user }),
      setLoading: (isLoading: boolean) => set({ isLoading }),
      setHasHydrated: (hasHydrated: boolean) => set({ hasHydrated }),
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
      skipHydration: true,
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // Return a no-op storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
        // Restore cookies from localStorage after rehydration
        if (state && typeof window !== 'undefined') {
          if (state.token && state.user) {
            const maxAge = 60 * 60 * 24 * 30; // 30 days
            document.cookie = `auth-token=${state.token}; path=/; max-age=${maxAge}; SameSite=Lax`;
            document.cookie = `auth-user=${encodeURIComponent(JSON.stringify(state.user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
            console.log('✅ Rehydration: Cookies restored from localStorage');
          }
        }
      },
    },
  ),
);
