import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@store/authStore';

interface UseRequireAuthOptions {
  requiredRole?: string | string[];
  redirectTo?: string;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}) {
  const { requiredRole, redirectTo } = options;
  const router = useRouter();
  const { user, hasHydrated, token } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for hydration
    if (!hasHydrated) {
      return;
    }

    // Check if user exists
    if (!user || !token) {
      setIsChecking(false);
      const redirect = redirectTo || '/auth/login';
      const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
      if (currentPath && !currentPath.includes('/auth/')) {
        router.push(`${redirect}?redirect=${encodeURIComponent(currentPath)}`);
      } else {
        router.push(redirect);
      }
      return;
    }

    // Check role if required
    if (requiredRole) {
      const userRole = user.role;
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      
      if (!allowedRoles.includes(userRole)) {
        setIsChecking(false);
        router.push(redirectTo || '/');
        return;
      }
    }

    setIsChecking(false);
  }, [user, hasHydrated, token, requiredRole, redirectTo, router]);

  return {
    user,
    isAuthenticated: !!user && !!token,
    hasHydrated,
    isChecking,
    isLoading: !hasHydrated || isChecking,
  };
}

