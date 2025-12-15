'use client';

import { useQuery } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { dashboardService } from '@services/dashboardService';
import { orderService } from '@services/orderService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import Link from 'next/link';
import { FiTrendingUp, FiPackage, FiTruck, FiBarChart2 } from 'react-icons/fi';

export default function ManagerDashboard() {
  const { user, isLoading } = useRequireAuth({ requiredRole: ['manager', 'admin'] });

  const { data: stats } = useQuery<any>(
    ['dashboard-stats'],
    () => dashboardService.getStats(),
    { enabled: !isLoading && (user?.role === 'manager' || user?.role === 'admin') }
  );

  const { data: orders = [] } = useQuery<any[]>(
    ['orders', 'all'],
    () => orderService.getAll(),
    { enabled: !isLoading && (user?.role === 'manager' || user?.role === 'admin') }
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

  if (!user || !['manager', 'admin'].includes(user.role)) {
    return null;
  }

  return (
    <div className="page-shell">
      <Navbar />
      
      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Quản lý</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard Quản lý</h1>
          <p className="text-gray-100/90">Thống kê và quản lý chi nhánh</p>
        </div>
      </header>

      <div className="section-shell py-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link href="/manager/reports" className="panel p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-primary mt-2">
                  {stats?.totalRevenue?.toLocaleString('vi-VN') || '0'}₫
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <FiTrendingUp className="text-2xl text-green-600" />
              </div>
            </div>
          </Link>

          <Link href="/manager/orders" className="panel p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-primary mt-2">{orders.length}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiPackage className="text-2xl text-blue-600" />
              </div>
            </div>
          </Link>

          <Link href="/manager/assign" className="panel p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-yellow-50 to-white border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Đơn chờ giao</p>
                <p className="text-2xl font-bold text-primary mt-2">
                  {orders.filter((o: any) => o.status === 'confirmed').length}
                </p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FiTruck className="text-2xl text-yellow-600" />
              </div>
            </div>
          </Link>

          <Link href="/manager/orders?status=delivered" className="panel p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-white border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Đơn đã giao</p>
                <p className="text-2xl font-bold text-primary mt-2">
                  {orders.filter((o: any) => o.status === 'delivered').length}
                </p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <FiPackage className="text-2xl text-purple-600" />
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/manager/warehouse" className="panel p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-indigo-50 to-white border-t-4 border-indigo-500">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <FiPackage className="text-xl text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Quản lý kho</h3>
            <p className="text-gray-600">Kiểm tra và điều chỉnh tồn kho</p>
          </Link>

          <Link href="/manager/assign" className="panel p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-cyan-50 to-white border-t-4 border-cyan-500">
            <div className="w-12 h-12 bg-cyan-100 rounded-lg flex items-center justify-center mb-4">
              <FiTruck className="text-xl text-cyan-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Phân công giao hàng</h3>
            <p className="text-gray-600">Phân công nhân viên giao hàng</p>
          </Link>

          <Link href="/manager/reports" className="panel p-6 hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-br from-pink-50 to-white border-t-4 border-pink-500">
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
              <FiBarChart2 className="text-xl text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Báo cáo</h3>
            <p className="text-gray-600">Xem báo cáo doanh thu và hiệu suất</p>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}

