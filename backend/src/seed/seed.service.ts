import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../modules/users/schemas/user.schema';
import { Product, ProductDocument } from '../modules/products/schemas/product.schema';
import { Order, OrderDocument } from '../modules/orders/schemas/order.schema';
import { Review, ReviewDocument } from '../modules/reviews/schemas/review.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async seed(): Promise<void> {
    console.log('🌱 Starting seed...');

    // Clear existing data
    await Promise.all([
      this.userModel.deleteMany({}),
      this.productModel.deleteMany({}),
      this.orderModel.deleteMany({}),
      this.reviewModel.deleteMany({}),
    ]);

    console.log('✓ Cleared existing data');

    // Seed Users
    const users = await this.seedUsers();
    console.log('✓ Created users');

    // Seed Products
    const products = await this.seedProducts();
    console.log('✓ Created products');

    // Seed Orders
    await this.seedOrders(users, products);
    console.log('✓ Created orders');

    // Seed Reviews
    await this.seedReviews(users, products);
    console.log('✓ Created reviews');

    console.log('✅ Seed completed successfully!');
  }

  private async seedUsers() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      // Admin
      {
        email: 'admin@furnimart.com',
        password: hashedPassword,
        name: 'Admin FurniMart',
        phone: '0987654321',
        role: 'admin',
        address: '123 Nguyễn Hue, Ho Chi Minh City',
        isActive: true,
      },
      // Manager
      {
        email: 'manager@furnimart.com',
        password: hashedPassword,
        name: 'Nguyễn Văn Manager',
        phone: '0987654322',
        role: 'manager',
        address: '456 Tran Hung Dao, Ha Noi',
        isActive: true,
      },
      // Employees
      ...Array.from({ length: 2 }).map((_, i) => ({
        email: `employee${i + 1}@furnimart.com`,
        password: hashedPassword,
        name: `Nhân viên ${i + 1}`,
        phone: `098765432${3 + i}`,
        role: 'employee',
        address: `789 Nguyen Trai, Da Nang`,
        isActive: true,
      })),
      // Shippers
      ...Array.from({ length: 3 }).map((_, i) => ({
        email: `shipper${i + 1}@furnimart.com`,
        password: hashedPassword,
        name: `Shipper ${i + 1}`,
        phone: `098765432${6 + i}`,
        role: 'shipper',
        address: `${300 + i * 100} Pasteur, Ho Chi Minh City`,
        isActive: true,
      })),
      // Customers
      ...Array.from({ length: 5 }).map((_, i) => ({
        email: `customer${i + 1}@furnimart.com`,
        password: hashedPassword,
        name: `Khách hàng ${i + 1}`,
        phone: `090000000${i + 1}`,
        role: 'customer',
        address: `${100 + i * 50} Le Thanh Ton, Ho Chi Minh City`,
        isActive: true,
      })),
    ];

    return this.userModel.insertMany(users);
  }

  private async seedProducts() {
    const products = [
      {
        name: 'Sofa Vải Nhung 3 Chỗ',
        description: 'Sofa hiện đại với vải nhung mềm mại, thiết kế sang trọng, phù hợp cho phòng khách',
        price: 15000000,
        discount: 10,
        stock: 25,
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
          'https://images.unsplash.com/photo-1495198917210-f395dc0bbb27?w=500',
        ],
        category: 'sofa',
        rating: 4.5,
        reviewCount: 12,
        isActive: true,
      },
      {
        name: 'Ghế Ăn Bọc Da PU Đen',
        description: 'Ghế ăn kiểu Châu Âu với lưng tựa cao, bọc da PU bền bỉ, chân kim loại',
        price: 2500000,
        discount: 5,
        stock: 50,
        images: [
          'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500',
        ],
        category: 'chair',
        rating: 4,
        reviewCount: 8,
        isActive: true,
      },
      {
        name: 'Bàn Ăn Gỗ Tự Nhiên 6 Chỗ',
        description: 'Bàn ăn từ gỗ sồi tự nhiên, có thể mở rộng, phù hợp cho gia đình 6 người',
        price: 18000000,
        discount: 15,
        stock: 10,
        images: [
          'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500',
        ],
        category: 'table',
        rating: 5,
        reviewCount: 15,
        isActive: true,
      },
      {
        name: 'Giường Ngủ King Size Bọc Nệm',
        description: 'Giường ngủ cao cấp với nệm lò xo kép, đầu giường bọc nệm mềm mại',
        price: 25000000,
        discount: 20,
        stock: 8,
        images: [
          'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=500',
        ],
        category: 'bed',
        rating: 4.8,
        reviewCount: 20,
        isActive: true,
      },
      {
        name: 'Tủ Quần Áo 4 Cánh Gỗ Công Nghiệp',
        description: 'Tủ quần áo spacious với 4 cánh, lò xo tự động, ngăn kéo nhiều',
        price: 8000000,
        discount: 8,
        stock: 15,
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
        ],
        category: 'cabinet',
        rating: 4.2,
        reviewCount: 10,
        isActive: true,
      },
      {
        name: 'Bàn Coffee Kính Cường Lực Cao Cấp',
        description: 'Bàn cà phê với mặt kính cường lực trong suốt, chân gỗ óc chó',
        price: 4500000,
        discount: 12,
        stock: 30,
        images: [
          'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=500',
        ],
        category: 'table',
        rating: 4.3,
        reviewCount: 9,
        isActive: true,
      },
      {
        name: 'Ghế Xoay Văn Phòng Cao Cấp',
        description: 'Ghế xoay ergonomic với lưng tựa cao, có tay vịn điều chỉnh',
        price: 5500000,
        discount: 15,
        stock: 20,
        images: [
          'https://images.unsplash.com/photo-1572846092129-af9d8a7f6e31?w=500',
        ],
        category: 'chair',
        rating: 4.6,
        reviewCount: 14,
        isActive: true,
      },
      {
        name: 'Tủ Trang Trí Gỗ Sồi Nhập Khẩu',
        description: 'Tủ trang trí với thiết kế hiện đại, 3 ngăn mở, 2 ngăn kéo',
        price: 12000000,
        discount: 10,
        stock: 12,
        images: [
          'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500',
        ],
        category: 'cabinet',
        rating: 4.7,
        reviewCount: 11,
        isActive: true,
      },
      {
        name: 'Giường Sofa Đa Năng 2 trong 1',
        description: 'Sofa có thể gập thành giường, tiết kiệm không gian, vải thô bền',
        price: 9000000,
        discount: 20,
        stock: 18,
        images: [
          'https://images.unsplash.com/photo-1597072200969-2b65d56bd16b?w=500',
        ],
        category: 'sofa',
        rating: 4.4,
        reviewCount: 13,
        isActive: true,
      },
      {
        name: 'Bàn Làm Việc Gỗ Sồi 1.4m',
        description: 'Bàn văn phòng với nhiều ngăn kéo, bề mặt rộng để làm việc',
        price: 6500000,
        discount: 10,
        stock: 22,
        images: [
          'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500',
        ],
        category: 'table',
        rating: 4.5,
        reviewCount: 10,
        isActive: true,
      },
    ];

    return this.productModel.insertMany(products);
  }

  private async seedOrders(users: UserDocument[], products: ProductDocument[]) {
    const customers = users.filter((u) => u.role === 'customer');
    const shippers = users.filter((u) => u.role === 'shipper');

    const orders = [];

    for (let i = 0; i < 10; i++) {
      const customer = customers[i % customers.length];
      const shipper = shippers[i % shippers.length];
      const randomProducts = products
        .slice(0, Math.floor(Math.random() * 3) + 1)
        .map((p) => ({
          productId: p._id,
          productName: p.name,
          quantity: Math.floor(Math.random() * 3) + 1,
          price: p.price - (p.discount || 0),
        }));

      const totalPrice = randomProducts.reduce((sum, item) => sum + item.price * item.quantity, 0);

      orders.push({
        customerId: customer._id,
        items: randomProducts,
        totalPrice,
        totalDiscount: 0,
        shippingAddress: customer.address,
        phone: customer.phone,
        status: ['pending', 'confirmed', 'shipped', 'delivered'][Math.floor(Math.random() * 4)],
        paymentMethod: ['cod', 'stripe', 'momo'][Math.floor(Math.random() * 3)],
        isPaid: Math.random() > 0.5,
        shipperId: shipper._id,
      });
    }

    return this.orderModel.insertMany(orders);
  }

  private async seedReviews(users: UserDocument[], products: ProductDocument[]) {
    const customers = users.filter((u) => u.role === 'customer');

    const reviews = [];
    const comments = [
      'Sản phẩm chất lượng rất tốt, giao hàng nhanh!',
      'Đúng như mô tả, rất hài lòng!',
      'Giá hợp lý, nhân viên phục vụ tốt',
      'Sản phẩm đẹp, bắt mắt',
      'Chất lượng không tốt như kỳ vọng',
      'Giao hàng chậm nhưng sản phẩm tốt',
      'Rất hài lòng với mua lần này',
      'Sẽ mua lại lần tới',
    ];

    for (let i = 0; i < 15; i++) {
      const customer = customers[i % customers.length];
      const product = products[i % products.length];

      reviews.push({
        productId: product._id,
        customerId: customer._id,
        customerName: customer.name,
        rating: Math.floor(Math.random() * 2) + 4,
        comment: comments[Math.floor(Math.random() * comments.length)],
        isVerified: true,
      });
    }

    return this.reviewModel.insertMany(reviews);
  }
}
