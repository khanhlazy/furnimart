'use client';

import { useState } from 'react';
import { useQuery } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import ProductCard from '@components/ProductCard';
import FilterSidebar from '@components/FilterSidebar';
import { productService } from '@services/productService';
import { categoryService } from '@services/categoryService';
import { FiFilter } from 'react-icons/fi';
import { Product } from '@types';

export default function ProductsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<any>({});

  const { data: products = [], isLoading } = useQuery<Product[]>(
    ['products', filters],
    () => productService.getAll(filters)
  );

  const { data: categories = [] } = useQuery(
    ['categories'],
    () => categoryService.getAll()
  );

  return (
    <div className="page-shell">
      <Navbar />

      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Sản phẩm</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Danh mục sản phẩm</h1>
          <p className="text-gray-100/90">Khám phá bộ sưu tập nội thất đầy đủ</p>
        </div>
      </header>

      <div className="section-shell py-10 flex-1">
        <div className="flex gap-8 items-start">
          {/* Filter Sidebar */}
          <FilterSidebar
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
            filters={filters}
            onFilterChange={setFilters}
            categories={categories}
          />

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow"
              >
                <FiFilter /> Bộ lọc
              </button>
            </div>

            {/* Products Grid */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary mb-4"></div>
                <p className="text-gray-500">Đang tải sản phẩm...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-5xl">🔍</span>
                </div>
                <p className="text-gray-600 text-xl font-semibold mb-2">Không tìm thấy sản phẩm nào</p>
                <p className="text-gray-500 mb-6">Thử điều chỉnh bộ lọc để tìm kiếm sản phẩm khác</p>
                <button
                  onClick={() => setFilters({})}
                  className="btn-secondary"
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
                  Tìm thấy <span className="font-semibold text-primary">{products.length}</span> sản phẩm
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
