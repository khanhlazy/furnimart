'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@store/authStore';
import Link from 'next/link';
import { FiShoppingCart, FiUser, FiLogOut, FiHome } from 'react-icons/fi';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  if (!isAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-primary">
            FurniMart
          </Link>

          <nav className="flex items-center gap-6">
            <Link href="/products" className="flex items-center gap-2 text-gray-700 hover:text-secondary">
              <FiHome /> Mua sắm
            </Link>
            <Link href="/cart" className="relative text-gray-700 hover:text-secondary">
              <FiShoppingCart size={24} />
            </Link>
            <Link href="/orders" className="text-gray-700 hover:text-secondary">
              Đơn hàng
            </Link>

            {/* User Menu */}
            <div className="flex items-center gap-4 border-l pl-6">
              <div className="flex items-center gap-2">
                <FiUser />
                <span className="text-sm font-medium text-primary">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-500 hover:bg-red-50 rounded-lg transition"
              >
                <FiLogOut /> Đăng xuất
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main>{children}</main>
    </div>
  );
}
