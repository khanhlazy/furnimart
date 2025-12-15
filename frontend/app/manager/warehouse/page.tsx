'use client';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { warehouseService } from '@services/warehouseService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { FiPackage, FiAlertTriangle, FiEdit } from 'react-icons/fi';

export default function ManagerWarehousePage() {
  const { user, isLoading } = useRequireAuth({ requiredRole: ['manager', 'admin'] });
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [adjustForm, setAdjustForm] = useState({ quantity: 0, reason: '' });

  const { data: warehouseItems = [], isLoading: itemsLoading } = useQuery(
    ['warehouse'],
    () => warehouseService.getAll(),
    { enabled: !isLoading && (user?.role === 'manager' || user?.role === 'admin') }
  );

  const { data: lowStockItems = [] } = useQuery(
    ['warehouse', 'low-stock'],
    () => warehouseService.getLowStock(10),
    { enabled: !isLoading && (user?.role === 'manager' || user?.role === 'admin') }
  );

  const adjustStockMutation = useMutation(
    ({ id, data }: { id: string; data: any }) => warehouseService.adjustStock(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['warehouse']);
        toast.success('Điều chỉnh tồn kho thành công');
        setIsModalOpen(false);
        setAdjustForm({ quantity: 0, reason: '' });
        setSelectedItem(null);
      },
      onError: () => {
        toast.error('Điều chỉnh tồn kho thất bại');
      },
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

  if (!user || !['manager', 'admin'].includes(user.role)) {
    return null;
  }

  const handleAdjustStock = (item: any) => {
    setSelectedItem(item);
    setAdjustForm({ quantity: item.quantity, reason: '' });
    setIsModalOpen(true);
  };

  const submitAdjustStock = () => {
    if (!selectedItem || !adjustForm.reason.trim()) {
      toast.error('Vui lòng nhập lý do điều chỉnh');
      return;
    }
    adjustStockMutation.mutate({
      id: selectedItem._id,
      data: {
        quantity: adjustForm.quantity,
        reason: adjustForm.reason,
      },
    });
  };

  return (
    <div className="page-shell">
      <Navbar />

      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Quản lý</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Quản lý kho hàng</h1>
          <p className="text-gray-100/90">Theo dõi và điều chỉnh tồn kho</p>
        </div>
      </header>

      <div className="section-shell py-10">
        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="panel bg-yellow-50 border-l-4 border-yellow-500 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <FiAlertTriangle className="text-yellow-600 text-xl" />
              <h2 className="text-lg font-bold text-yellow-800">Cảnh báo sắp hết hàng</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {lowStockItems.slice(0, 3).map((item: any) => (
                <div key={item._id} className="bg-white p-4 rounded-lg border border-yellow-200">
                  <p className="font-semibold text-gray-900">{item.productName || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Tồn kho: <span className="font-bold text-red-600">{item.quantity}</span></p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warehouse Items Table */}
        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Danh sách tồn kho</h2>
            <div className="text-sm text-gray-600">
              Tổng: <span className="font-bold">{warehouseItems.length}</span> sản phẩm
            </div>
          </div>

          {itemsLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            </div>
          ) : warehouseItems.length === 0 ? (
            <div className="text-center py-12">
              <FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Chưa có sản phẩm trong kho</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-styled">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Tồn kho</th>
                    <th>Đã đặt trước</th>
                    <th>Có sẵn</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {warehouseItems.map((item: any) => {
                    const available = item.quantity - (item.reservedQuantity || 0);
                    const isLowStock = available < 10;
                    return (
                      <tr key={item._id}>
                        <td className="font-semibold">{item.productName || item.productId || 'N/A'}</td>
                        <td>{item.quantity}</td>
                        <td>{item.reservedQuantity || 0}</td>
                        <td>
                          <span className={isLowStock ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}>
                            {available}
                          </span>
                        </td>
                        <td>
                          {isLowStock ? (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Sắp hết
                            </span>
                          ) : (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                              Đủ hàng
                            </span>
                          )}
                        </td>
                        <td>
                          <button
                            onClick={() => handleAdjustStock(item)}
                            className="text-secondary hover:text-yellow-600 inline-flex items-center gap-1"
                          >
                            <FiEdit /> Điều chỉnh
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Adjust Stock Modal */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Điều chỉnh tồn kho</h2>
            <div className="space-y-4">
              <div>
                <label className="form-label">Sản phẩm</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  {selectedItem.productName || selectedItem.productId || 'N/A'}
                </div>
              </div>
              <div>
                <label className="form-label">Số lượng hiện tại</label>
                <div className="p-3 bg-gray-50 rounded-lg font-semibold">
                  {selectedItem.quantity}
                </div>
              </div>
              <div>
                <label className="form-label">Số lượng mới</label>
                <input
                  type="number"
                  value={adjustForm.quantity}
                  onChange={(e) => setAdjustForm({ ...adjustForm, quantity: Number(e.target.value) })}
                  className="input-field"
                  min="0"
                />
              </div>
              <div>
                <label className="form-label">Lý do điều chỉnh</label>
                <textarea
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                  rows={3}
                  className="input-field"
                  placeholder="Nhập lý do điều chỉnh..."
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={submitAdjustStock}
                  disabled={adjustStockMutation.isLoading}
                  className="btn-primary flex-1"
                >
                  {adjustStockMutation.isLoading ? 'Đang xử lý...' : 'Xác nhận'}
                </button>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedItem(null);
                    setAdjustForm({ quantity: 0, reason: '' });
                  }}
                  className="btn-secondary flex-1"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

