'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@store/authStore';
import { useCartStore } from '@store/cartStore';
import { FiShoppingCart, FiLogOut, FiMenu, FiX, FiSearch, FiHome, FiBox } from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';

export default function Navbar() {
  const router = useRouter();
  const { user, logout, isAuthenticated, hasRole } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/products?search=${searchTerm}`);
    setSearchTerm('');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'admin':
      case 'manager':
        return <MdDashboard className="text-secondary" />;
      case 'employee':
        return <FiBox className="text-secondary" />;
      default:
        return null;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-secondary to-yellow-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <span className="hidden sm:inline text-xl font-bold text-primary">FurniMart</span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-secondary"
              >
                <FiSearch size={20} />
              </button>
            </div>
          </form>

          {/* Right Menu */}
          <div className="flex items-center gap-4">
            {/* Cart */}
            {isAuthenticated() && (
              <Link href="/cart" className="relative p-2 text-primary hover:text-secondary transition">
                <FiShoppingCart size={24} />
                {getTotalItems() > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalItems()}
                  </span>
                )}
              </Link>
            )}

            {/* User Menu */}
            {isAuthenticated() ? (
              <div className="hidden sm:flex items-center gap-2">
                <div className="flex items-center gap-2 px-3 py-1 bg-secondary bg-opacity-10 rounded-lg">
                  {getRoleIcon()}
                  <span className="text-sm font-medium text-primary">{user?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <FiLogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-primary hover:text-secondary font-medium"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-yellow-600 transition"
                >
                  Đăng ký
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-primary hover:text-secondary"
            >
              {isMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tìm sản phẩm..."
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm"
              />
              <button type="submit" className="p-2 text-secondary hover:bg-gray-100 rounded-lg">
                <FiSearch size={20} />
              </button>
            </form>

            <Link href="/products" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
              <FiHome /> Mua sắm
            </Link>

            {isAuthenticated() && (
              <>
                <Link href="/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
                  <FiBox /> Đơn hàng
                </Link>
                {hasRole(['admin', 'manager', 'employee']) && (
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
                    <MdDashboard /> Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <FiLogOut /> Đăng xuất
                </button>
              </>
            )}

            {!isAuthenticated() && (
              <div className="space-y-2">
                <Link
                  href="/auth/login"
                  className="block px-4 py-2 text-center text-primary hover:bg-gray-100 rounded-lg"
                >
                  Đăng nhập
                </Link>
                <Link
                  href="/auth/register"
                  className="block px-4 py-2 text-center bg-secondary text-white rounded-lg hover:bg-yellow-600"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
