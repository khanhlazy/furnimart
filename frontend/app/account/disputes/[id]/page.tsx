'use client';

import { useQuery } from 'react-query';
import { useParams } from 'next/navigation';
import { disputesService } from '@services/disputesService';
import { useAuthStore } from '@store/authStore';
import Link from 'next/link';
import { FiArrowLeft } from 'react-icons/fi';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

interface Dispute {
  _id: string;
  orderId: string;
  customerId: string;
  customerName: string;
  type: string;
  reason: string;
  description: string;
  images: string[];
  status: string;
  reviewedBy?: string;
  reviewNote?: string;
  resolution?: string;
  refundAmount: number;
  createdAt: string;
  resolvedAt?: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
  reviewing: { label: 'Đang xem xét', color: 'bg-blue-100 text-blue-800' },
  resolved: { label: 'Đã giải quyết', color: 'bg-green-100 text-green-800' },
  rejected: { label: 'Đã từ chối', color: 'bg-red-100 text-red-800' },
  escalated: { label: 'Nâng cấp', color: 'bg-purple-100 text-purple-800' },
};

const typeLabels: Record<string, string> = {
  quality: 'Chất lượng',
  damage: 'Hư hỏng',
  missing: 'Thiếu hàng',
  wrong_item: 'Sai sản phẩm',
  delivery: 'Giao hàng',
  payment: 'Thanh toán',
  other: 'Khác',
};

export default function MyDisputeDetailPage() {
  const params = useParams();
  const disputeId = params.id as string;
  const { user, hasHydrated } = useAuthStore();

  const { data: dispute, isLoading, error } = useQuery<Dispute>(
    ['dispute', disputeId],
    () => disputesService.getById(disputeId),
    { enabled: !!disputeId && hasHydrated && !!user }
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

  if (error || !dispute) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="flex-1 section-shell flex items-center justify-center">
          <div className="empty-state">
            <p className="text-gray-600 mb-4">Không tìm thấy tranh chấp</p>
            <Link href="/account/disputes" className="inline-link">
              Quay lại danh sách tranh chấp
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
          <Link href="/account/disputes" className="inline-flex items-center gap-2 text-white hover:text-white/90 mb-4">
            <FiArrowLeft /> Quay lại
          </Link>
          <p className="pill mb-3 inline-flex">Chi tiết tranh chấp</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Tranh chấp #{dispute._id.slice(-8).toUpperCase()}
          </h1>
        </div>
      </header>

      <div className="section-shell py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="panel">
              <h2 className="text-xl font-bold mb-4">Thông tin tranh chấp</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    statusLabels[dispute.status]?.color || 'bg-gray-100'
                  }`}>
                    {statusLabels[dispute.status]?.label || dispute.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã đơn hàng:</span>
                  <Link href={`/orders/${dispute.orderId}`} className="font-mono text-sm text-secondary hover:underline">
                    #{dispute.orderId.slice(-8)}
                  </Link>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Loại tranh chấp:</span>
                  <span>{typeLabels[dispute.type] || dispute.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lý do:</span>
                  <span>{dispute.reason}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày tạo:</span>
                  <span>{new Date(dispute.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                {dispute.resolvedAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày giải quyết:</span>
                    <span>{new Date(dispute.resolvedAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="panel">
              <h2 className="text-xl font-bold mb-4">Mô tả chi tiết</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{dispute.description}</p>
            </div>

            {dispute.images && dispute.images.length > 0 && (
              <div className="panel">
                <h2 className="text-xl font-bold mb-4">Hình ảnh bằng chứng</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {dispute.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Bằng chứng ${index + 1}`}
                      className="w-full h-48 object-cover rounded-lg border"
                    />
                  ))}
                </div>
              </div>
            )}

            {dispute.reviewNote && (
              <div className="panel">
                <h2 className="text-xl font-bold mb-4">Ghi chú xử lý</h2>
                <p className="text-gray-700">{dispute.reviewNote}</p>
              </div>
            )}

            {dispute.resolution && (
              <div className="panel bg-green-50 border-green-200">
                <h2 className="text-xl font-bold mb-4 text-green-800">Giải pháp</h2>
                <p className="text-gray-700 mb-4">{dispute.resolution}</p>
                {dispute.refundAmount > 0 && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <p className="text-lg font-bold text-green-600">
                      Hoàn tiền: {dispute.refundAmount.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="panel sticky top-24">
              <h2 className="text-xl font-bold mb-4">Thông tin</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-gray-600">Trạng thái:</span>
                  <div className="mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      statusLabels[dispute.status]?.color || 'bg-gray-100'
                    }`}>
                      {statusLabels[dispute.status]?.label || dispute.status}
                    </span>
                  </div>
                </div>
                {dispute.resolvedAt && (
                  <div>
                    <span className="text-gray-600">Ngày giải quyết:</span>
                    <p className="mt-1">{new Date(dispute.resolvedAt).toLocaleDateString('vi-VN')}</p>
                  </div>
                )}
                {dispute.refundAmount > 0 && (
                  <div>
                    <span className="text-gray-600">Hoàn tiền:</span>
                    <p className="mt-1 text-lg font-bold text-green-600">
                      {dispute.refundAmount.toLocaleString('vi-VN')} VNĐ
                    </p>
                  </div>
                )}
                <div className="pt-4 border-t">
                  <Link
                    href={`/orders/${dispute.orderId}`}
                    className="btn-primary w-full text-center inline-block"
                  >
                    Xem đơn hàng
                  </Link>
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

