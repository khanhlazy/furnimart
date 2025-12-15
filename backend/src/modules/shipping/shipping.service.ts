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
    return this.shippingModel.findOneAndUpdate(
      { orderId },
      {
        status: updateDto.status,
        currentLocation: updateDto.currentLocation,
        proofOfDeliveryImage: updateDto.proofOfDeliveryImage,
        customerSignature: updateDto.customerSignature,
        deliveryNote: updateDto.deliveryNote,
      },
      { new: true },
    );
  }
}
