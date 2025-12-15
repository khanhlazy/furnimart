'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { authService } from '@services/authService';
import { useAuthStore } from '@store/authStore';
import Link from 'next/link';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await authService.login(data);
      const { accessToken, user } = response.data;
      
      login(accessToken, user);
      toast.success('Đăng nhập thành công!');
      router.push('/products');
    } catch {
      // Error handled in interceptor
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-gray-800 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-3xl">F</span>
          </div>
          <h1 className="text-3xl font-bold text-white">FurniMart</h1>
          <p className="text-gray-300 mt-2">Đăng nhập để tiếp tục mua sắm</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Email</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                {...register('email', { required: 'Email là bắt buộc' })}
                type="email"
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition"
                placeholder="your@email.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Mật khẩu</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-3.5 text-gray-400" size={20} />
              <input
                {...register('password', { required: 'Mật khẩu là bắt buộc' })}
                type={showPassword ? 'text' : 'password'}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary transition"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded border-gray-300" />
              <span className="text-sm text-gray-600">Nhớ mật khẩu</span>
            </label>
            <a href="#" className="text-sm text-secondary hover:text-yellow-600">
              Quên mật khẩu?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-secondary to-yellow-600 text-white py-3 rounded-lg hover:shadow-lg transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">hoặc</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-sm"
            >
              Google
            </button>
            <button
              type="button"
              className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold text-sm"
            >
              Facebook
            </button>
          </div>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-300 mt-6">
          Chưa có tài khoản?{' '}
          <Link href="/auth/register" className="text-secondary hover:text-yellow-400 font-semibold">
            Đăng ký ngay
          </Link>
        </p>

        {/* Demo Credentials */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-blue-900 mb-2">📌 Tài khoản demo:</p>
          <p className="text-xs text-blue-800">Email: customer1@furnimart.com</p>
          <p className="text-xs text-blue-800">Password: password123</p>
        </div>
      </div>
    </div>
  );
}
