'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FiShoppingCart, FiEye } from 'react-icons/fi';
import { useCartStore } from '@store/cartStore';
import { toast } from 'react-toastify';

interface Product {
  _id: string;
  name: string;
  price: number;
  discount?: number;
  images?: string[];
  stock: number;
  rating?: number;
  reviewCount?: number;
  isFeatured?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const router = useRouter();

  const getDiscountedPrice = (price: number, discount: number = 0) => {
    return Math.round(price * (1 - discount / 100));
  };

  const finalPrice = getDiscountedPrice(product.price, product.discount || 0);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stock <= 0) {
      toast.error('Sản phẩm đã hết hàng');
      return;
    }

    addItem({
      productId: product._id,
      name: product.name,
      price: finalPrice,
      quantity: 1,
      image: product.images?.[0],
    });
    toast.success(`${product.name} đã được thêm vào giỏ hàng`);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking on buttons
    if ((e.target as HTMLElement).closest('button, a')) {
      return;
    }
    router.push(`/products/${product._id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <span className="text-4xl">🛋️</span>
          </div>
        )}
        {product.discount && product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            -{product.discount}%
          </span>
        )}
        {product.isFeatured && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-bold">
            Nổi bật
          </span>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 flex items-center justify-center gap-2">
          <button
            onClick={handleAddToCart}
            className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white p-3 rounded-full shadow-lg hover:bg-secondary hover:text-white"
          >
            <FiShoppingCart size={20} />
          </button>
          <Link
            href={`/products/${product._id}`}
            onClick={(e) => e.stopPropagation()}
            className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 bg-white p-3 rounded-full shadow-lg hover:bg-secondary hover:text-white"
          >
            <FiEye size={20} />
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl font-bold text-primary">{finalPrice.toLocaleString('vi-VN')}₫</span>
          {product.discount && product.discount > 0 && (
            <span className="text-sm text-gray-500 line-through">
              {product.price.toLocaleString('vi-VN')}₫
            </span>
          )}
        </div>

        {/* Rating */}
        {product.rating && product.rating > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-yellow-500">★</span>
            <span>{product.rating.toFixed(1)}</span>
            {product.reviewCount && product.reviewCount > 0 && (
              <span className="text-gray-400">({product.reviewCount})</span>
            )}
          </div>
        )}

        {/* Stock */}
        <div className="mt-2">
          {product.stock > 0 ? (
            <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Còn {product.stock} sản phẩm
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Hết hàng
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
