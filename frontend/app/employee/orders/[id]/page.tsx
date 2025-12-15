'use client';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams } from 'next/navigation';
import { orderService } from '@services/orderService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { toast } from 'react-toastify';
import { Order } from '@types';

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  processing: { label: 'Đang xử lý', color: 'bg-purple-100 text-purple-800' },
  shipped: { label: 'Đang giao', color: 'bg-indigo-100 text-indigo-800' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
};

export default function EmployeeOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const { user, isLoading: authLoading } = useRequireAuth({ requiredRole: ['employee', 'admin'] });
  const queryClient = useQueryClient();

  const { data: order, isLoading, error } = useQuery<Order>(
    ['order', orderId],
    () => orderService.getById(orderId),
    { enabled: !!orderId && !authLoading && (user?.role === 'employee' || user?.role === 'admin') }
  );

  const updateStatusMutation = useMutation(
    ({ orderId, status }: { orderId: string; status: string }) =>
      orderService.updateStatus(orderId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['order', orderId]);
        queryClient.invalidateQueries(['orders']);
        toast.success('Cập nhật trạng thái thành công');
      },
      onError: () => {
        toast.error('Cập nhật trạng thái thất bại');
      },
    }
  );

  const handleStatusUpdate = (status: string) => {
    updateStatusMutation.mutate({ orderId, status });
  };

  if (authLoading || isLoading) {
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

  if (error || !order) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="flex-1 section-shell flex items-center justify-center">
          <div className="empty-state">
            <p className="text-gray-600 mb-4">Không tìm thấy đơn hàng</p>
            <Link href="/employee/orders" className="inline-link">
              Quay lại danh sách đơn hàng
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
          <Link href="/employee/orders" className="inline-flex items-center gap-2 text-white hover:text-white/90 mb-4">
            <FiArrowLeft /> Quay lại
          </Link>
          <p className="pill mb-3 inline-flex">Chi tiết đơn hàng</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Đơn hàng #{order._id.slice(-8).toUpperCase()}
          </h1>
        </div>
      </header>

      <div className="section-shell py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <div className="panel">
              <h2 className="text-xl font-bold mb-4">Thông tin đơn hàng</h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trạng thái:</span>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusLabels[order.status]?.color || 'bg-gray-100'
                    }`}>
                      {statusLabels[order.status]?.label || order.status}
                    </span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(e.target.value)}
                      className="px-3 py-1 border rounded text-sm"
                      disabled={updateStatusMutation.isLoading}
                    >
                      <option value="pending">Chờ xác nhận</option>
                      <option value="confirmed">Đã xác nhận</option>
                      <option value="processing">Đang xử lý</option>
                      <option value="shipped">Đã gửi hàng</option>
                      <option value="delivered">Đã giao</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày đặt:</span>
                  <span>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức thanh toán:</span>
                  <span className="capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Đã thanh toán:</span>
                  <span>{order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã khách hàng:</span>
                  <span className="font-mono text-sm">{order.customerId}</span>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="panel">
              <h2 className="text-xl font-bold mb-4">Sản phẩm</h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b last:border-0">
                    <div>
                      <p className="font-semibold">{item.productName}</p>
                      <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                    </div>
                    <p className="font-bold">{((item.price || 0) * item.quantity).toLocaleString('vi-VN')} VNĐ</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Info */}
            <div className="panel">
              <h2 className="text-xl font-bold mb-4">Thông tin giao hàng</h2>
              <div className="space-y-2">
                <p><span className="text-gray-600">Địa chỉ:</span> {
                  typeof order.shippingAddress === 'string' 
                    ? order.shippingAddress 
                    : order.shippingAddress 
                      ? `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.province} ${order.shippingAddress.zipCode}`
                      : 'N/A'
                }</p>
                <p><span className="text-gray-600">Số điện thoại:</span> {order.phone}</p>
              </div>
              {order.notes && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-gray-600 mb-1">Ghi chú:</p>
                  <p>{order.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="panel sticky top-24">
              <h2 className="text-xl font-bold mb-4">Tóm tắt</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span>{((order.totalPrice || 0) + (order.totalDiscount || 0)).toLocaleString('vi-VN')} VNĐ</span>
                </div>
                {(order.totalDiscount || 0) > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{(order.totalDiscount || 0).toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className="text-green-600">Miễn phí</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-secondary">{(order.totalPrice || order.total || 0).toLocaleString('vi-VN')} VNĐ</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

