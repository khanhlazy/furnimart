import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private model: Model<Review>) {}

  list(productId: string) {
    return this.model.find({ productId }).sort({ createdAt: -1 });
  }

  create(userId: string, payload: Partial<Review>) {
    return this.model.create({ ...payload, userId });
  }
}
