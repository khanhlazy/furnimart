import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart } from './schemas/cart.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private model: Model<Cart>) {}

  async getByUser(userId: string) {
    return this.model.findOne({ userId });
  }

  async addItem(userId: string, productId: string, quantity = 1) {
    const cart = (await this.model.findOne({ userId })) ||
      (await this.model.create({ userId, items: [] }));

    const idx = cart.items.findIndex((i) => i.productId.toString() === productId);
    if (idx >= 0) {
      cart.items[idx].quantity += quantity;
    } else {
      cart.items.push({ productId: new Types.ObjectId(productId), quantity });
    }

    await cart.save();
    return cart;
  }

  async updateItem(userId: string, productId: string, quantity: number) {
    const cart = await this.model.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found');

    cart.items = cart.items.map((item) =>
      item.productId.toString() === productId ? { ...item, quantity } : item,
    );
    await cart.save();
    return cart;
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.model.findOne({ userId });
    if (!cart) throw new NotFoundException('Cart not found');

    cart.items = cart.items.filter((i) => i.productId.toString() !== productId);
    await cart.save();
    return cart;
  }
}
