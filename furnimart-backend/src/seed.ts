import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';

import { User, UserSchema } from './users/schemas/user.schema';
import { Product, ProductSchema } from './products/schemas/product.schema';
import { Category, CategorySchema } from './categories/schemas/category.schema';
import { Order, OrderSchema } from './orders/schemas/order.schema';
import { Review, ReviewSchema } from './reviews/schemas/review.schema';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/furnimart';

function getModel<T extends mongoose.Document>(name: string, schema: mongoose.Schema) {
  return (mongoose.models[name] || mongoose.model<T>(name, schema)) as mongoose.Model<T>;
}

async function seed() {
  await mongoose.connect(MONGODB_URI);
  const Users = getModel(User.name, UserSchema);
  const Products = getModel(Product.name, ProductSchema);
  const Categories = getModel(Category.name, CategorySchema);
  const Orders = getModel(Order.name, OrderSchema);
  const Reviews = getModel(Review.name, ReviewSchema);

  console.log('Resetting collections...');
  await Promise.all([
    Users.deleteMany({}),
    Products.deleteMany({}),
    Categories.deleteMany({}),
    Orders.deleteMany({}),
    Reviews.deleteMany({}),
  ]);

  const categoryDocs = await Categories.insertMany([
    { name: 'Sofa & Ghế', slug: 'sofa', description: 'Ghế sofa, armchair cho phòng khách.' },
    { name: 'Bàn ăn', slug: 'ban-an', description: 'Bàn ăn gỗ, đá cho gia đình.' },
    { name: 'Đèn & trang trí', slug: 'den-trang-tri', description: 'Đèn, bình hoa, phụ kiện.' },
  ]);

  const password = await bcrypt.hash('Password123!', 10);
  const roleList = ['customer', 'staff', 'manager', 'shipper', 'admin'] as const;
  const users = await Users.insertMany(
    roleList.flatMap((role) =>
      Array.from({ length: 5 }).map((_, idx) => ({
        name: `${role.toUpperCase()} ${idx + 1}`,
        email: `${role}${idx + 1}@demo.com`,
        password,
        role,
        phone: `0900${(idx + 1).toString().padStart(3, '0')}`,
        branch: role === 'customer' ? undefined : `Branch ${(idx % 3) + 1}`,
        address: `Số ${idx + 10} Đường Trải Nghiệm, Quận 1`,
      })),
    ),
  );

  const products = await Products.insertMany([
    {
      name: 'Sofa chữ L Scandinavian',
      description: 'Chất liệu vải lanh, khung gỗ sồi, phù hợp phòng khách hiện đại.',
      price: 15990000,
      category: categoryDocs[0].slug,
      image: '/uploads/sofa-l.jpg',
      images: ['/uploads/sofa-l.jpg', '/uploads/sofa-l-2.jpg'],
      model3D: '/uploads/models/sofa-l.glb',
      stock: 12,
      rating: 4.7,
      reviewCount: 142,
      sku: 'SOFA-L-01',
    },
    {
      name: 'Ghế bành HYG',
      description: 'Đệm mút cao cấp, chân gỗ ash, thiết kế cong mềm mại.',
      price: 4890000,
      category: categoryDocs[0].slug,
      image: '/uploads/armchair.jpg',
      images: ['/uploads/armchair.jpg'],
      model3D: '/uploads/models/armchair.glb',
      stock: 30,
      rating: 4.8,
      reviewCount: 312,
      sku: 'ARM-HYG-02',
    },
    {
      name: 'Bàn ăn đá marble 6 chỗ',
      description: 'Mặt đá marble trắng vân mây, chân thép sơn tĩnh điện.',
      price: 12990000,
      category: categoryDocs[1].slug,
      image: '/uploads/dining-marble.jpg',
      images: ['/uploads/dining-marble.jpg', '/uploads/dining-marble-2.jpg'],
      model3D: '/uploads/models/dining.glb',
      stock: 7,
      rating: 4.6,
      reviewCount: 98,
      sku: 'DINING-MARBLE-6',
    },
    {
      name: 'Bàn ăn gỗ óc chó',
      description: 'Bàn chữ nhật 1m8, gỗ óc chó nguyên khối, hoàn thiện dầu lau.',
      price: 14950000,
      category: categoryDocs[1].slug,
      image: '/uploads/walnut-table.jpg',
      images: ['/uploads/walnut-table.jpg'],
      stock: 5,
      rating: 4.9,
      reviewCount: 62,
      sku: 'DINING-WALNUT-18',
    },
    {
      name: 'Đèn cây Arc',
      description: 'Đèn sàn cong kiểu Ý, chao vải, ánh sáng ấm.',
      price: 2590000,
      category: categoryDocs[2].slug,
      image: '/uploads/arc-lamp.jpg',
      images: ['/uploads/arc-lamp.jpg'],
      stock: 40,
      rating: 4.5,
      reviewCount: 121,
      sku: 'LAMP-ARC-01',
    },
    {
      name: 'Đèn bàn gốm Nhật',
      description: 'Đèn ngủ gốm men, tone beige, ánh sáng vàng dịu.',
      price: 1290000,
      category: categoryDocs[2].slug,
      image: '/uploads/ceramic-lamp.jpg',
      stock: 22,
      rating: 4.4,
      reviewCount: 56,
      sku: 'LAMP-CER-02',
    },
    {
      name: 'Ghế bar Velvet',
      description: 'Ghế quầy bar bọc nhung, chân kim loại xi vàng.',
      price: 1790000,
      category: categoryDocs[0].slug,
      image: '/uploads/barstool.jpg',
      stock: 28,
      rating: 4.3,
      reviewCount: 73,
      sku: 'BAR-VELVET-03',
    },
    {
      name: 'Kệ trang trí Ladder',
      description: 'Kệ gỗ treo tựa tường 5 tầng, phong cách tối giản.',
      price: 890000,
      category: categoryDocs[2].slug,
      image: '/uploads/ladder-shelf.jpg',
      stock: 33,
      rating: 4.2,
      reviewCount: 44,
      sku: 'SHELF-LADDER-01',
    },
    {
      name: 'Tủ trang trí Oakline',
      description: 'Tủ 2 cánh gỗ sồi, hoàn thiện veneer, chân kim loại đen.',
      price: 8490000,
      category: categoryDocs[2].slug,
      image: '/uploads/oak-cabinet.jpg',
      stock: 11,
      rating: 4.6,
      reviewCount: 51,
      sku: 'CAB-OAK-02',
    },
    {
      name: 'Bộ sofa đơn Padded',
      description: 'Cặp sofa đơn kèm bàn trà, tone xám trung tính.',
      price: 10500000,
      category: categoryDocs[0].slug,
      image: '/uploads/sofa-set.jpg',
      stock: 9,
      rating: 4.7,
      reviewCount: 84,
      sku: 'SOFA-SET-02',
    },
  ]);

  const [customer1, customer2, customer3] = users.filter((u) => u.role === 'customer');
  const orderPayload = [
    { status: 'pending', userId: customer1._id },
    { status: 'preparing', userId: customer1._id },
    { status: 'shipping', userId: customer1._id },
    { status: 'completed', userId: customer1._id },
    { status: 'cancelled', userId: customer2._id },
    { status: 'pending', userId: customer2._id },
    { status: 'shipping', userId: customer2._id },
    { status: 'completed', userId: customer2._id },
    { status: 'preparing', userId: customer3._id },
    { status: 'completed', userId: customer3._id },
  ];

  await Orders.insertMany(
    orderPayload.map((order, idx) => ({
      ...order,
      shippingAddress: `Căn hộ ${idx + 1} Landmark, Bình Thạnh`,
      paymentMethod: idx % 2 === 0 ? 'momo' : 'cod',
      items: [
        {
          productId: products[idx % products.length]._id,
          name: products[idx % products.length].name,
          price: products[idx % products.length].price,
          quantity: (idx % 3) + 1,
        },
        {
          productId: products[(idx + 1) % products.length]._id,
          name: products[(idx + 1) % products.length].name,
          price: products[(idx + 1) % products.length].price,
          quantity: 1,
        },
      ],
      total:
        products[idx % products.length].price * ((idx % 3) + 1) + products[(idx + 1) % products.length].price,
    })),
  );

  await Reviews.insertMany([
    {
      productId: products[0]._id,
      userId: customer1._id,
      rating: 5,
      comment: 'Sofa cực êm, màu sắc như hình và giao đúng hẹn.',
    },
    {
      productId: products[2]._id,
      userId: customer2._id,
      rating: 4,
      comment: 'Bàn đá đẹp, hơi nặng khi lắp đặt nhưng chắc chắn.',
    },
    {
      productId: products[4]._id,
      userId: customer3._id,
      rating: 5,
      comment: 'Đèn sáng ấm, hợp với phòng khách tone gỗ.',
    },
  ]);

  console.log('Seeding completed with:');
  console.log(`- ${users.length} users`);
  console.log(`- ${categoryDocs.length} categories`);
  console.log(`- ${products.length} products`);
  console.log('- 10 orders');
  console.log('- 3 reviews');
}

seed()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
