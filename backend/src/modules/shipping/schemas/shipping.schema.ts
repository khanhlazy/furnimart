import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ShippingTrackingDocument = HydratedDocument<ShippingTracking>;

@Schema({ timestamps: true })
export class ShippingTracking {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  orderId!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  shipperId!: string;

  @Prop({ default: 'pending', enum: ['pending', 'in_transit', 'delivered'] })
  status!: string;

  @Prop()
  currentLocation?: string;

  @Prop()
  estimatedDelivery?: Date;

  @Prop()
  proofOfDeliveryImage?: string;

  @Prop()
  customerSignature?: string;

  @Prop()
  deliveryNote?: string;
}

export const ShippingTrackingSchema = SchemaFactory.createForClass(ShippingTracking);
