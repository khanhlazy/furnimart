'use client';

import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@store/authStore';
import { orderService } from '@services/orderService';
import Link from 'next/link';
import { FiArrowRight } from 'react-icons/fi';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { Order } from '@types';

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
  shipped: { label: 'Đang giao', color: 'bg-purple-100 text-purple-800' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-800' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-800' },
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, hasHydrated } = useAuthStore();

  useEffect(() => {
    if (hasHydrated && !user && typeof window !== 'undefined') {
      router.push('/auth/login?redirect=/orders');
    }
  }, [user, hasHydrated, router]);

  const { data: orders, isLoading } = useQuery<Order[]>(
    ['myOrders'],
    () => orderService.getMyOrders(),
    { enabled: !!user && hasHydrated },
  );

  if (!hasHydrated) {
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

  if (!user) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="flex-1 section-shell flex items-center justify-center">
          <div className="empty-state">
            <p className="text-gray-600 mb-4">Vui lòng đăng nhập để xem đơn hàng</p>
            <Link href="/auth/login" className="inline-link">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const orderList = orders || [];

  return (
    <div className="page-shell">
      <Navbar />

      <header className="hero-banner">
        <div className="section-shell relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="pill mb-3 inline-flex">Đơn hàng</p>
            <h1 className="text-3xl font-bold text-white">Đơn hàng của tôi</h1>
            <p className="text-gray-100/90">Theo dõi trạng thái giao hàng và chi tiết hóa đơn</p>
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 text-white hover:text-white/90">
            Tiếp tục mua sắm <FiArrowRight />
          </Link>
        </div>
      </header>

      <div className="section-shell py-10 flex-1">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        ) : orderList.length === 0 ? (
          <div className="empty-state">
            <p className="text-gray-600 text-lg mb-4">Bạn chưa có đơn hàng nào</p>
            <Link href="/products" className="inline-link">
              Bắt đầu mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orderList.map((order) => (
              <div key={order._id} className="panel hover:shadow-2xl transition">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4">
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

                    <p className="text-sm text-gray-600">
                      Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                    </p>

                    <div className="text-sm text-gray-600">
                      <p>Sản phẩm: {order.items.map((i) => `${i.productName} (x${i.quantity})`).join(', ')}</p>
                    </div>
                  </div>

                  <div className="text-right space-y-3">
                    <p className="text-2xl font-bold text-secondary">
                      {(order.totalPrice || order.total || 0).toLocaleString('vi-VN')} VNĐ
                    </p>
                    <Link
                      href={`/orders/${order._id}`}
                      className="btn-primary inline-flex items-center gap-2"
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

      <Footer />
    </div>
  );
}
