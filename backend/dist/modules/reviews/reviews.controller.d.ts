import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dtos/review.dto';
export declare class ReviewsController {
    private reviewsService;
    constructor(reviewsService: ReviewsService);
    create(userId: string, createReviewDto: CreateReviewDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/review.schema").Review, {}, {}> & import("./schemas/review.schema").Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findByProduct(productId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/review.schema").Review, {}, {}> & import("./schemas/review.schema").Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    getMyReviews(userId: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/review.schema").Review, {}, {}> & import("./schemas/review.schema").Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    update(id: string, updateData: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/review.schema").Review, {}, {}> & import("./schemas/review.schema").Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    delete(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/review.schema").Review, {}, {}> & import("./schemas/review.schema").Review & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
}
//# sourceMappingURL=reviews.controller.d.ts.map