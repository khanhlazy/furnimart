import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SeedService } from './seed.service';
import { User, UserSchema } from '../modules/users/schemas/user.schema';
import { Product, ProductSchema } from '../modules/products/schemas/product.schema';
import { Order, OrderSchema } from '../modules/orders/schemas/order.schema';
import { Review, ReviewSchema } from '../modules/reviews/schemas/review.schema';
import { Category, CategorySchema } from '../modules/categories/schemas/category.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/furnimart?authSource=admin',
      {
        serverSelectionTimeoutMS: 5000,
      },
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Category.name, schema: CategorySchema },
    ]),
  ],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
