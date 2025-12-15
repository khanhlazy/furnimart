import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ShippingTracking, ShippingTrackingDocument } from './schemas/shipping.schema';
import { UpdateShippingDto } from './dtos/shipping.dto';

@Injectable()
export class ShippingService {
  constructor(
    @InjectModel(ShippingTracking.name)
    private shippingModel: Model<ShippingTrackingDocument>,
  ) {}

  async create(orderId: string, shipperId: string): Promise<ShippingTrackingDocument> {
    return this.shippingModel.create({
      orderId,
      shipperId,
      status: 'pending',
    });
  }

  async findByOrderId(orderId: string): Promise<ShippingTrackingDocument | null> {
    return this.shippingModel.findOne({ orderId });
  }

  async findByShipperId(shipperId: string): Promise<ShippingTrackingDocument[]> {
    return this.shippingModel.find({ shipperId });
  }

  async updateStatus(orderId: string, updateDto: UpdateShippingDto): Promise<ShippingTrackingDocument | null> {
    const tracking = await this.shippingModel.findOne({ orderId }).exec();
    if (!tracking) {
      return null;
    }

    // Add to tracking history
    const historyEntry = {
      status: updateDto.status || tracking.status,
      location: updateDto.currentLocation || tracking.currentLocation,
      note: updateDto.deliveryNote,
      timestamp: new Date(),
    };

    tracking.trackingHistory.push(historyEntry);

    // Update current status and other fields
    if (updateDto.status) tracking.status = updateDto.status as any;
    if (updateDto.currentLocation !== undefined) tracking.currentLocation = updateDto.currentLocation;
    if (updateDto.proofOfDeliveryImage) tracking.proofOfDeliveryImage = updateDto.proofOfDeliveryImage;
    if (updateDto.customerSignature) tracking.customerSignature = updateDto.customerSignature;
    if (updateDto.deliveryNote) tracking.deliveryNote = updateDto.deliveryNote;
    if (updateDto.estimatedDelivery) tracking.estimatedDelivery = new Date(updateDto.estimatedDelivery);

    return tracking.save();
  }
}
