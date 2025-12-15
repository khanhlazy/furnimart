import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  productId!: string;

  @Prop({ required: true })
  productName!: string;

  @Prop({ required: true })
  quantity!: number;

  @Prop({ required: true })
  price!: number;

  @Prop({ default: 0 })
  discount!: number;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  customerId!: string;

  @Prop({ type: [OrderItem], required: true })
  items!: OrderItem[];

  @Prop({ required: true })
  totalPrice!: number;

  @Prop({ default: 0 })
  totalDiscount!: number;

  @Prop({ required: true })
  shippingAddress!: string;

  @Prop({ required: true })
  phone!: string;

  @Prop({ default: 'pending', enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] })
  status!: string;

  @Prop({ default: 'cod', enum: ['cod', 'stripe', 'momo'] })
  paymentMethod!: string;

  @Prop({ default: false })
  isPaid!: boolean;

  @Prop()
  notes?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId })
  shipperId?: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
