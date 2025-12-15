'use client';

import { useCartStore } from '@store/cartStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiTrash2, FiArrowLeft } from 'react-icons/fi';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const router = useRouter();

  const handleCheckout = () => {
    if (items.length === 0) return;
    router.push('/checkout');
  };

  return (
    <div className="page-shell">
      <Navbar />

      <header className="hero-banner">
        <div className="section-shell relative z-10 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="pill mb-3 inline-flex">Giỏ hàng</p>
            <h1 className="text-3xl font-bold text-white">Đơn hàng của bạn</h1>
            <p className="text-gray-100/90">Kiểm tra lại sản phẩm trước khi thanh toán</p>
          </div>
          <Link href="/products" className="inline-flex items-center gap-2 text-white hover:text-white/90">
            <FiArrowLeft /> Tiếp tục mua sắm
          </Link>
        </div>
      </header>

      <div className="section-shell py-10 flex-1">
        {items.length === 0 ? (
          <div className="empty-state">
            <p className="text-gray-600 text-lg mb-4">Giỏ hàng của bạn đang trống</p>
            <Link href="/products" className="inline-link">
              Quay lại mua sắm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 panel overflow-hidden">
              <table className="w-full table-styled">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th className="text-center">Giá</th>
                    <th className="text-center">Số lượng</th>
                    <th className="text-right">Thành tiền</th>
                    <th className="text-center"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.productId}>
                      <td className="py-4">
                        <div className="flex gap-4 items-center">
                          {item.image && (
                            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{item.name}</p>
                            <p className="text-sm text-gray-500">Mã: {item.productId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="text-center">
                        {item.price.toLocaleString('vi-VN')} VNĐ
                      </td>
                      <td>
                        <div className="flex items-center justify-center border border-gray-200 rounded-lg w-fit mx-auto bg-white overflow-hidden">
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
                            className="w-12 text-center border-x border-gray-200"
                          />
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="text-right font-semibold">
                        {(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ
                      </td>
                      <td className="text-center">
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
            <div className="panel h-fit space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary">Tóm tắt đơn hàng</h2>
                <span className="pill">{items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm</span>
              </div>

              <div className="space-y-3 pb-4 border-b">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span className="font-semibold text-gray-900">{getTotalPrice().toLocaleString('vi-VN')} VNĐ</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className="text-accent font-semibold">Miễn phí</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-primary">
                <span>Tổng cộng:</span>
                <span>{getTotalPrice().toLocaleString('vi-VN')} VNĐ</span>
              </div>

              <div className="space-y-3">
                <button onClick={handleCheckout} className="btn-primary w-full">
                  Tiến hành thanh toán
                </button>
                <button
                  onClick={() => router.push('/products')}
                  className="btn-secondary w-full"
                >
                  Tiếp tục mua sắm
                </button>
                <button onClick={clearCart} className="w-full text-red-500 hover:text-red-700 font-semibold">
                  Xóa giỏ hàng
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
