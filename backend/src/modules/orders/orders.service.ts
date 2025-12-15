import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { CreateOrderDto, UpdateOrderStatusDto } from './dtos/order.dto';
import { ProductsService } from '../products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private productsService: ProductsService,
  ) {}

  async create(customerId: string, createOrderDto: CreateOrderDto): Promise<OrderDocument> {
    if (!createOrderDto.items || createOrderDto.items.length === 0) {
      throw new BadRequestException('Giỏ hàng không được để trống');
    }

    let totalPrice = 0;
    let totalDiscount = 0;

    // Validate items
    for (const item of createOrderDto.items) {
      const product = await this.productsService.findById(item.productId);
      if (!product) {
        throw new BadRequestException(`Sản phẩm ${item.productId} không tồn tại`);
      }

      if (product.stock < item.quantity) {
        throw new BadRequestException(`Sản phẩm ${product.name} không đủ hàng (tồn kho: ${product.stock})`);
      }

      if (item.quantity <= 0) {
        throw new BadRequestException(`Số lượng sản phẩm phải lớn hơn 0`);
      }

      const itemTotal = product.price * item.quantity;
      const itemDiscount = (product.discount || 0) * item.quantity;
      totalPrice += itemTotal;
      totalDiscount += itemDiscount;

      // Decrease stock
      await this.productsService.decreaseStock(item.productId, item.quantity);
    }

    const order = await this.orderModel.create({
      customerId,
      items: createOrderDto.items,
      totalPrice,
      totalDiscount,
      shippingAddress: createOrderDto.shippingAddress,
      phone: createOrderDto.phone,
      paymentMethod: createOrderDto.paymentMethod || 'cod',
      notes: createOrderDto.notes,
      status: 'pending',
      isPaid: false,
    });

    return order;
  }

  async findByCustomerId(customerId: string): Promise<OrderDocument[]> {
    return this.orderModel.find({ customerId }).sort({ createdAt: -1 });
  }

  async findAll(filters?: any): Promise<OrderDocument[]> {
    const query: any = {};
    if (filters?.status) query.status = filters.status;
    if (filters?.customerId) query.customerId = filters.customerId;
    if (filters?.shipperId) query.shipperId = filters.shipperId;

    return this.orderModel.find(query).sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<OrderDocument> {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }
    return order;
  }

  async updateStatus(id: string, updateDto: UpdateOrderStatusDto): Promise<OrderDocument> {
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(updateDto.status)) {
      throw new BadRequestException('Trạng thái không hợp lệ');
    }

    const order = await this.orderModel.findByIdAndUpdate(id, { status: updateDto.status }, { new: true });
    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }
    return order;
  }

  async assignShipper(orderId: string, shipperId: string): Promise<OrderDocument> {
    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      { shipperId, status: 'shipped' },
      { new: true },
    );
    if (!order) {
      throw new NotFoundException('Đơn hàng không tồn tại');
    }
    return order;
  }

  async cancelOrder(orderId: string): Promise<OrderDocument> {
    const order = await this.findById(orderId);
    
    // Restore stock
    for (const item of order.items) {
      const product = await this.productsService.findById(item.productId.toString());
      if (product) {
        await this.productsService.update(item.productId.toString(), {
          stock: product.stock + item.quantity,
        });
      }
    }

    return this.updateStatus(orderId, { status: 'cancelled' });
  }
}
