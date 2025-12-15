'use client';

import { useState } from 'react';
import { useQuery } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { productService } from '@services/productService';
import { useCartStore } from '@store/cartStore';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FiShoppingCart, FiSearch, FiFilter, FiX } from 'react-icons/fi';

interface Product {
  _id: string;
  name: string;
  price: number;
  discount: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
  stock: number;
}

const getDiscountedPrice = (price: number, discount = 0) => {
  if (!discount) return price;
  return Math.round(price * (1 - discount / 100));
};

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [showFilters, setShowFilters] = useState(false);
  const { addItem } = useCartStore();

  const { data: products, isLoading } = useQuery<Product[]>(
    ['products', searchTerm, category, minPrice, maxPrice],
    () => productService.getAll({ search: searchTerm, category, minPrice, maxPrice, limit: 20 }),
  );

  const categories = ['sofa', 'chair', 'table', 'bed', 'cabinet'];

  const handleAddToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast.error('Sản phẩm đã hết hàng');
      return;
    }
    addItem({
      productId: product._id,
      name: product.name,
      price: getDiscountedPrice(product.price, product.discount),
      quantity: 1,
      image: product.images?.[0],
    });
    toast.success(`${product.name} đã được thêm vào giỏ hàng`);
  };

  return (
    <div className="page-shell">
      <Navbar />

      {/* Hero */}
      <div className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-4 inline-flex">Khám phá ngay</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Cửa hàng nội thất</h1>
          <p className="text-gray-100 text-lg max-w-2xl">Khám phá bộ sưu tập nội thất hoàn chỉnh của chúng tôi</p>
        </div>
      </div>

      <div className="section-shell flex-1 w-full py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Filters */}
          <aside
            className={`${
              showFilters ? 'block' : 'hidden'
            } lg:block lg:col-span-1 panel h-fit glass-card`}
          >
            <div className="flex justify-between items-center lg:hidden mb-4">
              <h2 className="text-xl font-bold text-primary">Bộ lọc</h2>
              <button onClick={() => setShowFilters(false)} className="text-gray-500">
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div>
                <label className="form-label">Tìm kiếm</label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Tìm sản phẩm..."
                    className="input-field pr-10"
                  />
                  <FiSearch className="absolute right-3 top-3 text-gray-400" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="form-label">Danh mục</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setCategory('')}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      category === ''
                        ? 'bg-secondary text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    Tất cả
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategory(cat)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition capitalize ${
                        category === cat
                          ? 'bg-secondary text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {cat === 'sofa'
                        ? 'Sofa'
                        : cat === 'chair'
                        ? 'Ghế'
                        : cat === 'table'
                        ? 'Bàn'
                        : cat === 'bed'
                        ? 'Giường'
                        : 'Tủ'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="form-label">Giá (VNĐ)</label>
                <div className="space-y-3">
                  <div>
                    <input
                      type="number"
                      value={minPrice}
                      onChange={(e) => setMinPrice(parseInt(e.target.value) || 0)}
                      placeholder="Giá tối thiểu"
                      className="input-field text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value) || 100000000)}
                      placeholder="Giá tối đa"
                      className="input-field text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Clear Filters */}
              <button
                onClick={() => {
                  setSearchTerm('');
                  setCategory('');
                  setMinPrice(0);
                  setMaxPrice(100000000);
                }}
                className="btn-secondary w-full"
              >
                Xóa bộ lọc
              </button>
            </div>
          </aside>

          {/* Products */}
          <main className="lg:col-span-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden mb-4 w-full flex items-center justify-center gap-2 px-4 py-2 panel"
            >
              <FiFilter /> Bộ lọc
            </button>

            {/* Products Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
              </div>
            ) : (products || []).length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {(products || []).map((product) => (
                  <div key={product._id} className="product-card">
                    {/* Image */}
                    <Link href={`/products/${product._id}`}>
                      <div className="relative bg-gray-200 h-72 overflow-hidden">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover hover:scale-110 transition duration-300"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-6xl">🛋️</div>
                        )}
                        {product.discount > 0 && (
                          <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                            -{product.discount}%
                          </span>
                        )}
                        {product.stock <= 0 && (
                          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                            <span className="text-white text-xl font-bold">Hết hàng</span>
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Content */}
                    <div className="p-4">
                      <Link href={`/products/${product._id}`}>
                        <h3 className="text-lg font-bold text-primary hover:text-secondary transition line-clamp-2">
                          {product.name}
                        </h3>
                      </Link>

                      {/* Rating */}
                      <div className="flex items-center gap-2 my-2">
                        <div className="flex text-yellow-400 text-sm">
                          {[...Array(5)].map((_, i) => (
                            <span key={i}>{i < Math.round(product.rating || 0) ? '★' : '☆'}</span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-600">({product.reviewCount ?? 0})</span>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-secondary">
                          {getDiscountedPrice(product.price, product.discount).toLocaleString('vi-VN')}
                        </span>
                        {product.discount > 0 && (
                          <span className="ml-2 text-xs text-gray-500 line-through">
                            {product.price.toLocaleString('vi-VN')}
                          </span>
                        )}
                      </div>

                      {/* Stock */}
                      <div className="mb-4">
                        <p className={`text-xs font-semibold ${product.stock > 0 ? 'text-accent' : 'text-red-500'}`}>
                          {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                        </p>
                      </div>

                      {/* Buttons */}
                      <div className="flex gap-2">
                        <Link
                          href={`/products/${product._id}`}
                          className="btn-secondary flex-1 text-center text-sm"
                        >
                          Chi tiết
                        </Link>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock <= 0}
                          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                        >
                          <FiShoppingCart size={16} /> Thêm
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <p className="text-gray-500 text-lg">Không tìm thấy sản phẩm nào</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
