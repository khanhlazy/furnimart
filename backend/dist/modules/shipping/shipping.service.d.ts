import { Model } from 'mongoose';
import { ShippingTrackingDocument } from './schemas/shipping.schema';
import { UpdateShippingDto } from './dtos/shipping.dto';
export declare class ShippingService {
    private shippingModel;
    constructor(shippingModel: Model<ShippingTrackingDocument>);
    create(orderId: string, shipperId: string): Promise<ShippingTrackingDocument>;
    findByOrderId(orderId: string): Promise<ShippingTrackingDocument | null>;
    findByShipperId(shipperId: string): Promise<ShippingTrackingDocument[]>;
    updateStatus(orderId: string, updateDto: UpdateShippingDto): Promise<ShippingTrackingDocument | null>;
}
//# sourceMappingURL=shipping.service.d.ts.map