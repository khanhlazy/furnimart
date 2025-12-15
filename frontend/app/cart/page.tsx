'use client';

import { useCartStore } from '@store/cartStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiTrash2, FiArrowLeft } from 'react-icons/fi';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push('/checkout');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/products" className="flex items-center gap-2 text-secondary hover:text-primary">
            <FiArrowLeft /> Tiếp tục mua sắm
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Giỏ hàng của bạn đang trống</p>
            <Link href="/products" className="text-secondary hover:underline">
              Quay lại mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Sản phẩm</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Giá</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">Số lượng</th>
                    <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Thành tiền</th>
                    <th className="px-6 py-3 text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.productId} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex gap-4">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Mã: {item.productId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {item.price.toLocaleString('vi-VN')} VNĐ
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center border border-gray-300 rounded w-fit mx-auto">
                          <button
                            onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value) || 1)}
                            className="w-12 text-center border-l border-r border-gray-300"
                          />
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right font-semibold">
                        {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FiTrash2 size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-lg shadow p-6 h-fit">
              <h2 className="text-xl font-bold text-primary mb-6">Tóm tắt đơn hàng</h2>

              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span className="text-gray-600">Số lượng:</span>
                  <span className="font-semibold">{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tạm tính:</span>
                  <span className="font-semibold">{getTotalPrice().toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span className="font-semibold text-accent">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-primary mb-6">
                <span>Tổng cộng:</span>
                <span>{getTotalPrice().toLocaleString('vi-VN')} VNĐ</span>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-yellow-600 transition font-semibold"
                >
                  Tiến hành thanh toán
                </button>
                <button
                  onClick={() => router.push('/products')}
                  className="w-full border border-secondary text-secondary py-3 rounded-lg hover:bg-secondary hover:text-white transition font-semibold"
                >
                  Tiếp tục mua sắm
                </button>
                <button
                  onClick={clearCart}
                  className="w-full text-red-500 hover:text-red-700 py-2"
                >
                  Xóa giỏ hàng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
