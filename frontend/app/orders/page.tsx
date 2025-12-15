'use client';

import { useQuery } from 'react-query';
import { useAuthStore } from '@store/authStore';
import { orderService } from '@services/orderService';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';

interface Order {
  _id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  items: Array<{ productName: string; quantity: number }>;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
};

export default function OrdersPage() {
  const { user } = useAuthStore();

  const { data: response, isLoading } = useQuery(
    ['myOrders'],
    () => orderService.getMyOrders(),
    { enabled: !!user },
  );

  const orders: Order[] = response?.data || [];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Vui lòng đăng nhập để xem đơn hàng</p>
          <Link href="/auth/login" className="text-secondary hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Đơn hàng của tôi</h1>
          <Link href="/products" className="text-secondary hover:text-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Bạn chưa có đơn hàng nào</p>
            <Link href="/products" className="text-secondary hover:underline">
              Bắt đầu mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Đơn hàng #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          statusLabels[order.status]?.color || 'bg-gray-100'
                        }`}
                      >
                        {statusLabels[order.status]?.label || order.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </p>

                    <div className="text-sm text-gray-600">
                      <p>Sản phẩm: {order.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-secondary mb-4">
                      {order.totalPrice.toLocaleString('vi-VN')} VNĐ
                    </p>
                    <Link
                      href={`/orders/${order._id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded hover:bg-yellow-600 transition"
                    >
                      Chi tiết <FiArrowRight />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
