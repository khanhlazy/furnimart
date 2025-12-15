import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShippingService } from './shipping.service';
import { ShippingController } from './shipping.controller';
import { ShippingTracking, ShippingTrackingSchema } from './schemas/shipping.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ShippingTracking.name, schema: ShippingTrackingSchema }]),
  ],
  controllers: [ShippingController],
  providers: [ShippingService],
  exports: [ShippingService],
})
export class ShippingModule {}
