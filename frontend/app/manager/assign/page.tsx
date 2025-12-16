'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { orderService } from '@services/orderService';
import { usersService } from '@services/usersService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import { toast } from 'react-toastify';
import { FiTruck, FiUser, FiPackage } from 'react-icons/fi';
import Link from 'next/link';

export default function ManagerAssignPage() {
  const { user, isLoading } = useRequireAuth({ requiredRole: ['manager', 'admin'] });
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [selectedShipper, setSelectedShipper] = useState<string>('');

  const { data: orders = [] } = useQuery<any[]>(
    ['orders', 'unassigned'],
    () => orderService.getAll({ status: 'confirmed' }),
    { enabled: !isLoading && (user?.role === 'manager' || user?.role === 'admin') }
  );

  const { data: shippers = [] } = useQuery<any[]>(
    ['users', 'shippers'],
    () => usersService.getAll(),
    { 
      enabled: !isLoading && (user?.role === 'manager' || user?.role === 'admin'),
      select: (data) => data.filter((u: any) => u.role === 'shipper' && u.isActive)
    }
  );

  const assignMutation = useMutation(
    ({ orderId, shipperId }: { orderId: string; shipperId: string }) =>
      orderService.assignShipper(orderId, shipperId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['orders']);
        toast.success('Phân công shipper thành công!');
        setSelectedOrder(null);
        setSelectedShipper('');
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Phân công thất bại');
      },
    }
  );

  const handleAssign = (orderId: string) => {
    if (!selectedShipper) {
      toast.error('Vui lòng chọn shipper');
      return;
    }
    assignMutation.mutate({ orderId, shipperId: selectedShipper });
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

  if (!user || !['manager', 'admin'].includes(user.role)) {
    return null;
  }

  const unassignedOrders = orders.filter((o: any) => !o.shipperId && o.status === 'confirmed');

  return (
    <div className="page-shell">
      <Navbar />
      
      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Quản lý</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Phân công giao hàng</h1>
          <p className="text-gray-100/90">Phân công shipper cho các đơn hàng đã xác nhận</p>
        </div>
      </header>

      <div className="section-shell py-10">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="panel p-6 bg-gradient-to-br from-yellow-50 to-white border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Đơn chờ phân công</p>
                <p className="text-3xl font-bold text-primary mt-2">{unassignedOrders.length}</p>
              </div>
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                <FiPackage className="text-2xl text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="panel p-6 bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Shipper có sẵn</p>
                <p className="text-3xl font-bold text-primary mt-2">{shippers.length}</p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                <FiUser className="text-2xl text-blue-600" />
              </div>
            </div>
          </div>

          <div className="panel p-6 bg-gradient-to-br from-green-50 to-white border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Tổng đơn đã xác nhận</p>
                <p className="text-3xl font-bold text-primary mt-2">{orders.length}</p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                <FiTruck className="text-2xl text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="panel">
          <h2 className="text-xl font-bold mb-6">Đơn hàng chờ phân công</h2>
          
          {unassignedOrders.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FiPackage className="text-6xl mx-auto mb-4 opacity-20" />
              <p className="text-lg">Không có đơn hàng nào cần phân công</p>
            </div>
          ) : (
            <div className="space-y-4">
              {unassignedOrders.map((order: any) => (
                <div
                  key={order._id}
                  className="border rounded-lg p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-2">
                        <h3 className="text-lg font-bold">
                          Đơn hàng #{order._id.slice(-8).toUpperCase()}
                        </h3>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          Đã xác nhận
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <p className="font-semibold text-gray-900">Tổng tiền:</p>
                          <p className="text-lg font-bold text-primary">
                            {(order.totalPrice || order.total || 0).toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Địa chỉ giao:</p>
                          <p className="max-w-xs">
                            {typeof order.shippingAddress === 'string'
                              ? order.shippingAddress
                              : order.shippingAddress
                                ? `${order.shippingAddress.street}, ${order.shippingAddress.city}`
                                : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Số điện thoại:</p>
                          <p>{order.phone || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedOrder === order._id ? (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Chọn Shipper:
                      </label>
                      <select
                        value={selectedShipper}
                        onChange={(e) => setSelectedShipper(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg mb-3"
                      >
                        <option value="">-- Chọn shipper --</option>
                        {shippers.map((shipper: any) => (
                          <option key={shipper._id || shipper.id} value={shipper._id || shipper.id}>
                            {shipper.name} - {shipper.phone || 'N/A'}
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAssign(order._id)}
                          disabled={assignMutation.isLoading || !selectedShipper}
                          className="btn-primary flex-1"
                        >
                          {assignMutation.isLoading ? 'Đang xử lý...' : 'Xác nhận phân công'}
                        </button>
                        <button
                          onClick={() => {
                            setSelectedOrder(null);
                            setSelectedShipper('');
                          }}
                          className="btn-secondary"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedOrder(order._id);
                          setSelectedShipper('');
                        }}
                        className="btn-primary"
                      >
                        <FiTruck className="inline mr-2" />
                        Phân công shipper
                      </button>
                      <Link
                        href={`/manager/orders/${order._id}`}
                        className="btn-secondary"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

