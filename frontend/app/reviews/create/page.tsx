'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { productService } from '@services/productService';
import { reviewService } from '@services/reviewService';
import { orderService } from '@services/orderService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import { useAuthStore } from '@store/authStore';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { FiStar, FiArrowLeft, FiX } from 'react-icons/fi';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { Product } from '@types';

function CreateReviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get('productId');
  const { user, isLoading: authLoading } = useRequireAuth({ requiredRole: 'customer' });
  const { user: authUser } = useAuthStore();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  const { data: product, isLoading: productLoading } = useQuery<Product>(
    ['product', productId],
    () => productService.getById(productId!),
    { enabled: !!productId }
  );

  const { data: myOrders = [] } = useQuery<any[]>(
    ['orders', 'my-orders'],
    () => orderService.getMyOrders(),
    { enabled: !authLoading && !!user }
  );

  const createReviewMutation = useMutation(
    (data: { productId: string; rating: number; comment: string; customerName: string; images?: string[] }) =>
      reviewService.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['reviews', productId]);
        queryClient.invalidateQueries(['product', productId]);
        toast.success('Đánh giá đã được gửi thành công!');
        router.push(`/products/${productId}`);
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Gửi đánh giá thất bại');
      },
    }
  );

  // Check if customer has purchased this product
  const hasPurchased = myOrders.some((order: any) => {
    if (order.status !== 'delivered') return false;
    return order.items?.some((item: any) => 
      (item.productId || item.product?._id) === productId
    );
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Kích thước file không được vượt quá 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setImageUrls((prev) => [...prev, result]);
        // In a real app, you would upload to a server and get the URL
        // For now, we'll use the data URL
        setImages((prev) => [...prev, result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productId) {
      toast.error('Không tìm thấy sản phẩm');
      return;
    }

    if (!comment.trim()) {
      toast.error('Vui lòng nhập đánh giá');
      return;
    }

    if (!hasPurchased) {
      toast.error('Bạn chỉ có thể đánh giá sản phẩm đã mua');
      return;
    }

    createReviewMutation.mutate({
      productId,
      rating,
      comment: comment.trim(),
      customerName: authUser?.name || user?.name || 'Khách hàng',
      images: images.length > 0 ? images : undefined,
    });
  };

  if (authLoading || productLoading) {
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

  if (!user || user.role !== 'customer') {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="flex-1 section-shell flex items-center justify-center">
          <div className="text-center empty-state">
            <p className="text-gray-600 mb-4">Bạn cần đăng nhập để đánh giá sản phẩm</p>
            <Link href="/auth/login" className="btn-primary">
              Đăng nhập
            </Link>
          </div>
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
            <p className="text-gray-600 mb-4">Không tìm thấy sản phẩm</p>
            <Link href="/products" className="btn-primary">
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
        <div className="section-shell relative z-10">
          <Link href={`/products/${productId}`} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-3">
            <FiArrowLeft /> Quay lại
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Đánh giá sản phẩm</h1>
          <p className="text-gray-100/90">{product.name}</p>
        </div>
      </header>

      <div className="section-shell py-10">
        <div className="max-w-2xl mx-auto">
          {/* Product Info */}
          <div className="panel mb-6">
            <div className="flex items-center gap-4">
              {product.images && product.images.length > 0 && (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              )}
              <div>
                <h2 className="text-xl font-bold">{product.name}</h2>
                <p className="text-gray-600">
                  {product.price.toLocaleString('vi-VN')}₫
                  {product.discount && product.discount > 0 && (
                    <span className="ml-2 text-green-600">-{product.discount}%</span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {!hasPurchased && (
            <div className="panel mb-6 bg-yellow-50 border-yellow-200">
              <p className="text-yellow-800">
                ⚠️ Bạn chỉ có thể đánh giá sản phẩm đã mua và đã được giao hàng.
              </p>
            </div>
          )}

          {/* Review Form */}
          <form onSubmit={handleSubmit} className="panel">
            <h2 className="text-2xl font-bold mb-6">Viết đánh giá của bạn</h2>

            {/* Rating */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Đánh giá sao *
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="text-4xl transition-all hover:scale-110"
                  >
                    <FiStar
                      className={star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {rating === 1 && 'Rất không hài lòng'}
                {rating === 2 && 'Không hài lòng'}
                {rating === 3 && 'Bình thường'}
                {rating === 4 && 'Hài lòng'}
                {rating === 5 && 'Rất hài lòng'}
              </p>
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đánh giá chi tiết *
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                required
              />
            </div>

            {/* Images */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh (tùy chọn)
              </label>
              <div className="space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
                <p className="text-xs text-gray-500">
                  Tối đa 5MB mỗi ảnh. Hỗ trợ: JPG, PNG, GIF
                </p>

                {/* Image Preview */}
                {imageUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-3 mt-3">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={createReviewMutation.isLoading || !hasPurchased}
                className="btn-primary flex-1"
              >
                {createReviewMutation.isLoading ? 'Đang gửi...' : 'Gửi đánh giá'}
              </button>
              <Link href={`/products/${productId}`} className="btn-secondary">
                Hủy
              </Link>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function CreateReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="page-shell">
          <Navbar />
          <div className="flex-1 section-shell flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
          <Footer />
        </div>
      }
    >
      <CreateReviewContent />
    </Suspense>
  );
}

