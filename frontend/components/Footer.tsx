'use client';

import Link from 'next/link';
import { FiFacebook, FiInstagram, FiTwitter, FiPhone, FiMail, FiMapPin } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-primary text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              FurniMart
            </h3>
            <p className="text-gray-300">
              Nền tảng thương mại điện tử nội thất hàng đầu, cung cấp sản phẩm chất lượng với giá cạnh tranh.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#" className="hover:text-secondary transition">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="hover:text-secondary transition">
                <FiInstagram size={20} />
              </a>
              <a href="#" className="hover:text-secondary transition">
                <FiTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-4">Liên kết nhanh</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link href="/products" className="hover:text-secondary transition">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-secondary transition">
                  Đơn hàng
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-4">Hỗ trợ</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <a href="#" className="hover:text-secondary transition">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition">
                  Điều khoản dịch vụ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-4">Liên hệ</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-center gap-2">
                <FiMapPin className="text-secondary" />
                <span>123 Nguyễn Hue, TP.HCM</span>
              </div>
              <div className="flex items-center gap-2">
                <FiPhone className="text-secondary" />
                <a href="tel:0123456789" className="hover:text-secondary transition">
                  0123 456 789
                </a>
              </div>
              <div className="flex items-center gap-2">
                <FiMail className="text-secondary" />
                <a href="mailto:info@furnimart.com" className="hover:text-secondary transition">
                  info@furnimart.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; 2024 FurniMart. Tất cả quyền được bảo lưu.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-secondary transition">
              Chính sách bảo mật
            </a>
            <a href="#" className="hover:text-secondary transition">
              Điều khoản dịch vụ
            </a>
            <a href="#" className="hover:text-secondary transition">
              Cookie
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
