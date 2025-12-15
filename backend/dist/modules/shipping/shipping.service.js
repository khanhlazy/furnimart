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
exports.ShippingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shipping_schema_1 = require("./schemas/shipping.schema");
let ShippingService = class ShippingService {
    constructor(shippingModel) {
        this.shippingModel = shippingModel;
    }
    async create(orderId, shipperId) {
        return this.shippingModel.create({
            orderId,
            shipperId,
            status: 'pending',
        });
    }
    async findByOrderId(orderId) {
        return this.shippingModel.findOne({ orderId });
    }
    async findByShipperId(shipperId) {
        return this.shippingModel.find({ shipperId });
    }
    async updateStatus(orderId, updateDto) {
        return this.shippingModel.findOneAndUpdate({ orderId }, {
            status: updateDto.status,
            currentLocation: updateDto.currentLocation,
            proofOfDeliveryImage: updateDto.proofOfDeliveryImage,
            customerSignature: updateDto.customerSignature,
            deliveryNote: updateDto.deliveryNote,
        }, { new: true });
    }
};
exports.ShippingService = ShippingService;
exports.ShippingService = ShippingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(shipping_schema_1.ShippingTracking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ShippingService);
//# sourceMappingURL=shipping.service.js.map