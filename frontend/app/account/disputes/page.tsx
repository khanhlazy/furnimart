'use client';

import { useQuery } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { disputesService } from '@services/disputesService';
import { useAuthStore } from '@store/authStore';
import Link from 'next/link';
import { FiEye, FiAlertCircle } from 'react-icons/fi';

export default function MyDisputesPage() {
  const { user, hasHydrated } = useAuthStore();

  const { data: disputes = [], isLoading, error } = useQuery(
    ['my-disputes'],
    () => disputesService.getMyDisputes(),
    { enabled: !!user && hasHydrated }
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
            <p className="text-gray-600 mb-4">Vui lòng đăng nhập để xem tranh chấp</p>
            <Link href="/auth/login" className="inline-link">
              Đăng nhập ngay
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
      reviewing: { label: 'Đang xem xét', color: 'bg-blue-100 text-blue-800' },
      resolved: { label: 'Đã giải quyết', color: 'bg-green-100 text-green-800' },
      rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-800' },
      escalated: { label: 'Nâng cấp', color: 'bg-purple-100 text-purple-800' },
    };
    const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      quality: 'Chất lượng',
      damage: 'Hư hỏng',
      missing: 'Thiếu hàng',
      wrong_item: 'Sai sản phẩm',
      delivery: 'Giao hàng',
      payment: 'Thanh toán',
      other: 'Khác',
    };
    return typeMap[type] || type;
  };

  return (
    <div className="page-shell">
      <Navbar />

      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Tài khoản</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Tranh chấp của tôi</h1>
          <p className="text-gray-100/90">Theo dõi các tranh chấp đơn hàng</p>
        </div>
      </header>

      <div className="section-shell py-10">
        {isLoading ? (
          <div className="panel flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        ) : error ? (
          <div className="panel">
            <p className="text-red-600 text-center py-8">Lỗi khi tải danh sách tranh chấp. Vui lòng thử lại.</p>
          </div>
        ) : disputes.length === 0 ? (
          <div className="panel">
            <div className="empty-state">
              <FiAlertCircle className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">Bạn chưa có tranh chấp nào</p>
              <Link href="/orders" className="inline-link">
                Xem đơn hàng của tôi
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {disputes.map((dispute: any) => (
              <div key={dispute._id} className="panel hover:shadow-xl transition">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Tranh chấp #{dispute._id.slice(-8).toUpperCase()}
                      </h3>
                      {getStatusBadge(dispute.status)}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Mã đơn hàng:</span>
                        <Link 
                          href={`/orders/${dispute.orderId}`}
                          className="ml-2 font-mono text-secondary hover:underline"
                        >
                          #{dispute.orderId?.slice(-8)}
                        </Link>
                      </div>
                      <div>
                        <span className="text-gray-600">Loại:</span>
                        <span className="ml-2">{getTypeLabel(dispute.type)}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Lý do:</span>
                        <span className="ml-2">{dispute.reason}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Ngày tạo:</span>
                        <span className="ml-2">{new Date(dispute.createdAt).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                    {dispute.resolution && (
                      <div className="mt-3 p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-semibold text-green-800 mb-1">Giải pháp:</p>
                        <p className="text-sm text-green-700">{dispute.resolution}</p>
                        {dispute.refundAmount > 0 && (
                          <p className="text-sm font-bold text-green-600 mt-2">
                            Hoàn tiền: {dispute.refundAmount.toLocaleString('vi-VN')} VNĐ
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <Link
                      href={`/account/disputes/${dispute._id}`}
                      className="btn-primary inline-flex items-center gap-2"
                    >
                      <FiEye /> Chi tiết
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

