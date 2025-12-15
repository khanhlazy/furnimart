import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private model: Model<Product>) {}

  async findAll(query: any) {
    const { category, search, page = 1, limit = 12 } = query;
    const filter: any = { isActive: true };

    if (category) filter.category = category;
    if (search) filter.name = { $regex: search, $options: 'i' };

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      this.model.find(filter).skip(skip).limit(Number(limit)),
      this.model.countDocuments(filter),
    ]);

    return { products, totalPages: Math.ceil(total / limit), currentPage: page };
  }

  async findOne(id: string) {
    const product = await this.model.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(body: any, file?: Express.Multer.File) {
    return this.model.create({
      ...body,
      image: file ? `/uploads/${file.filename}` : null,
      sku: Date.now().toString(),
    });
  }

  async update(id: string, body: any, file?: Express.Multer.File) {
    const product = await this.model.findByIdAndUpdate(
      id,
      { ...body, ...(file && { image: `/uploads/${file.filename}` }) },
      { new: true },
    );
    if (!product) throw new NotFoundException();
    return product;
  }

  async remove(id: string) {
    await this.model.findByIdAndDelete(id);
    return { message: 'Product deleted' };
  }
}
