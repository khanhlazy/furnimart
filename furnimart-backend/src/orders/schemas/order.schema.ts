import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  price: number;

  @Prop()
  name?: string;

  @Prop({ required: true, min: 1 })
  quantity: number;
}

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [OrderItem], default: [] })
  items: OrderItem[];

  @Prop({ default: 'pending' })
  status: 'pending' | 'confirmed' | 'preparing' | 'shipping' | 'delivered' | 'cancelled' | 'failed';

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  receiver: string;

  @Prop({ required: true })
  phone: string;

  @Prop()
  paymentMethod?: string;

  @Prop({ default: 0 })
  shippingFee: number;

  @Prop()
  note?: string;

  @Prop({ default: 0 })
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
