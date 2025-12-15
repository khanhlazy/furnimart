'use client';

import { useQuery } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { orderService } from '@services/orderService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import Link from 'next/link';
import { FiPackage, FiTruck, FiCheckCircle, FiClock } from 'react-icons/fi';

export default function ShipperDashboard() {
  const { user, isLoading } = useRequireAuth({ requiredRole: ['shipper', 'admin'] });

  const { data: orders = [] } = useQuery<any[]>(
    ['orders', 'shipper'],
    () => orderService.getAll(),
    { enabled: !isLoading && (user?.role === 'shipper' || user?.role === 'admin') }
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

  if (!user || !['shipper', 'admin'].includes(user.role)) {
    return null;
  }

  const pendingOrders = orders.filter((o: any) => o.status === 'confirmed' || o.status === 'shipped');
  const deliveredOrders = orders.filter((o: any) => o.status === 'delivered');
  const totalRevenue = deliveredOrders.reduce((sum: number, o: any) => sum + o.totalPrice, 0);

  return (
    <div className="page-shell">
      <Navbar />
      
      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Shipper</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Dashboard Shipper</h1>
          <p className="text-gray-100/90">
            Quản lý đơn hàng và theo dõi tiến độ giao hàng
          </p>
        </div>
      </header>

      <div className="section-shell py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Link href="/shipper/orders" className="panel hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Tổng đơn hàng</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <FiPackage className="text-4xl text-secondary opacity-20" />
            </div>
          </Link>

          <Link href="/shipper/orders?status=shipped" className="panel hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Đang giao</p>
                <p className="text-2xl font-bold">{pendingOrders.length}</p>
              </div>
              <FiTruck className="text-4xl text-blue-500 opacity-20" />
            </div>
          </Link>

          <Link href="/shipper/orders?status=delivered" className="panel hover:shadow-xl transition-all hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Đã giao</p>
                <p className="text-2xl font-bold">{deliveredOrders.length}</p>
              </div>
              <FiCheckCircle className="text-4xl text-green-500 opacity-20" />
            </div>
          </Link>

          <div className="panel">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Tổng doanh thu</p>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString('vi-VN')}₫</p>
              </div>
              <FiClock className="text-4xl text-yellow-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="panel">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Đơn hàng gần đây</h2>
            <Link href="/shipper/orders" className="text-secondary hover:underline">
              Xem tất cả →
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Chưa có đơn hàng nào
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-styled">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Địa chỉ giao</th>
                    <th>Tổng tiền</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((order: any) => (
                    <tr key={order._id}>
                      <td className="font-mono text-sm">#{order._id.slice(-8)}</td>
                      <td className="max-w-xs truncate">{
                        typeof order.shippingAddress === 'string' 
                          ? order.shippingAddress 
                          : order.shippingAddress 
                            ? `${order.shippingAddress.street}, ${order.shippingAddress.city}`
                            : 'N/A'
                      }</td>
                      <td className="font-bold">{(order.totalPrice || order.total || 0).toLocaleString('vi-VN')}₫</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status === 'delivered' ? 'Đã giao' :
                           order.status === 'shipped' ? 'Đang giao' :
                           'Chờ xác nhận'}
                        </span>
                      </td>
                      <td>
                        <Link 
                          href={`/shipper/orders/${order._id}`} 
                          className="text-secondary hover:underline"
                        >
                          Chi tiết
                        </Link>
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

