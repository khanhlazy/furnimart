'use client';

import { useState } from 'react';
import { useQuery } from 'react-query';
import { useParams } from 'next/navigation';
import { productService } from '@services/productService';
import { reviewService } from '@services/reviewService';
import { useCartStore } from '@store/cartStore';
import { useAuthStore } from '@store/authStore';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  rating?: number;
  reviewCount?: number;
  images?: string[];
  category: string;
}

interface Review {
  _id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

const getDiscountedPrice = (price: number, discount = 0) => {
  if (!discount) return price;
  return Math.round(price * (1 - discount / 100));
};

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const { data: product, isLoading } = useQuery<Product>(
    ['product', productId],
    () => productService.getById(productId),
  );

  const { data: reviewsResponse } = useQuery<Review[]>(
    ['reviews', productId],
    () => reviewService.getByProduct(productId),
  );

  const reviews: Review[] = reviewsResponse || [];
  const discountedPrice = product ? getDiscountedPrice(product.price, product.discount) : 0;
  const heroImage = product?.images?.[selectedImage];

  const handleAddToCart = () => {
    if (!product) return;
    if (quantity > product.stock) {
      toast.error('Số lượng vượt quá tồn kho');
      return;
    }
    addItem({
      productId: product._id,
      name: product.name,
      price: discountedPrice,
      quantity,
      image: product.images?.[0],
    });
    toast.success('Thêm vào giỏ hàng thành công');
  };

  if (isLoading) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="flex-1 section-shell flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="flex-1 section-shell flex items-center justify-center">
          <div className="text-center empty-state">
            <div className="text-6xl mb-4">🛋️</div>
            <p className="text-gray-600 mb-4">Sản phẩm không tồn tại</p>
            <Link href="/products" className="inline-link">
              Quay lại danh sách sản phẩm
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <Navbar />

      <header className="hero-banner">
        <div className="section-shell relative z-10 flex flex-col gap-3">
          <Link href="/products" className="inline-flex items-center gap-2 text-white/80 hover:text-white">
            <FiArrowLeft /> Quay lại
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">{product.name}</h1>
          <div className="flex flex-wrap items-center gap-3">
            <span className="pill capitalize">{product.category}</span>
            <span className="pill bg-white/20 text-white backdrop-blur">
              ⭐ {(product.rating ?? 0).toFixed(1)} ({product.reviewCount ?? 0})
            </span>
          </div>
        </div>
      </header>

      <div className="section-shell py-10 flex-1 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Images */}
          <div className="panel space-y-4">
            <div className="bg-gray-100 rounded-xl overflow-hidden">
              {heroImage ? (
                <img src={heroImage} alt={product.name} className="w-full h-96 object-cover" />
              ) : (
                <div className="w-full h-96 flex items-center justify-center text-6xl text-gray-400">🛋️</div>
              )}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images?.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition ${
                    selectedImage === idx ? 'border-secondary' : 'border-gray-200 hover:border-secondary/60'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="panel space-y-6">
            {/* Rating */}
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400 text-lg">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.round(product.rating || 0) ? '★' : '☆'}</span>
                ))}
              </div>
              <span className="text-gray-600">({product.reviewCount ?? 0} đánh giá)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <span className="text-4xl font-bold text-secondary">
                {discountedPrice.toLocaleString('vi-VN')} VNĐ
              </span>
              {product.discount > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-xl text-gray-500 line-through">
                    {product.price.toLocaleString('vi-VN')} VNĐ
                  </span>
                  <span className="pill bg-secondary text-white">-{product.discount}%</span>
                </div>
              )}
            </div>

            {/* Stock */}
            <div>
              <p className={`text-lg font-semibold ${product.stock > 0 ? 'text-accent' : 'text-red-500'}`}>
                {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
              </p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">Mô tả</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Quantity & Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="text-gray-700 font-semibold">Số lượng:</label>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      min="1"
                      max={product.stock}
                      className="w-16 text-center border-x border-gray-200"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button onClick={handleAddToCart} className="btn-primary w-full">
                  <FiShoppingCart /> Thêm vào giỏ hàng
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="panel">
          <div className="flex items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-primary">Đánh giá từ khách hàng</h2>
            {user && (
              <Link
                href={`/reviews/create?productId=${productId}`}
                className="inline-link flex items-center gap-2"
              >
                Viết đánh giá của bạn
              </Link>
            )}
          </div>

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b pb-6 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                    <span className="text-sm text-gray-500">
                      {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex text-yellow-400 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                    ))}
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">Chưa có đánh giá nào</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
