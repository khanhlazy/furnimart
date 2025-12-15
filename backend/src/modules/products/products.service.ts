import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async create(createProductDto: CreateProductDto): Promise<ProductDocument> {
    return this.productModel.create(createProductDto);
  }

  async findAll(filters?: any): Promise<ProductDocument[]> {
    const query: any = { isActive: true };
    
    if (filters?.category) query.category = filters.category;
    
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

  async findById(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDocument> {
    const product = await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }
    return product;
  }

  async delete(id: string): Promise<ProductDocument> {
    const product = await this.productModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }
    return product;
  }

  async decreaseStock(id: string, quantity: number): Promise<ProductDocument> {
    const product = await this.productModel.findByIdAndUpdate(
      id,
      { $inc: { stock: -quantity } },
      { new: true },
    );
    if (!product) {
      throw new NotFoundException('Sản phẩm không tồn tại');
    }
    return product;
  }
}
