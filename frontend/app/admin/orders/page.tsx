'use client';

import { useQuery } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { orderService } from '@services/orderService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import Link from 'next/link';
import { FiEye } from 'react-icons/fi';

export default function AdminOrdersPage() {
  const { user, isLoading } = useRequireAuth({ requiredRole: 'admin' });

  const { data: orders = [], error: ordersError, isLoading: ordersLoading } = useQuery(
    ['orders', 'admin'],
    () => orderService.getAll(),
    { 
      enabled: !isLoading && user?.role === 'admin',
      retry: 1,
      onError: (error: any) => {
        console.error('Error fetching orders:', error);
      }
    }
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

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
      processing: { label: 'Đang xử lý', color: 'bg-purple-100 text-purple-800' },
      shipped: { label: 'Đã gửi hàng', color: 'bg-indigo-100 text-indigo-800' },
      delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
    };
    const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="page-shell">
      <Navbar />
      
      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Quản trị viên</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Quản lý đơn hàng</h1>
          <p className="text-gray-100/90">Xem và quản lý tất cả đơn hàng</p>
        </div>
      </header>

      <div className="section-shell py-10">

        {ordersLoading ? (
          <div className="panel flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        ) : ordersError ? (
          <div className="panel">
            <p className="text-red-600 text-center py-8">Lỗi khi tải danh sách đơn hàng. Vui lòng thử lại.</p>
          </div>
        ) : (
          <div className="panel overflow-hidden">
            <table className="w-full table-styled">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Tổng tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      Không có đơn hàng nào
                    </td>
                  </tr>
                ) : (
                  orders.map((order: any) => (
                    <tr key={order._id}>
                      <td className="font-mono text-sm">#{order._id.slice(-8)}</td>
                      <td>{order.customerId?.slice(-8) || '-'}</td>
                      <td className="font-bold">{(order.totalPrice || order.total || 0).toLocaleString('vi-VN')}₫</td>
                      <td>{getStatusBadge(order.status)}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <Link 
                          href={`/admin/orders/${order._id}`} 
                          className="text-secondary hover:underline inline-flex items-center gap-1"
                        >
                          <FiEye /> Chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

