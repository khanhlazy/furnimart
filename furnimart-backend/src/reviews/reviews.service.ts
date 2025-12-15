import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../products/schemas/product.schema';
import { Review } from './schemas/review.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private model: Model<Review>,
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  list(productId: string) {
    return this.model.find({ productId }).sort({ createdAt: -1 });
  }

  async create(userId: string, payload: Partial<Review>) {
    const review = await this.model.create({ ...payload, userId });

    // cập nhật điểm trung bình cho sản phẩm
    const productReviews = await this.model.aggregate([
      { $match: { productId: review.productId } },
      { $group: { _id: '$productId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    const stats = productReviews[0];
    if (stats) {
      await this.productModel.findByIdAndUpdate(review.productId, {
        rating: Math.round(stats.avgRating * 10) / 10,
        reviewCount: stats.count,
      });
    }

    return review;
  }
}
