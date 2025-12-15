'use client';

import { useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ToastContainer } from 'react-toastify';
import { useAuthStore } from '@store/authStore';
import { useCartStore } from '@store/cartStore';
import 'react-toastify/dist/ReactToastify.css';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 1000 * 60 * 5 },
        },
      }),
  );

  useEffect(() => {
    // Rehydrate stores from localStorage
    const rehydrateStores = async () => {
      try {
        // Rehydrate auth store first
        await useAuthStore.persist.rehydrate();
        
        // After auth rehydration, restore cookies if needed
        const authState = useAuthStore.getState();
        if (authState.token && authState.user && typeof window !== 'undefined') {
          // Ensure cookies are set from localStorage with longer expiration
          const maxAge = 60 * 60 * 24 * 30; // 30 days
          document.cookie = `auth-token=${authState.token}; path=/; max-age=${maxAge}; SameSite=Lax`;
          document.cookie = `auth-user=${encodeURIComponent(JSON.stringify(authState.user))}; path=/; max-age=${maxAge}; SameSite=Lax`;
          console.log('✅ Providers: Cookies restored from localStorage');
        }
        
        // Then rehydrate cart
        await useCartStore.persist.rehydrate();
        
        console.log('✅ Stores rehydrated successfully');
      } catch (error) {
        console.error('❌ Error rehydrating stores:', error);
      }
    };
    
    rehydrateStores();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </QueryClientProvider>
  );
}
