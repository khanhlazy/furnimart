'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { FiArrowRight, FiTruck, FiShield, FiStar } from 'react-icons/fi';
import { useQuery } from 'react-query';
import { productService } from '@services/productService';

export default function Home() {
  useEffect(() => {
    console.log('🏠 Home Page Loaded');
    console.log('📍 Location:', window.location.href);
  }, []);

  const { data: response, isLoading, error } = useQuery(
    ['featured-products'],
    () => productService.getAll({ limit: 6 }),
    {
      enabled: true,
      retry: 3,
      retryDelay: 1000,
    },
  );

  const products = response?.data || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] via-[#fef6e4] to-[#fff] flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-secondary to-yellow-100 text-white py-24 md:py-36 overflow-hidden shadow-xl">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-96 h-96 bg-secondary opacity-30 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent opacity-20 rounded-full blur-3xl animate-pulse"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg tracking-tight animate-fade-in-up">
                <span className="block">Nội Thất</span>
                <span className="text-secondary drop-shadow-xl">Chất Lượng</span>
                <span className="block">
                  Cho Gia Đình <span className="text-accent">Bạn</span>
                </span>
              </h1>
              <p className="text-xl text-gray-100 mb-10 font-medium drop-shadow animate-fade-in-up delay-100">
                Khám phá bộ sưu tập nội thất hiện đại, tinh tế và phải chăng. Chúng tôi mang đến không gian sống hoàn hảo cho mọi gia đình.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-200">
                <Link
                  href="/products"
                  className="btn-primary"
                >
                  Khám phá ngay <FiArrowRight />
                </Link>
                <button className="px-8 py-4 border-2 border-white rounded-xl hover:bg-white hover:text-primary transition font-semibold text-lg shadow-lg hover:-translate-y-1 duration-200">
                  Xem video demo
                </button>
              </div>
            </div>
            {/* Hero Image */}
            <div className="relative flex items-center justify-center animate-fade-in-up delay-300">
              <div className="bg-gradient-to-br from-secondary to-yellow-600 rounded-3xl p-8 shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="bg-gray-100 rounded-xl w-80 h-80 md:w-96 md:h-96 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-7xl mb-4 animate-bounce">🛋️</div>
                    <p className="text-lg text-gray-700 font-semibold">Nội thất đẹp</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-br from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition text-center border-t-4 border-secondary animate-fade-in-up">
              <div className="w-16 h-16 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiTruck className="text-secondary" size={32} />
              </div>
              <h3 className="text-xl font-bold text-primary mb-2">Giao hàng nhanh</h3>
              <p className="text-gray-600">Miễn phí vận chuyển cho đơn hàng trên 2 triệu đồng</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition text-center border-t-4 border-yellow-400 animate-fade-in-up delay-100">
              <div className="w-16 h-16 bg-yellow-400 bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiShield className="text-yellow-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-yellow-600 mb-2">Bảo hành chính hãng</h3>
              <p className="text-gray-600">Bảo hành tối đa 2 năm cho sản phẩm</p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition text-center border-t-4 border-accent animate-fade-in-up delay-200">
              <div className="w-16 h-16 bg-accent bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiStar className="text-accent" size={32} />
              </div>
              <h3 className="text-xl font-bold text-accent mb-2">Chất lượng đảm bảo</h3>
              <p className="text-gray-600">Tất cả sản phẩm đều kiểm chất lượng trước khi giao</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-extrabold text-primary mb-4 tracking-tight drop-shadow animate-fade-in-up">Sản phẩm nổi bật</h2>
            <p className="text-gray-600 text-lg">Những sản phẩm được yêu thích nhất từ khách hàng</p>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">Không thể tải sản phẩm. Vui lòng thử lại.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product: any, idx: number) => (
                <Link key={product._id} href={`/products/${product._id}`}>
                  <div
                    className="product-card animate-fade-in-up"
                    style={{ animationDelay: `${idx * 80}ms` }}
                  >
                    {/* Image */}
                    <div className="relative bg-gray-200 h-64 overflow-hidden">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-6xl">🛋️</div>
                      )}
                      {product.discount > 0 && (
                        <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow">
                          -{product.discount}%
                        </span>
                      )}
                    </div>
                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg font-bold text-primary mb-2 line-clamp-2">{product.name}</h3>
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < Math.round(product.rating) ? '★' : '☆'}</span>
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">({product.reviewCount})</span>
                      </div>
                      {/* Price */}
                      <div className="flex items-end gap-2 mb-4">
                        <span className="text-2xl font-bold text-secondary">
                          {(product.price - (product.discount || 0)).toLocaleString('vi-VN')}
                        </span>
                        <span className="text-sm text-gray-500 line-through">
                          {product.price.toLocaleString('vi-VN')}
                        </span>
                      </div>
                      <button className="w-full bg-gradient-to-r from-secondary to-yellow-500 text-white py-2 rounded-lg hover:scale-105 hover:bg-yellow-600 transition font-semibold shadow">
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:scale-105 hover:bg-gray-800 transition font-semibold text-lg shadow-lg"
            >
              Xem tất cả sản phẩm <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-secondary to-yellow-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 animate-fade-in-up">Đăng ký nhận bản tin</h2>
          <p className="text-xl mb-8 opacity-90 animate-fade-in-up delay-100">Nhận thông tin sản phẩm mới, khuyến mãi đặc biệt</p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto animate-fade-in-up delay-200">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-lg text-primary focus:outline-none"
            />
            <button type="submit" className="px-8 py-3 bg-primary rounded-lg hover:bg-gray-800 transition font-semibold">
              Đăng ký
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Animation utilities are defined in globals.css
