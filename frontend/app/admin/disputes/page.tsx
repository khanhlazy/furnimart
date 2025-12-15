'use client';

import { useQuery } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { disputesService } from '@services/disputesService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import Link from 'next/link';

export default function AdminDisputesPage() {
  const { user, isLoading } = useRequireAuth({ requiredRole: 'admin' });
  const [statusFilter, setStatusFilter] = useState<string>('');

  const { data: disputes = [], error: disputesError, isLoading: disputesLoading } = useQuery(
    ['disputes', 'admin', statusFilter],
    () => disputesService.getAll(statusFilter || undefined),
    { 
      enabled: !isLoading && user?.role === 'admin',
      retry: 1,
      onError: (error: any) => {
        console.error('Error fetching disputes:', error);
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
      <div className="section-shell py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Quản lý tranh chấp</h1>
          <div className="flex gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="pending">Chờ xử lý</option>
              <option value="reviewing">Đang xem xét</option>
              <option value="resolved">Đã giải quyết</option>
              <option value="rejected">Đã từ chối</option>
            </select>
          </div>
        </div>

        {disputesLoading ? (
          <div className="panel flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        ) : disputesError ? (
          <div className="panel">
            <p className="text-red-600 text-center py-8">Lỗi khi tải danh sách tranh chấp. Vui lòng thử lại.</p>
          </div>
        ) : (
          <div className="panel overflow-hidden">
            <table className="w-full table-styled">
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Khách hàng</th>
                  <th>Loại</th>
                  <th>Lý do</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {disputes.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      Không có tranh chấp nào
                    </td>
                  </tr>
                ) : (
                  disputes.map((dispute: any) => (
                    <tr key={dispute._id}>
                      <td className="font-mono text-sm">#{dispute.orderId?.slice(-8) || '-'}</td>
                      <td>{dispute.customerName}</td>
                      <td>{getTypeLabel(dispute.type)}</td>
                      <td className="max-w-xs truncate">{dispute.reason}</td>
                      <td>{getStatusBadge(dispute.status)}</td>
                      <td>{new Date(dispute.createdAt).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <div className="flex gap-2">
                          <Link 
                            href={`/admin/disputes/${dispute._id}`} 
                            className="text-secondary hover:underline inline-flex items-center gap-1"
                          >
                            <FiEye /> Chi tiết
                          </Link>
                        </div>
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

