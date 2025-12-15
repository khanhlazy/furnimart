import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart } from './schemas/cart.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private model: Model<Cart>) {}

  get(userId: string) {
    return this.model.findOne({ userId });
  }

  async add(userId: string, item: any) {
    let cart = await this.model.findOne({ userId });
    if (!cart) {
      cart = await this.model.create({ userId, items: [item] });
    } else {
      cart.items.push(item);
      await cart.save();
    }
    return cart;
  }

  async remove(userId: string, productId: string) {
    const cart = await this.model.findOne({ userId });
    if (!cart) return null;
    cart.items = cart.items.filter(i => i.productId.toString() !== productId);
    return cart.save();
  }
}
