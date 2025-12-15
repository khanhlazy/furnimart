import { Model } from 'mongoose';
import { ReviewDocument } from './schemas/review.schema';
import { CreateReviewDto } from './dtos/review.dto';
export declare class ReviewsService {
    private reviewModel;
    constructor(reviewModel: Model<ReviewDocument>);
    create(customerId: string, createReviewDto: CreateReviewDto): Promise<ReviewDocument>;
    findByProductId(productId: string): Promise<ReviewDocument[]>;
    findByCustomerId(customerId: string): Promise<ReviewDocument[]>;
    update(id: string, updateData: any): Promise<ReviewDocument | null>;
    delete(id: string): Promise<ReviewDocument | null>;
}
//# sourceMappingURL=reviews.service.d.ts.map