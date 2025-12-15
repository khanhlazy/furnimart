'use client';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useParams } from 'next/navigation';
import { disputesService } from '@services/disputesService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FiArrowLeft, FiCheck, FiX } from 'react-icons/fi';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { useState } from 'react';

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

export default function AdminDisputeDetailPage() {
  const params = useParams();
  const disputeId = params.id as string;
  const { user, isLoading: authLoading } = useRequireAuth({ requiredRole: 'admin' });
  const queryClient = useQueryClient();
  const [reviewNote, setReviewNote] = useState('');
  const [resolution, setResolution] = useState('');
  const [refundAmount, setRefundAmount] = useState(0);

  const { data: dispute, isLoading, error } = useQuery<Dispute>(
    ['dispute', disputeId],
    () => disputesService.getById(disputeId),
    { enabled: !!disputeId && !authLoading && user?.role === 'admin' }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: any }) => disputesService.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['dispute', disputeId]);
        queryClient.invalidateQueries(['disputes']);
        toast.success('Cập nhật tranh chấp thành công');
        setReviewNote('');
        setResolution('');
        setRefundAmount(0);
      },
    }
  );

  const handleResolve = () => {
    if (!resolution.trim()) {
      toast.error('Vui lòng nhập giải pháp');
      return;
    }
    updateMutation.mutate({
      id: disputeId,
      data: {
        status: 'resolved',
        resolution,
        refundAmount,
        reviewNote,
        resolvedAt: new Date().toISOString(),
      },
    });
  };

  const handleReject = () => {
    if (!reviewNote.trim()) {
      toast.error('Vui lòng nhập lý do từ chối');
      return;
    }
    updateMutation.mutate({
      id: disputeId,
      data: {
        status: 'rejected',
        reviewNote,
      },
    });
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

  if (!user || user.role !== 'admin') {
    return null;
  }

  if (error || !dispute) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="flex-1 section-shell flex items-center justify-center">
          <div className="empty-state">
            <p className="text-gray-600 mb-4">Không tìm thấy tranh chấp</p>
            <Link href="/admin/disputes" className="inline-link">
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
          <Link href="/admin/disputes" className="inline-flex items-center gap-2 text-white hover:text-white/90 mb-4">
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
                  <Link href={`/admin/orders/${dispute.orderId}`} className="font-mono text-sm text-secondary hover:underline">
                    #{dispute.orderId.slice(-8)}
                  </Link>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Khách hàng:</span>
                  <span>{dispute.customerName}</span>
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
              <div className="panel">
                <h2 className="text-xl font-bold mb-4">Giải pháp</h2>
                <p className="text-gray-700">{dispute.resolution}</p>
                {dispute.refundAmount > 0 && (
                  <p className="mt-2 text-lg font-bold text-green-600">
                    Hoàn tiền: {dispute.refundAmount.toLocaleString('vi-VN')} VNĐ
                  </p>
                )}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            {dispute.status === 'pending' || dispute.status === 'reviewing' ? (
              <div className="panel sticky top-24 space-y-4">
                <h2 className="text-xl font-bold mb-4">Xử lý tranh chấp</h2>
                
                <div>
                  <label className="form-label">Ghi chú</label>
                  <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    rows={3}
                    className="input-field"
                    placeholder="Nhập ghi chú xử lý..."
                  />
                </div>

                <div>
                  <label className="form-label">Giải pháp (nếu giải quyết)</label>
                  <textarea
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    rows={3}
                    className="input-field"
                    placeholder="Nhập giải pháp..."
                  />
                </div>

                <div>
                  <label className="form-label">Số tiền hoàn lại (VNĐ)</label>
                  <input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(Number(e.target.value))}
                    className="input-field"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleResolve}
                    disabled={updateMutation.isLoading}
                    className="btn-primary flex-1 flex items-center justify-center gap-2"
                  >
                    <FiCheck /> Giải quyết
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={updateMutation.isLoading}
                    className="btn-secondary flex-1 flex items-center justify-center gap-2"
                  >
                    <FiX /> Từ chối
                  </button>
                </div>
              </div>
            ) : (
              <div className="panel sticky top-24">
                <h2 className="text-xl font-bold mb-4">Thông tin xử lý</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${
                      statusLabels[dispute.status]?.color || 'bg-gray-100'
                    }`}>
                      {statusLabels[dispute.status]?.label || dispute.status}
                    </span>
                  </div>
                  {dispute.resolvedAt && (
                    <div>
                      <span className="text-gray-600">Ngày giải quyết:</span>
                      <p>{new Date(dispute.resolvedAt).toLocaleDateString('vi-VN')}</p>
                    </div>
                  )}
                  {dispute.refundAmount > 0 && (
                    <div>
                      <span className="text-gray-600">Hoàn tiền:</span>
                      <p className="text-lg font-bold text-green-600">
                        {dispute.refundAmount.toLocaleString('vi-VN')} VNĐ
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

