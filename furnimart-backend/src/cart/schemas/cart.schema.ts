import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ unique: true }) userId: Types.ObjectId;

  @Prop([
    {
      productId: Types.ObjectId,
      quantity: Number,
      price: Number,
    },
  ])
  items: any[];
}
export const CartSchema = SchemaFactory.createForClass(Cart);
