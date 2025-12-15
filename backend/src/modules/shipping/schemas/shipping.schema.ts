import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ShippingTrackingDocument = HydratedDocument<ShippingTracking>;

@Schema({ timestamps: true })
export class ShippingTracking {
  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  orderId!: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true })
  shipperId!: string;

  @Prop({ default: 'pending', enum: ['pending', 'assigned', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned'] })
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

  @Prop({ type: Array, default: [] })
  trackingHistory!: Array<{
    status: string;
    location?: string;
    note?: string;
    timestamp: Date;
  }>;
}

export const ShippingTrackingSchema = SchemaFactory.createForClass(ShippingTracking);
