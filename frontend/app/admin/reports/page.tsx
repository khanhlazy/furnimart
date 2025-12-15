'use client';

import { useQuery } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { dashboardService } from '@services/dashboardService';
import { disputesService } from '@services/disputesService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import { FiPackage, FiShoppingBag, FiDollarSign, FiAlertCircle } from 'react-icons/fi';

export default function AdminReportsPage() {
  const { user, isLoading } = useRequireAuth({ requiredRole: 'admin' });

  const { data: stats } = useQuery<any>(
    ['dashboard-stats'],
    () => dashboardService.getStats(),
    { enabled: !isLoading && user?.role === 'admin' }
  );

  const { data: orderStats } = useQuery<any>(
    ['order-stats'],
    () => dashboardService.getOrderStats(30),
    { enabled: !isLoading && user?.role === 'admin' }
  );

  const { data: ordersByStatus } = useQuery<any>(
    ['orders-by-status'],
    () => dashboardService.getOrdersByStatus(),
    { enabled: !isLoading && user?.role === 'admin' }
  );

  const { data: topProducts } = useQuery<any>(
    ['top-products'],
    () => dashboardService.getTopProducts(10),
    { enabled: !isLoading && user?.role === 'admin' }
  );

  const { data: disputeStats } = useQuery<any>(
    ['dispute-stats'],
    () => disputesService.getStats(),
    { enabled: !isLoading && user?.role === 'admin' }
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

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="page-shell">
      <Navbar />
      
      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Báo cáo</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Báo cáo và Thống kê</h1>
          <p className="text-gray-100/90">Tổng quan hoạt động hệ thống</p>
        </div>
      </header>

      <div className="section-shell py-10">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="panel p-6 bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tổng đơn hàng</p>
                <p className="text-3xl font-bold text-primary mt-2">{stats?.totalOrders || 0}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiShoppingBag className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="panel p-6 bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tổng doanh thu</p>
                <p className="text-2xl font-bold text-primary mt-2">
                  {stats?.totalRevenue?.toLocaleString('vi-VN') || '0'}₫
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <FiDollarSign className="text-2xl text-green-600" />
              </div>
            </div>
          </div>

          <div className="panel p-6 bg-gradient-to-br from-purple-50 to-white border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Sản phẩm</p>
                <p className="text-3xl font-bold text-primary mt-2">{stats?.totalProducts || 0}</p>
              </div>
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                <FiPackage className="text-2xl text-purple-600" />
              </div>
            </div>
          </div>

          <div className="panel p-6 bg-gradient-to-br from-red-50 to-white border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tranh chấp</p>
                <p className="text-3xl font-bold text-primary mt-2">{disputeStats?.total || 0}</p>
              </div>
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                <FiAlertCircle className="text-2xl text-red-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Orders by Status */}
          <div className="panel">
            <h2 className="text-xl font-bold mb-4">Đơn hàng theo trạng thái</h2>
            {ordersByStatus && ordersByStatus.length > 0 ? (
              <div className="space-y-3">
                {ordersByStatus.map((item: any) => (
                  <div key={item._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium capitalize">{item._id}</span>
                    <span className="text-lg font-bold text-secondary">{item.count}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Không có dữ liệu</p>
            )}
          </div>

          {/* Dispute Stats */}
          <div className="panel">
            <h2 className="text-xl font-bold mb-4">Thống kê tranh chấp</h2>
            {disputeStats ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="font-medium">Chờ xử lý</span>
                  <span className="text-lg font-bold text-yellow-600">{disputeStats.pending || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium">Đang xem xét</span>
                  <span className="text-lg font-bold text-blue-600">{disputeStats.reviewing || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium">Đã giải quyết</span>
                  <span className="text-lg font-bold text-green-600">{disputeStats.resolved || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <span className="font-medium">Đã từ chối</span>
                  <span className="text-lg font-bold text-red-600">{disputeStats.rejected || 0}</span>
                </div>
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Không có dữ liệu</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="panel">
          <h2 className="text-xl font-bold mb-4">Sản phẩm bán chạy</h2>
          {topProducts && topProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-styled">
                <thead>
                  <tr>
                    <th>Tên sản phẩm</th>
                    <th>Giá</th>
                    <th>Đánh giá</th>
                    <th>Tồn kho</th>
                  </tr>
                </thead>
                <tbody>
                  {topProducts.map((product: any) => (
                    <tr key={product._id}>
                      <td className="font-semibold">{product.name}</td>
                      <td>{product.price.toLocaleString('vi-VN')}₫</td>
                      <td>
                        <span className="flex items-center gap-1">
                          ⭐ {product.rating?.toFixed(1) || '0.0'}
                        </span>
                      </td>
                      <td>{product.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">Không có dữ liệu</p>
          )}
        </div>

        {/* Order Stats Chart */}
        {orderStats && orderStats.length > 0 && (
          <div className="panel">
            <h2 className="text-xl font-bold mb-4">Thống kê đơn hàng 30 ngày qua</h2>
            <div className="space-y-2">
              {orderStats.slice(-7).map((stat: any) => (
                <div key={stat._id} className="flex items-center gap-4">
                  <span className="w-24 text-sm text-gray-600">{stat._id}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="bg-secondary h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${(stat.count / Math.max(...orderStats.map((s: any) => s.count))) * 100}%` }}
                    >
                      <span className="text-xs text-white font-medium">{stat.count}</span>
                    </div>
                  </div>
                  <span className="w-24 text-right text-sm font-medium">
                    {stat.revenue?.toLocaleString('vi-VN') || '0'}₫
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

