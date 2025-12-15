'use client';

import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { authService } from '@services/authService';
import { useAuthStore } from '@store/authStore';
import Link from 'next/link';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone?: string;
}

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Mật khẩu không khớp');
      return;
    }

    try {
      const response = await authService.register({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
      });
      
      const { accessToken, user } = response.data;
      login(accessToken, user);
      toast.success('Đăng ký thành công!');
      router.push('/dashboard');
    } catch {
      // Error already handled in interceptor
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-primary mb-6 text-center">FurniMart</h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Đăng ký tài khoản</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Họ tên</label>
            <input
              {...register('name', { required: 'Họ tên là bắt buộc' })}
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              placeholder="Nguyễn Văn A"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              {...register('email', { required: 'Email là bắt buộc' })}
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              placeholder="your@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại</label>
            <input
              {...register('phone')}
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              placeholder="0123456789"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              {...register('password', { required: 'Mật khẩu là bắt buộc', minLength: { value: 6, message: 'Tối thiểu 6 ký tự' } })}
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
            <input
              {...register('confirmPassword', { required: 'Vui lòng xác nhận mật khẩu' })}
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary"
              placeholder="••••••••"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-secondary text-white py-2 rounded-lg hover:bg-yellow-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Đang đăng ký...' : 'Đăng ký'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Đã có tài khoản?{' '}
          <Link href="/auth/login" className="text-secondary hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
}
