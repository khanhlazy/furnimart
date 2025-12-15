import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    // Serve /uploads giống Express: app.use('/uploads', express.static('uploads'))
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    // MongoDB
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/furnimart'),

    // Modules
    AuthModule,
    ProductsModule,
    OrdersModule,
    UsersModule,
    ReviewsModule,
    ChatModule,
  ],
})
export class AppModule {}
