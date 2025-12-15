import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dtos/review.dto';
import { BaseService } from '@common/base/base.service';

@Injectable()
export class ReviewsService extends BaseService<ReviewDocument> {
  protected model: Model<ReviewDocument>;

  constructor(@InjectModel(Review.name) protected reviewModel: Model<ReviewDocument>) {
    super();
    this.model = reviewModel;
  }

  // Override create to match base signature but add custom logic
  async create(createDto: any): Promise<ReviewDocument> {
    // This method is not used, we use createReview instead
    return this.reviewModel.create(createDto);
  }

  async createReview(customerId: string, createReviewDto: CreateReviewDto): Promise<ReviewDocument> {
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
}
