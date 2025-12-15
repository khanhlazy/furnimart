import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

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
  status: 'pending' | 'preparing' | 'shipping' | 'completed' | 'cancelled';

  @Prop()
  shippingAddress?: string;

  @Prop()
  paymentMethod?: string;

  @Prop({ default: 0 })
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
