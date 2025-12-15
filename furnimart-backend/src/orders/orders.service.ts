import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';

@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private model: Model<Order>) {}

  create(data: Partial<Order>) {
    const total = (data.items || []).reduce((sum, item: any) => sum + item.price * item.quantity, 0);
    return this.model.create({
      ...data,
      status: 'pending',
      total: total + (data.shippingFee || 0),
    });
  }

  findAllForUser(userId: string) {
    return this.model.find({ userId }).sort({ createdAt: -1 });
  }

  updateStatus(id: string, status: Order['status']) {
    return this.model.findByIdAndUpdate(id, { status }, { new: true });
  }

  async findOne(id: string) {
    const order = await this.model.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  findAll() {
    return this.model.find().sort({ createdAt: -1 });
  }
}
