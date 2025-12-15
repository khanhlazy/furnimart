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

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  rating: number;
  reviewCount: number;
  images: string[];
  category: string;
}

interface Review {
  _id: string;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const { data: productResponse, isLoading } = useQuery(
    ['product', productId],
    () => productService.getById(productId),
  );

  const { data: reviewsResponse } = useQuery(
    ['reviews', productId],
    () => reviewService.getByProduct(productId),
  );

  const product: Product = productResponse?.data;
  const reviews: Review[] = reviewsResponse?.data || [];

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      toast.error('Số lượng vượt quá tồn kho');
      return;
    }
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price - (product.discount || 0),
      quantity,
      image: product.images?.[0],
    });
    toast.success('Thêm vào giỏ hàng thành công');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Sản phẩm không tồn tại</p>
          <Link href="/products" className="text-secondary hover:underline">
            Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/products" className="flex items-center gap-2 text-secondary hover:text-primary">
            <FiArrowLeft /> Quay lại
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <div className="bg-white rounded-lg overflow-hidden mb-4">
              <img
                src={product.images?.[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {product.images?.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${
                    selectedImage === idx ? 'border-secondary' : 'border-gray-300'
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="bg-white rounded-lg p-6 h-fit">
            <h1 className="text-3xl font-bold text-primary mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i}>{i < Math.round(product.rating) ? '★' : '☆'}</span>
                ))}
              </div>
              <span className="text-gray-600">({product.reviewCount} đánh giá)</span>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-secondary">
                {(product.price - (product.discount || 0)).toLocaleString('vi-VN')} VNĐ
              </span>
              {product.discount > 0 && (
                <>
                  <span className="ml-4 text-xl text-gray-500 line-through">
                    {product.price.toLocaleString('vi-VN')} VNĐ
                  </span>
                  <span className="ml-4 bg-secondary text-white px-3 py-1 rounded text-sm font-bold">
                    -{product.discount}%
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="mb-6">
              <p className={`text-lg font-semibold ${product.stock > 0 ? 'text-accent' : 'text-red-500'}`}>
                {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
              </p>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mô tả</h3>
              <p className="text-gray-600">{product.description}</p>
            </div>

            {/* Quantity & Add to Cart */}
            {product.stock > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="text-gray-700 font-medium">Số lượng:</label>
                  <div className="flex items-center border border-gray-300 rounded">
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
                      className="w-16 text-center border-l border-r border-gray-300"
                    />
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="w-full bg-secondary text-white py-3 rounded-lg hover:bg-yellow-600 transition flex items-center justify-center gap-2 font-semibold"
                >
                  <FiShoppingCart /> Thêm vào giỏ hàng
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <div className="mt-12 bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-6">Đánh giá từ khách hàng</h2>

          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border-b pb-6">
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

          {user && (
            <Link href={`/reviews/create?productId=${productId}`} className="text-secondary hover:underline mt-6 block">
              Viết đánh giá của bạn
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
