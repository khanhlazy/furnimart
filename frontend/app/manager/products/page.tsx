'use client';

import { useQuery } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { productService } from '@services/productService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import Link from 'next/link';
import { FiEye } from 'react-icons/fi';

export default function ManagerProductsPage() {
  const { user, isLoading } = useRequireAuth({ requiredRole: ['manager', 'admin'] });

  const { data: products = [], error: productsError, isLoading: productsLoading } = useQuery(
    ['products', 'manager'],
    () => productService.getAll({ limit: 100 }),
    { 
      enabled: !isLoading && (user?.role === 'manager' || user?.role === 'admin'),
      retry: 1,
      onError: (error: any) => {
        console.error('Error fetching products:', error);
      }
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

  return (
    <div className="page-shell">
      <Navbar />
      
      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Quản lý</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Quản lý sản phẩm</h1>
          <p className="text-gray-100/90">Xem và quản lý sản phẩm</p>
        </div>
      </header>

      <div className="section-shell py-10">

        {productsLoading ? (
          <div className="panel flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        ) : productsError ? (
          <div className="panel">
            <p className="text-red-600 text-center py-8">Lỗi khi tải danh sách sản phẩm. Vui lòng thử lại.</p>
          </div>
        ) : (
          <div className="panel overflow-hidden">
            <table className="w-full table-styled">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Danh mục</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      Không có sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  products.map((product: any) => (
                    <tr key={product._id}>
                      <td>
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">🛋️</div>
                        )}
                      </td>
                      <td className="font-semibold">{product.name}</td>
                      <td>{product.price.toLocaleString('vi-VN')}₫</td>
                      <td>{product.stock}</td>
                      <td>{product.category}</td>
                      <td>
                        <Link 
                          href={`/products/${product._id}`} 
                          className="text-secondary hover:underline inline-flex items-center gap-1"
                        >
                          <FiEye /> Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

