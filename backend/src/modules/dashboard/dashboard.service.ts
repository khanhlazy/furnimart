import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { User, UserDocument } from '../users/schemas/user.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async getStats() {
    const totalOrders = await this.orderModel.countDocuments();
    const totalRevenue = await this.orderModel.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);

    const totalProducts = await this.productModel.countDocuments({ isActive: true });
    const totalUsers = await this.userModel.countDocuments();
    const totalCustomers = await this.userModel.countDocuments({ role: 'customer' });

    return {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalProducts,
      totalUsers,
      totalCustomers,
    };
  }

  async getOrderStats(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return this.orderModel.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          revenue: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
  }

  async getTopProducts(limit = 10) {
    return this.productModel.find({ isActive: true }).limit(limit).sort({ rating: -1 });
  }

  async getOrdersByStatus() {
    return this.orderModel.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);
  }
}
