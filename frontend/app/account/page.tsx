'use client';

import { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { useAuthStore } from '@store/authStore';
import { orderService } from '@services/orderService';
import { FiUser, FiShoppingBag, FiEdit, FiLogOut, FiAlertCircle } from 'react-icons/fi';
import { Order } from '@types';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, hasHydrated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'disputes'>('profile');

  useEffect(() => {
    if (hasHydrated && !user && typeof window !== 'undefined') {
      router.push('/auth/login?redirect=/account');
    }
  }, [user, hasHydrated, router]);

  const { data: orders = [] } = useQuery<Order[]>(
    ['my-orders'],
    () => orderService.getMyOrders(),
    { enabled: !!user && hasHydrated }
  );

  if (!hasHydrated) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="flex-1 section-shell flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      processing: 'Đang xử lý',
      shipped: 'Đang giao hàng',
      delivered: 'Đã giao hàng',
      cancelled: 'Đã hủy',
    };
    return texts[status] || status;
  };

  if (!user) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="flex-1 section-shell flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">Vui lòng đăng nhập</p>
            <Link href="/auth/login" className="inline-link">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Navbar />

      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Tài khoản</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Hồ sơ của tôi</h1>
          <p className="text-gray-100/90">Quản lý thông tin và đơn hàng</p>
        </div>
      </header>

      <div className="section-shell py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="panel space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === 'profile'
                    ? 'bg-secondary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiUser /> Thông tin
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === 'orders'
                    ? 'bg-secondary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <FiShoppingBag /> Đơn hàng
              </button>
              <Link
                href="/account/disputes"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                <FiAlertCircle /> Tranh chấp
              </Link>
              <Link
                href="/support"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                <FiEdit /> Hỗ trợ
              </Link>
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/';
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition"
              >
                <FiLogOut /> Đăng xuất
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' && (
              <div className="panel space-y-6 bg-gradient-to-br from-white to-gray-50/50">
                <div className="flex items-center gap-3 pb-4 border-b">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
                    <p className="text-sm text-gray-500">Quản lý thông tin tài khoản của bạn</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Tên</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">{user.name}</div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">{user.email}</div>
                  </div>

                  {user.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Số điện thoại</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">{user.phone}</div>
                    </div>
                  )}

                  {user.address && (
                    <div>
                      <label className="text-sm font-medium text-gray-700">Địa chỉ</label>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">{user.address}</div>
                    </div>
                  )}

                  <div>
                    <label className="text-sm font-medium text-gray-700">Vai trò</label>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg capitalize">{user.role}</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="panel">
                <div className="flex items-center gap-3 pb-4 border-b mb-6">
                  <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <FiShoppingBag className="text-secondary" size={20} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Lịch sử đơn hàng</h2>
                    <p className="text-sm text-gray-500">Theo dõi tất cả đơn hàng của bạn</p>
                  </div>
                </div>
                
                {orders.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FiShoppingBag size={40} className="text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-lg font-semibold mb-2">Chưa có đơn hàng nào</p>
                    <p className="text-gray-500 text-sm mb-6">Bắt đầu mua sắm để xem đơn hàng ở đây</p>
                    <Link href="/products" className="btn-primary inline-flex items-center gap-2">
                      <FiShoppingBag /> Bắt đầu mua sắm
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <Link
                        key={order._id}
                        href={`/orders/${order._id}`}
                        className="block p-5 border rounded-xl hover:shadow-lg hover:border-secondary transition-all bg-white"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-bold text-lg">Đơn hàng #{order._id.slice(-8).toUpperCase()}</span>
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                                {getStatusText(order.status)}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              {order.items.length} sản phẩm • {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <div className="text-xl font-bold text-secondary">
                            {(order.totalPrice || order.total || 0).toLocaleString('vi-VN')}₫
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

