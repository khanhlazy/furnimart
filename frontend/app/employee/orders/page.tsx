'use client';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { orderService } from '@services/orderService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import { toast } from 'react-toastify';
import Link from 'next/link';

export default function EmployeeOrdersPage() {
  const { user, isLoading } = useRequireAuth({ requiredRole: ['employee', 'admin'] });
  const queryClient = useQueryClient();

  const { data: orders = [], error: ordersError, isLoading: ordersLoading } = useQuery(
    ['orders', 'all'],
    () => orderService.getAll(),
    { 
      enabled: !isLoading && (user?.role === 'employee' || user?.role === 'admin'),
      retry: 1,
      onError: (error: any) => {
        console.error('Error fetching orders:', error);
      }
    }
  );

  const updateStatusMutation = useMutation(
    ({ orderId, status }: { orderId: string; status: string }) =>
      orderService.updateStatus(orderId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['orders']);
        toast.success('Cập nhật trạng thái thành công');
      },
    }
  );

  const handleStatusUpdate = (orderId: string, status: string) => {
    updateStatusMutation.mutate({ orderId, status });
  };

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
          <h1 className="text-3xl md:text-4xl font-bold text-white">Quản lý đơn hàng</h1>
          <p className="text-gray-100/90">Xử lý và cập nhật trạng thái đơn hàng</p>
        </div>
      </header>
      <div className="section-shell py-10">
        <h1 className="text-3xl font-bold mb-6">Quản lý đơn hàng</h1>
        
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
                  <td>{order.customerId}</td>
                  <td className="font-bold">{(order.totalPrice || order.total || 0).toLocaleString('vi-VN')}₫</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className="px-2 py-1 border rounded"
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="processing">Đang xử lý</option>
                      <option value="shipped">Đã gửi hàng</option>
                    </select>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <Link href={`/employee/orders/${order._id}`} className="text-secondary hover:underline">
                      Chi tiết
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

