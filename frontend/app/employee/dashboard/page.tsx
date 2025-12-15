'use client';

import { useQuery } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { orderService } from '@services/orderService';
import { productService } from '@services/productService';
import { chatService } from '@services/chatService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import Link from 'next/link';
import { FiShoppingBag, FiBox, FiMessageSquare } from 'react-icons/fi';

export default function EmployeeDashboard() {
  const { user, isLoading } = useRequireAuth({ requiredRole: ['employee', 'admin'] });

  const { data: pendingOrders = [] } = useQuery<any[]>(
    ['orders', 'pending'],
    () => orderService.getAll({ status: 'pending' }),
    { enabled: !isLoading && (user?.role === 'employee' || user?.role === 'admin') }
  );

  const { data: products = [] } = useQuery<any[]>(
    ['products', 'employee'],
    () => productService.getAll({ limit: 10 }),
    { enabled: !isLoading && (user?.role === 'employee' || user?.role === 'admin') }
  );

  const { data: openChats = [] } = useQuery<any[]>(
    ['chats', 'open'],
    () => chatService.getOpenChats(),
    { enabled: !isLoading && (user?.role === 'employee' || user?.role === 'admin') }
  );

  if (isLoading) {
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

  if (!user || !['employee', 'admin'].includes(user.role)) {
    return null;
  }

  return (
    <div className="page-shell">
      <Navbar />
      
      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Nhân viên</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard Nhân viên</h1>
          <p className="text-gray-100/90">Quản lý đơn hàng và sản phẩm</p>
        </div>
      </header>

      <div className="section-shell py-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link href="/employee/orders?status=pending" className="panel p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Đơn hàng chờ xử lý</p>
                <p className="text-3xl font-bold text-primary mt-2">{pendingOrders.length}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiShoppingBag className="text-2xl text-blue-600" />
              </div>
            </div>
            <p className="text-secondary hover:underline text-sm mt-4 inline-block font-medium">
              Xem tất cả →
            </p>
          </Link>

          <Link href="/employee/products" className="panel p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Sản phẩm</p>
                <p className="text-3xl font-bold text-primary mt-2">{products.length}</p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <FiBox className="text-2xl text-green-600" />
              </div>
            </div>
            <p className="text-secondary hover:underline text-sm mt-4 inline-block font-medium">
              Quản lý sản phẩm →
            </p>
          </Link>

          <Link href="/employee/chat" className="panel p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-yellow-50 to-white border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Chat mở</p>
                <p className="text-3xl font-bold text-primary mt-2">{openChats.length}</p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FiMessageSquare className="text-2xl text-yellow-600" />
              </div>
            </div>
            <p className="text-secondary hover:underline text-sm mt-4 inline-block font-medium">
              Trả lời chat →
            </p>
          </Link>
        </div>

        {/* Recent Orders */}
        <div className="panel mb-6">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold">Đơn hàng chờ xử lý</h2>
            <Link href="/employee/orders" className="text-secondary hover:underline">
              Xem tất cả
            </Link>
          </div>
          <div className="p-6">
            {pendingOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Không có đơn hàng nào</p>
            ) : (
              <div className="space-y-4">
                {pendingOrders.slice(0, 5).map((order: any) => (
                  <Link
                    key={order._id}
                    href={`/employee/orders/${order._id}`}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 hover:border-secondary transition-all"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">Đơn #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="text-sm text-gray-600">{order.items.length} sản phẩm</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-secondary text-lg">{(order.totalPrice || order.total || 0).toLocaleString('vi-VN')}₫</p>
                      <p className="text-xs text-gray-500">Xem chi tiết →</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

