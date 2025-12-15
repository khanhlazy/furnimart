import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dtos/order.dto';
export declare class OrdersController {
    private ordersService;
    constructor(ordersService: OrdersService);
    create(userId: string, createOrderDto: CreateOrderDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order, {}, {}> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getMyOrders(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order, {}, {}> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findAll(filters: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order, {}, {}> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order, {}, {}> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateStatus(id: string, updateDto: UpdateOrderStatusDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order, {}, {}> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    assignShipper(orderId: string, body: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/order.schema").Order, {}, {}> & import("./schemas/order.schema").Order & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
//# sourceMappingURL=orders.controller.d.ts.map