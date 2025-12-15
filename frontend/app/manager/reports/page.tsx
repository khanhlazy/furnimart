'use client';

import { useState } from 'react';
import { useQuery } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { dashboardService } from '@services/dashboardService';
import { orderService } from '@services/orderService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import { FiPackage, FiDollarSign, FiCheckCircle, FiClock } from 'react-icons/fi';

export default function ManagerReportsPage() {
  const { user, isLoading } = useRequireAuth({ requiredRole: ['manager', 'admin'] });
  const [daysFilter, setDaysFilter] = useState(30);

  const { data: topProducts = [] } = useQuery<any[]>(
    ['top-products'],
    () => dashboardService.getTopProducts(10),
    { enabled: !isLoading && (user?.role === 'manager' || user?.role === 'admin') }
  );

  const { data: ordersByStatus = [] } = useQuery<any[]>(
    ['orders-by-status'],
    () => dashboardService.getOrdersByStatus(),
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

  const totalRevenue = orders
    .filter((o: any) => o.status === 'delivered')
    .reduce((sum: number, o: any) => sum + (o.totalPrice || o.total || 0), 0);

  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o: any) => o.status === 'delivered').length;
  const pendingOrders = orders.filter((o: any) => o.status === 'pending' || o.status === 'confirmed').length;

  return (
    <div className="page-shell">
      <Navbar />
      
      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Quản lý</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Báo cáo và Thống kê</h1>
          <p className="text-gray-100/90">Phân tích doanh thu và hiệu suất kinh doanh</p>
        </div>
      </header>

      <div className="section-shell py-10">
        {/* Filter */}
        <div className="panel mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Lọc theo thời gian</h2>
            <select
              value={daysFilter}
              onChange={(e) => setDaysFilter(Number(e.target.value))}
              className="px-4 py-2 border rounded-lg"
            >
              <option value={7}>7 ngày qua</option>
              <option value={30}>30 ngày qua</option>
              <option value={90}>90 ngày qua</option>
              <option value={365}>1 năm qua</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="panel p-6 bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-primary mt-2">
                  {totalRevenue.toLocaleString('vi-VN')}₫
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <FiDollarSign className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="panel p-6 bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tổng đơn hàng</p>
                <p className="text-2xl font-bold text-primary mt-2">{totalOrders}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiPackage className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="panel p-6 bg-gradient-to-br from-purple-50 to-white border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Đơn đã giao</p>
                <p className="text-2xl font-bold text-primary mt-2">{deliveredOrders}</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <FiCheckCircle className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>

          <div className="panel p-6 bg-gradient-to-br from-yellow-50 to-white border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Đơn chờ xử lý</p>
                <p className="text-2xl font-bold text-primary mt-2">{pendingOrders}</p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FiClock className="text-2xl text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders by Status */}
        <div className="panel mb-6">
          <h2 className="text-xl font-bold mb-4">Đơn hàng theo trạng thái</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {ordersByStatus.map((item: any) => (
              <div key={item.status} className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">{item.label || item.status}</p>
                <p className="text-2xl font-bold text-primary">{item.count || 0}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="panel">
          <h2 className="text-xl font-bold mb-4">Sản phẩm bán chạy</h2>
          {topProducts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Chưa có dữ liệu</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-styled">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên sản phẩm</th>
                    <th>Số lượng bán</th>
                    <th>Doanh thu</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product: any, index: number) => (
                    <tr key={product._id || index}>
                      <td>{index + 1}</td>
                      <td className="font-semibold">{product.name || 'N/A'}</td>
                      <td>{product.soldCount || 0}</td>
                      <td className="font-bold text-primary">
                        {(product.revenue || 0).toLocaleString('vi-VN')}₫
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

