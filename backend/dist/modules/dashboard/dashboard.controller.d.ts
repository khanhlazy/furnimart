import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<{
        totalOrders: number;
        totalRevenue: any;
        totalProducts: number;
        totalUsers: number;
        totalCustomers: number;
    }>;
    getOrderStats(days?: string): Promise<any[]>;
    getTopProducts(limit?: string): Promise<(import("mongoose").Document<unknown, {}, import("mongoose").Document<unknown, {}, import("../products/schemas/product.schema").Product, {}, {}> & import("../products/schemas/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }, {}, {}> & import("mongoose").Document<unknown, {}, import("../products/schemas/product.schema").Product, {}, {}> & import("../products/schemas/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & Required<{
        _id: import("mongoose").Types.ObjectId;
    }>)[]>;
    getOrdersByStatus(): Promise<any[]>;
}
//# sourceMappingURL=dashboard.controller.d.ts.map