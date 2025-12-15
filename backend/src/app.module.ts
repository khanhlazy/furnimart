import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ShippingModule } from './modules/shipping/shipping.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ChatModule } from './modules/chat/chat.module';
import { WarehouseModule } from './modules/warehouse/warehouse.module';
import { DisputesModule } from './modules/disputes/disputes.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(
      process.env.MONGODB_URI || 'mongodb://localhost:27017/furnimart',
      {
        serverSelectionTimeoutMS: 5000,
      },
    ),
    AuthModule,
    UsersModule,
    ProductsModule,
    OrdersModule,
    ShippingModule,
    ReviewsModule,
    DashboardModule,
    CategoriesModule,
    ChatModule,
    WarehouseModule,
    DisputesModule,
    SettingsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
