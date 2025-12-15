import { Model } from 'mongoose';
import { OrderDocument } from '../orders/schemas/order.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { UserDocument } from '../users/schemas/user.schema';
export declare class DashboardService {
    private orderModel;
    private productModel;
    private userModel;
    constructor(orderModel: Model<OrderDocument>, productModel: Model<ProductDocument>, userModel: Model<UserDocument>);
    getStats(): Promise<{
        totalOrders: number;
        totalRevenue: any;
        totalProducts: number;
        totalUsers: number;
        totalCustomers: number;
    }>;
    getOrderStats(days?: number): Promise<any[]>;
    getTopProducts(limit?: number): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, Product, {}, {}> & Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, Product, {}, {}> & Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getOrdersByStatus(): Promise<any[]>;
}
//# sourceMappingURL=dashboard.service.d.ts.map