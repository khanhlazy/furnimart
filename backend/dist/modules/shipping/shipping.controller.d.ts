import { ShippingService } from './shipping.service';
import { UpdateShippingDto } from './dtos/shipping.dto';
export declare class ShippingController {
    private shippingService;
    constructor(shippingService: ShippingService);
    getByOrderId(orderId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/shipping.schema").ShippingTracking, {}, {}> & import("./schemas/shipping.schema").ShippingTracking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    getMyDeliveries(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/shipping.schema").ShippingTracking, {}, {}> & import("./schemas/shipping.schema").ShippingTracking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    updateStatus(orderId: string, updateDto: UpdateShippingDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/shipping.schema").ShippingTracking, {}, {}> & import("./schemas/shipping.schema").ShippingTracking & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
//# sourceMappingURL=shipping.controller.d.ts.map