'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@store/cartStore';
import { useAuthStore } from '@store/authStore';
import { orderService } from '@services/orderService';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useState } from 'react';

interface CheckoutForm {
  shippingAddress: string;
  phone: string;
  paymentMethod: string;
  notes?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutForm>();
  const [orderLoading, setOrderLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Vui lòng đăng nhập để tiếp tục</p>
          <Link href="/auth/login" className="text-secondary hover:underline">
            Đăng nhập ngay
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Giỏ hàng đang trống</p>
          <Link href="/products" className="text-secondary hover:underline">
            Quay lại mua sắm
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutForm) => {
    try {
      setOrderLoading(true);
      const orderData = {
        items: items.map((item) => ({
          productId: item.productId,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: data.shippingAddress,
        phone: data.phone,
        paymentMethod: data.paymentMethod,
        notes: data.notes,
      };

      await orderService.create(orderData);
      toast.success('Đặt hàng thành công!');
      clearCart();
      router.push('/orders');
    } catch (error) {
      toast.error('Đặt hàng thất bại');
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-primary">FurniMart - Thanh toán</h1>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Shipping Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Địa chỉ giao hàng</label>
                <textarea
                  {...register('shippingAddress', { required: 'Địa chỉ là bắt buộc' })}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                  placeholder="Nhập địa chỉ giao hàng đầy đủ"
                />
                {errors.shippingAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                  {...register('phone', { required: 'Số điện thoại là bắt buộc' })}
                  type="tel"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                  placeholder="0123456789"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phương thức thanh toán</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      {...register('paymentMethod', { required: 'Chọn phương thức thanh toán' })}
                      type="radio"
                      value="cod"
                      className="mr-2"
                    />
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('paymentMethod')}
                      type="radio"
                      value="stripe"
                      className="mr-2"
                    />
                    <span>Thẻ tín dụng (Stripe)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      {...register('paymentMethod')}
                      type="radio"
                      value="momo"
                      className="mr-2"
                    />
                    <span>MoMo</span>
                  </label>
                </div>
                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú (tùy chọn)</label>
                <textarea
                  {...register('notes')}
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
                  placeholder="Ghi chú thêm cho nhân viên giao hàng..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || orderLoading}
                className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-yellow-600 disabled:opacity-50 font-semibold"
              >
                {isSubmitting || orderLoading ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-xl font-bold text-primary mb-6">Tóm tắt đơn hàng</h2>

            <div className="space-y-4 mb-6 pb-6 border-b max-h-80 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} <span className="text-gray-500">x{item.quantity}</span>
                  </span>
                  <span className="font-semibold">{(item.price * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{getTotalPrice().toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span className="text-accent">Miễn phí</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-primary border-t pt-2">
                <span>Tổng cộng:</span>
                <span>{getTotalPrice().toLocaleString('vi-VN')} VNĐ</span>
              </div>
            </div>

            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              <p>✓ Miễn phí vận chuyển</p>
              <p>✓ Bảo hành chính hãng</p>
              <p>✓ Hoàn tiền 100% nếu lỗi</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
