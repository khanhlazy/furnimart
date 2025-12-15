"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("../orders/schemas/order.schema");
const product_schema_1 = require("../products/schemas/product.schema");
const user_schema_1 = require("../users/schemas/user.schema");
let DashboardService = class DashboardService {
    constructor(orderModel, productModel, userModel) {
        this.orderModel = orderModel;
        this.productModel = productModel;
        this.userModel = userModel;
    }
    async getStats() {
        const totalOrders = await this.orderModel.countDocuments();
        const totalRevenue = await this.orderModel.aggregate([
            { $match: { isPaid: true } },
            { $group: { _id: null, total: { $sum: '$totalPrice' } } },
        ]);
        const totalProducts = await this.productModel.countDocuments({ isActive: true });
        const totalUsers = await this.userModel.countDocuments();
        const totalCustomers = await this.userModel.countDocuments({ role: 'customer' });
        return {
            totalOrders,
            totalRevenue: totalRevenue[0]?.total || 0,
            totalProducts,
            totalUsers,
            totalCustomers,
        };
    }
    async getOrderStats(days = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return this.orderModel.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 },
                    revenue: { $sum: '$totalPrice' },
                },
            },
            { $sort: { _id: 1 } },
        ]);
    }
    async getTopProducts(limit = 10) {
        return this.productModel.find({ isActive: true }).limit(limit).sort({ rating: -1 });
    }
    async getOrdersByStatus() {
        return this.orderModel.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                },
            },
        ]);
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __param(1, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __param(2, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map