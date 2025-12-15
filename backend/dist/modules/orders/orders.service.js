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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schemas/order.schema");
const products_service_1 = require("../products/products.service");
let OrdersService = class OrdersService {
    constructor(orderModel, productsService) {
        this.orderModel = orderModel;
        this.productsService = productsService;
    }
    async create(customerId, createOrderDto) {
        if (!createOrderDto.items || createOrderDto.items.length === 0) {
            throw new common_1.BadRequestException('Giỏ hàng không được để trống');
        }
        let totalPrice = 0;
        let totalDiscount = 0;
        // Validate items
        for (const item of createOrderDto.items) {
            const product = await this.productsService.findById(item.productId);
            if (!product) {
                throw new common_1.BadRequestException(`Sản phẩm ${item.productId} không tồn tại`);
            }
            if (product.stock < item.quantity) {
                throw new common_1.BadRequestException(`Sản phẩm ${product.name} không đủ hàng (tồn kho: ${product.stock})`);
            }
            if (item.quantity <= 0) {
                throw new common_1.BadRequestException(`Số lượng sản phẩm phải lớn hơn 0`);
            }
            const itemTotal = product.price * item.quantity;
            const itemDiscount = (product.discount || 0) * item.quantity;
            totalPrice += itemTotal;
            totalDiscount += itemDiscount;
            // Decrease stock
            await this.productsService.decreaseStock(item.productId, item.quantity);
        }
        const order = await this.orderModel.create({
            customerId,
            items: createOrderDto.items,
            totalPrice,
            totalDiscount,
            shippingAddress: createOrderDto.shippingAddress,
            phone: createOrderDto.phone,
            paymentMethod: createOrderDto.paymentMethod || 'cod',
            notes: createOrderDto.notes,
            status: 'pending',
            isPaid: false,
        });
        return order;
    }
    async findByCustomerId(customerId) {
        return this.orderModel.find({ customerId }).sort({ createdAt: -1 });
    }
    async findAll(filters) {
        const query = {};
        if (filters?.status)
            query.status = filters.status;
        if (filters?.customerId)
            query.customerId = filters.customerId;
        if (filters?.shipperId)
            query.shipperId = filters.shipperId;
        return this.orderModel.find(query).sort({ createdAt: -1 });
    }
    async findById(id) {
        const order = await this.orderModel.findById(id);
        if (!order) {
            throw new common_1.NotFoundException('Đơn hàng không tồn tại');
        }
        return order;
    }
    async updateStatus(id, updateDto) {
        const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(updateDto.status)) {
            throw new common_1.BadRequestException('Trạng thái không hợp lệ');
        }
        const order = await this.orderModel.findByIdAndUpdate(id, { status: updateDto.status }, { new: true });
        if (!order) {
            throw new common_1.NotFoundException('Đơn hàng không tồn tại');
        }
        return order;
    }
    async assignShipper(orderId, shipperId) {
        const order = await this.orderModel.findByIdAndUpdate(orderId, { shipperId, status: 'shipped' }, { new: true });
        if (!order) {
            throw new common_1.NotFoundException('Đơn hàng không tồn tại');
        }
        return order;
    }
    async cancelOrder(orderId) {
        const order = await this.findById(orderId);
        // Restore stock
        for (const item of order.items) {
            const product = await this.productsService.findById(item.productId.toString());
            if (product) {
                await this.productsService.update(item.productId.toString(), {
                    stock: product.stock + item.quantity,
                });
            }
        }
        return this.updateStatus(orderId, { status: 'cancelled' });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        products_service_1.ProductsService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map