import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export type ShippingTrackingDocument = HydratedDocument<ShippingTracking>;
export declare class ShippingTracking {
    orderId: string;
    shipperId: string;
    status: string;
    currentLocation?: string;
    estimatedDelivery?: Date;
    proofOfDeliveryImage?: string;
    customerSignature?: string;
    deliveryNote?: string;
}
export declare const ShippingTrackingSchema: MongooseSchema<ShippingTracking, import("mongoose").Model<ShippingTracking, any, any, any, import("mongoose").Document<unknown, any, ShippingTracking, any, {}> & ShippingTracking & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ShippingTracking, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<ShippingTracking>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ShippingTracking> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=shipping.schema.d.ts.map