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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
let ProductsService = class ProductsService {
    constructor(productModel) {
        this.productModel = productModel;
    }
    async create(createProductDto) {
        return this.productModel.create(createProductDto);
    }
    async findAll(filters) {
        const query = { isActive: true };
        if (filters?.category)
            query.category = filters.category;
        if (filters?.search) {
            query.$or = [
                { name: new RegExp(filters.search, 'i') },
                { description: new RegExp(filters.search, 'i') },
            ];
        }
        if (filters?.minPrice || filters?.minPrice === 0) {
            query.price = { $gte: filters.minPrice };
        }
        if (filters?.maxPrice) {
            query.price = { ...query.price, $lte: filters.maxPrice };
        }
        const limit = Math.min(parseInt(filters?.limit) || 20, 100);
        const skip = Math.max(parseInt(filters?.skip) || 0, 0);
        return this.productModel.find(query).limit(limit).skip(skip).exec();
    }
    async findById(id) {
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        }
        return product;
    }
    async update(id, updateProductDto) {
        const product = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
        if (!product) {
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        }
        return product;
    }
    async delete(id) {
        const product = await this.productModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
        if (!product) {
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        }
        return product;
    }
    async decreaseStock(id, quantity) {
        const product = await this.productModel.findByIdAndUpdate(id, { $inc: { stock: -quantity } }, { new: true });
        if (!product) {
            throw new common_1.NotFoundException('Sản phẩm không tồn tại');
        }
        return product;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductsService);
//# sourceMappingURL=products.service.js.map