'use client';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { shippingService } from '@services/shippingService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import { toast } from 'react-toastify';
import { FiCheck, FiPackage } from 'react-icons/fi';
import Link from 'next/link';

export default function ShipperOrdersPage() {
  const { user, isLoading } = useRequireAuth({ requiredRole: ['shipper', 'admin'] });
  const queryClient = useQueryClient();

  const { data: deliveries = [] } = useQuery<any[]>(
    ['my-deliveries'],
    () => shippingService.getMyDeliveries(),
    { enabled: !isLoading && (user?.role === 'shipper' || user?.role === 'admin') }
  );

  const updateMutation = useMutation(
    ({ orderId, data }: { orderId: string; data: any }) =>
      shippingService.updateStatus(orderId, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['my-deliveries']);
        toast.success('Cập nhật thành công');
      },
    }
  );

  const handleStatusUpdate = (orderId: string, status: string) => {
    updateMutation.mutate({ orderId, data: { status } });
  };

  const handleDeliveryComplete = (orderId: string, image: string, signature: string) => {
    updateMutation.mutate({
      orderId,
      data: {
        status: 'delivered',
        proofOfDeliveryImage: image,
        customerSignature: signature,
      },
    });
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

  if (!user || !['shipper', 'admin'].includes(user.role)) {
    return null;
  }

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      assigned: 'Đã phân công',
      picked_up: 'Đã lấy hàng',
      in_transit: 'Đang vận chuyển',
      out_for_delivery: 'Đang giao',
      delivered: 'Đã giao',
    };
    return statusMap[status] || status;
  };

  return (
    <div className="page-shell">
      <Navbar />
      
      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Shipper</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Quản lý đơn hàng giao</h1>
          <p className="text-gray-100/90">Cập nhật trạng thái và hoàn thành giao hàng</p>
        </div>
      </header>

      <div className="section-shell py-10">
        {deliveries.length === 0 ? (
          <div className="panel text-center py-12">
            <FiPackage className="text-6xl mx-auto mb-4 opacity-20 text-gray-400" />
            <p className="text-lg text-gray-500">Chưa có đơn hàng nào được phân công</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {deliveries.map((delivery: any) => (
              <div key={delivery._id} className="panel p-6 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h3 className="text-xl font-bold">
                        Đơn hàng #{delivery.orderId?.slice(-8)?.toUpperCase() || 'N/A'}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        delivery.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        delivery.status === 'out_for_delivery' ? 'bg-yellow-100 text-yellow-800' :
                        delivery.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getStatusLabel(delivery.status)}
                      </span>
                    </div>
                    {delivery.order && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mt-4">
                        <div>
                          <p className="font-semibold text-gray-900">Tổng tiền:</p>
                          <p className="text-lg font-bold text-primary">
                            {(delivery.order.totalPrice || delivery.order.total || 0).toLocaleString('vi-VN')}₫
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Địa chỉ giao:</p>
                          <p className="max-w-xs">
                            {typeof delivery.order.shippingAddress === 'string'
                              ? delivery.order.shippingAddress
                              : delivery.order.shippingAddress
                                ? `${delivery.order.shippingAddress.street}, ${delivery.order.shippingAddress.city}`
                                : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">Số điện thoại:</p>
                          <p>{delivery.order.phone || 'N/A'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <label className="text-sm font-medium text-gray-700">Cập nhật trạng thái:</label>
                  <select
                    value={delivery.status}
                    onChange={(e) => handleStatusUpdate(delivery.orderId, e.target.value)}
                    className="px-4 py-2 border rounded-lg flex-1 max-w-xs"
                    disabled={delivery.status === 'delivered'}
                  >
                    <option value="assigned">Đã phân công</option>
                    <option value="picked_up">Đã lấy hàng</option>
                    <option value="in_transit">Đang vận chuyển</option>
                    <option value="out_for_delivery">Đang giao</option>
                    <option value="delivered">Đã giao</option>
                  </select>
                </div>
                
                {delivery.status === 'out_for_delivery' && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="font-semibold mb-3 text-yellow-900">Hoàn thành giao hàng:</p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ảnh xác nhận giao hàng (tùy chọn):
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-white hover:file:bg-yellow-600"
                        />
                      </div>
                      <button
                        onClick={() => handleDeliveryComplete(delivery.orderId, '', '')}
                        disabled={updateMutation.isLoading}
                        className="btn-primary w-full"
                      >
                        <FiCheck className="inline mr-2" />
                        {updateMutation.isLoading ? 'Đang xử lý...' : 'Xác nhận đã giao hàng'}
                      </button>
                    </div>
                  </div>
                )}

                {delivery.status === 'delivered' && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-800 font-semibold flex items-center gap-2">
                      <FiCheck className="text-green-600" />
                      Đơn hàng đã được giao thành công
                    </p>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t">
                  <Link
                    href={`/shipper/orders/${delivery.orderId}`}
                    className="text-secondary hover:underline text-sm font-medium"
                  >
                    Xem chi tiết đơn hàng →
                  </Link>
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

