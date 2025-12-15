import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private model: Model<Category>) {}

  findAll() {
    return this.model.find({ isActive: true });
  }

  create(body: Partial<Category>) {
    return this.model.create(body);
  }
}
