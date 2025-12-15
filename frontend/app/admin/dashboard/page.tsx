'use client';

import { useQuery } from 'react-query';
import Layout from '@components/Layout';
import { dashboardService } from '@services/dashboardService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import Link from 'next/link';
import { FiUsers, FiBox, FiShoppingBag, FiSettings } from 'react-icons/fi';

export default function AdminDashboard() {
  const { user, isLoading } = useRequireAuth({ requiredRole: 'admin' });

  const { data: stats } = useQuery<any>(
    ['dashboard-stats'],
    () => dashboardService.getStats(),
    { enabled: !isLoading && user?.role === 'admin' }
  );

  if (isLoading) {
    return (
      <Layout>
        <div className="flex-1 section-shell flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      </Layout>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Layout>
      
      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Quản trị viên</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard Quản trị viên</h1>
          <p className="text-gray-100/90">Tổng quan hệ thống và thống kê</p>
        </div>
      </header>

      <div className="section-shell py-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link href="/admin/users" className="panel p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Người dùng</p>
                <p className="text-3xl font-bold text-primary mt-2">{stats?.totalUsers || 0}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiUsers className="text-2xl text-blue-600" />
              </div>
            </div>
          </Link>

          <Link href="/admin/products" className="panel p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Sản phẩm</p>
                <p className="text-3xl font-bold text-primary mt-2">{stats?.totalProducts || 0}</p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <FiBox className="text-2xl text-green-600" />
              </div>
            </div>
          </Link>

          <Link href="/admin/orders" className="panel p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-yellow-50 to-white border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Đơn hàng</p>
                <p className="text-3xl font-bold text-primary mt-2">{stats?.totalOrders || 0}</p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FiShoppingBag className="text-2xl text-yellow-600" />
              </div>
            </div>
          </Link>

          <Link href="/admin/reports" className="panel p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-white border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Doanh thu</p>
                <p className="text-2xl font-bold text-primary mt-2">
                  {stats?.totalRevenue?.toLocaleString('vi-VN') || '0'}₫
                </p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <FiShoppingBag className="text-2xl text-purple-600" />
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link href="/admin/users" className="panel p-6 hover:shadow-lg transition text-center">
            <FiUsers className="text-4xl text-blue-500 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Quản lý người dùng</h3>
            <p className="text-sm text-gray-600">Thêm, sửa, xóa người dùng</p>
          </Link>

          <Link href="/admin/categories" className="panel p-6 hover:shadow-lg transition text-center">
            <FiBox className="text-4xl text-green-500 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Quản lý danh mục</h3>
            <p className="text-sm text-gray-600">Quản lý danh mục sản phẩm</p>
          </Link>

          <Link href="/admin/reports" className="panel p-6 hover:shadow-lg transition text-center">
            <FiShoppingBag className="text-4xl text-yellow-500 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Báo cáo</h3>
            <p className="text-sm text-gray-600">Xem báo cáo và thống kê</p>
          </Link>

          <Link href="/admin/disputes" className="panel p-6 hover:shadow-lg transition text-center">
            <FiBox className="text-4xl text-red-500 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Xử lý tranh chấp</h3>
            <p className="text-sm text-gray-600">Quản lý tranh chấp đơn hàng</p>
          </Link>

          <Link href="/admin/settings" className="panel p-6 hover:shadow-lg transition text-center">
            <FiSettings className="text-4xl text-purple-500 mx-auto mb-3" />
            <h3 className="font-bold mb-2">Cài đặt giao diện</h3>
            <p className="text-sm text-gray-600">Tùy chỉnh newsletter, footer</p>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

