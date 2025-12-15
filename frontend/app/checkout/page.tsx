'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@store/cartStore';
import { useAuthStore } from '@store/authStore';
import { orderService } from '@services/orderService';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

interface CheckoutForm {
  shippingAddress: string;
  phone: string;
  paymentMethod: string;
  notes?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, hasHydrated } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutForm>();
  const [orderLoading, setOrderLoading] = useState(false);

  // Wait for hydration before checking auth
  useEffect(() => {
    if (hasHydrated && !user && typeof window !== 'undefined') {
      router.push('/auth/login?redirect=/checkout');
    }
  }, [user, hasHydrated, router]);

  // Show loading while hydrating
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
    return null;
  }
  
  if (items.length === 0) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="flex-1 section-shell flex items-center justify-center">
          <div className="empty-state">
            <p className="text-gray-600 mb-4">Giỏ hàng đang trống</p>
            <Link href="/products" className="inline-link">
              Quay lại mua sắm
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const onSubmit = async (data: CheckoutForm) => {
    try {
      // Verify user is authenticated before submitting
      if (!user) {
        toast.error('Vui lòng đăng nhập để tiếp tục');
        router.push('/auth/login?redirect=/checkout');
        return;
      }

      // Verify token exists - check both store and cookies
      const { token } = useAuthStore.getState();
      let authToken = token;
      
      // Fallback to cookie if store token is missing
      if (!authToken && typeof document !== 'undefined') {
        const cookies = document.cookie.split(';');
        const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
        if (tokenCookie) {
          authToken = tokenCookie.trim().substring('auth-token='.length);
        }
      }
      
      if (!authToken) {
        console.error('❌ No token found in store or cookies');
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        router.push('/auth/login?redirect=/checkout');
        return;
      }

      console.log('✅ Token found, proceeding with checkout');
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
    } catch (error: any) {
      console.error('Checkout error:', error);
      
      // Handle 401 specifically - don't show duplicate toast
      if (error?.response?.status === 401) {
        // Toast will be shown by API interceptor, just redirect
        router.push('/auth/login?redirect=/checkout');
        return;
      }
      
      const errorMessage = error?.response?.data?.message || error?.message || 'Đặt hàng thất bại';
      toast.error(errorMessage);
    } finally {
      setOrderLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />

      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Thanh toán</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">FurniMart - Hoàn tất đặt hàng</h1>
          <p className="text-gray-100/90">Điền thông tin giao hàng và phương thức thanh toán</p>
        </div>
      </header>

      <div className="section-shell py-10 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 panel">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Shipping Address */}
              <div>
                <label className="form-label">Địa chỉ giao hàng</label>
                <textarea
                  {...register('shippingAddress', { required: 'Địa chỉ là bắt buộc' })}
                  rows={3}
                  className="input-field"
                  placeholder="Nhập địa chỉ giao hàng đầy đủ"
                />
                {errors.shippingAddress && (
                  <p className="text-red-500 text-sm mt-1">{errors.shippingAddress.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="form-label">Số điện thoại</label>
                <input
                  {...register('phone', { required: 'Số điện thoại là bắt buộc' })}
                  type="tel"
                  className="input-field"
                  placeholder="0123456789"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              {/* Payment Method */}
              <div>
                <label className="form-label">Phương thức thanh toán</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input
                      {...register('paymentMethod', { required: 'Chọn phương thức thanh toán' })}
                      type="radio"
                      value="cod"
                    />
                    <span>Thanh toán khi nhận hàng (COD)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input {...register('paymentMethod')} type="radio" value="stripe" />
                    <span>Thẻ tín dụng (Stripe)</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input {...register('paymentMethod')} type="radio" value="momo" />
                    <span>MoMo</span>
                  </label>
                </div>
                {errors.paymentMethod && (
                  <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="form-label">Ghi chú (tùy chọn)</label>
                <textarea
                  {...register('notes')}
                  rows={2}
                  className="input-field"
                  placeholder="Ghi chú thêm cho nhân viên giao hàng..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || orderLoading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {isSubmitting || orderLoading ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="panel h-fit space-y-4 sticky top-24 bg-gradient-to-br from-white to-gray-50/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">Tóm tắt đơn hàng</h2>
              <span className="pill">{items.reduce((sum, item) => sum + item.quantity, 0)} sản phẩm</span>
            </div>

            <div className="space-y-4 pb-4 border-b max-h-80 overflow-y-auto">
              {items.map((item) => (
                <div key={item.productId} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.name} <span className="text-gray-500">x{item.quantity}</span>
                  </span>
                  <span className="font-semibold">{((item.price || 0) * item.quantity).toLocaleString('vi-VN')} VNĐ</span>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Tạm tính:</span>
                <span>{getTotalPrice().toLocaleString('vi-VN')} VNĐ</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Phí vận chuyển:</span>
                <span className="text-accent">Miễn phí</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold text-primary border-t pt-2">
              <span>Tổng cộng:</span>
              <span>{getTotalPrice().toLocaleString('vi-VN')} VNĐ</span>
            </div>
          </div>

          <div className="panel text-sm text-gray-700 bg-gradient-to-r from-blue-50 to-white">
            <p>✓ Miễn phí vận chuyển</p>
            <p>✓ Bảo hành chính hãng</p>
            <p>✓ Hoàn tiền 100% nếu lỗi</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
