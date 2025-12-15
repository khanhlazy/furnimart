import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
export type ReviewDocument = HydratedDocument<Review>;
export declare class Review {
    productId: string;
    customerId: string;
    customerName: string;
    rating: number;
    comment: string;
    images: string[];
    isVerified: boolean;
}
export declare const ReviewSchema: MongooseSchema<Review, import("mongoose").Model<Review, any, any, any, import("mongoose").Document<unknown, any, Review, any, {}> & Review & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Review, import("mongoose").Document<unknown, {}, import("mongoose").FlatRecord<Review>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Review> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
//# sourceMappingURL=review.schema.d.ts.map