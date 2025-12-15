'use client';

import { useState, useRef, useEffect } from 'react';
import { useQuery } from 'react-query';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@store/authStore';
import { useCartStore } from '@store/cartStore';
import { settingsService } from '@services/settingsService';
import { 
  FiShoppingCart, 
  FiLogOut, 
  FiMenu, 
  FiX, 
  FiSearch, 
  FiHome, 
  FiBox, 
  FiUser, 
  FiChevronDown,
  FiPackage,
  FiMessageSquare,
  FiUsers,
  FiFolder,
  FiTruck,
  FiAlertCircle,
  FiBarChart2,
  FiSettings
} from 'react-icons/fi';
import { MdDashboard } from 'react-icons/md';

export default function Navbar() {
  const router = useRouter();
  const { user, logout, isAuthenticated, hasRole } = useAuthStore();
  const { getTotalItems } = useCartStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { data: settings } = useQuery(
    ['settings', 'theme'],
    () => settingsService.getTheme(),
    {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    }
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/products?search=${searchTerm}`);
    setSearchTerm('');
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'admin':
      case 'manager':
        return <MdDashboard className="text-secondary" />;
      case 'employee':
        return <FiBox className="text-secondary" />;
      case 'shipper':
        return <FiTruck className="text-secondary" />;
      default:
        return <FiUser className="text-secondary" />;
    }
  };

  const getRoleMenuItems = () => {
    const role = user?.role;
    
    switch (role) {
      case 'admin':
        return [
          { icon: <MdDashboard />, label: 'Dashboard', href: '/admin/dashboard' },
          { icon: <FiUsers />, label: 'Quản lý người dùng', href: '/admin/users' },
          { icon: <FiFolder />, label: 'Quản lý danh mục', href: '/admin/categories' },
          { icon: <FiBox />, label: 'Quản lý sản phẩm', href: '/admin/products' },
          { icon: <FiPackage />, label: 'Quản lý đơn hàng', href: '/admin/orders' },
          { icon: <FiAlertCircle />, label: 'Tranh chấp', href: '/admin/disputes' },
          { icon: <FiBarChart2 />, label: 'Báo cáo', href: '/admin/reports' },
          { icon: <FiSettings />, label: 'Cài đặt giao diện', href: '/admin/settings' },
          { icon: <FiUser />, label: 'Tài khoản', href: '/account' },
        ];
      case 'manager':
        return [
          { icon: <MdDashboard />, label: 'Dashboard', href: '/manager/dashboard' },
          { icon: <FiPackage />, label: 'Quản lý đơn hàng', href: '/manager/orders' },
          { icon: <FiBox />, label: 'Quản lý sản phẩm', href: '/manager/products' },
          { icon: <FiUsers />, label: 'Quản lý người dùng', href: '/manager/users' },
          { icon: <FiTruck />, label: 'Kho hàng', href: '/manager/warehouse' },
          { icon: <FiUser />, label: 'Tài khoản', href: '/account' },
        ];
      case 'employee':
        return [
          { icon: <MdDashboard />, label: 'Dashboard', href: '/employee/dashboard' },
          { icon: <FiPackage />, label: 'Đơn hàng', href: '/employee/orders' },
          { icon: <FiBox />, label: 'Sản phẩm', href: '/employee/products' },
          { icon: <FiMessageSquare />, label: 'Chat hỗ trợ', href: '/employee/chat' },
          { icon: <FiUser />, label: 'Tài khoản', href: '/account' },
        ];
      case 'shipper':
        return [
          { icon: <MdDashboard />, label: 'Dashboard', href: '/shipper/dashboard' },
          { icon: <FiPackage />, label: 'Đơn hàng giao hàng', href: '/shipper/orders' },
          { icon: <FiUser />, label: 'Tài khoản', href: '/account' },
        ];
      case 'customer':
      default:
        return [
          { icon: <FiPackage />, label: 'Đơn hàng của tôi', href: '/orders' },
          { icon: <FiAlertCircle />, label: 'Tranh chấp', href: '/account/disputes' },
          { icon: <FiMessageSquare />, label: 'Hỗ trợ', href: '/support' },
          { icon: <FiUser />, label: 'Tài khoản', href: '/account' },
        ];
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
            <span className="hidden sm:inline text-xl font-bold text-primary">
              {settings?.header?.logoText || 'FurniMart'}
            </span>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-8">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={settings?.header?.searchPlaceholder || 'Tìm sản phẩm...'}
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
              <div className="hidden sm:flex items-center gap-2 relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-secondary bg-opacity-10 rounded-lg hover:bg-opacity-20 transition cursor-pointer"
                >
                  {getRoleIcon()}
                  <span className="text-sm font-medium text-primary">{user?.name}</span>
                  <FiChevronDown className={`text-primary transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                    </div>
                    <div className="py-1">
                      {getRoleMenuItems().map((item, index) => (
                        <Link
                          key={index}
                          href={item.href}
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                          <span className="text-gray-600">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 pt-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <FiLogOut />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                )}
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
                placeholder={settings?.header?.searchPlaceholder || 'Tìm sản phẩm...'}
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
                {hasRole('customer') && (
                  <>
                    <Link href="/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
                      <FiBox /> Đơn hàng
                    </Link>
                    <Link href="/support" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
                      <FiBox /> Hỗ trợ
                    </Link>
                  </>
                )}
                {hasRole('employee') && (
                  <Link href="/employee/dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
                    <MdDashboard /> Dashboard
                  </Link>
                )}
                {hasRole('manager') && (
                  <Link href="/manager/dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
                    <MdDashboard /> Dashboard
                  </Link>
                )}
                {hasRole('shipper') && (
                  <Link href="/shipper/orders" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
                    <MdDashboard /> Đơn hàng
                  </Link>
                )}
                {hasRole('admin') && (
                  <Link href="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
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
