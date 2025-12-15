import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export type OrderDocument = HydratedDocument<Order>;
export declare class OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
    discount: number;
}
export declare class Order {
    customerId: string;
    items: OrderItem[];
    totalPrice: number;
    totalDiscount: number;
    shippingAddress: string;
    phone: string;
    status: string;
    paymentMethod: string;
    isPaid: boolean;
    notes?: string;
    shipperId?: string;
}
export declare const OrderSchema: MongooseSchema<Order, import("mongoose").Model<Order, any, any, any, import("mongoose").Document<unknown, any, Order, any, {}> & Order & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Order, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Order>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Order> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=order.schema.d.ts.map