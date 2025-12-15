import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dtos/review.dto';

@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private reviewModel: Model<ReviewDocument>) {}

  async create(customerId: string, createReviewDto: CreateReviewDto): Promise<ReviewDocument> {
    return this.reviewModel.create({
      ...createReviewDto,
      customerId,
    });
  }

  async findByProductId(productId: string): Promise<ReviewDocument[]> {
    return this.reviewModel.find({ productId }).sort({ createdAt: -1 });
  }

  async findByCustomerId(customerId: string): Promise<ReviewDocument[]> {
    return this.reviewModel.find({ customerId });
  }

  async update(id: string, updateData: any): Promise<ReviewDocument | null> {
    return this.reviewModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async delete(id: string): Promise<ReviewDocument | null> {
    return this.reviewModel.findByIdAndDelete(id);
  }
}
