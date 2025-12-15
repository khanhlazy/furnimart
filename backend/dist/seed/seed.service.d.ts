import { Model } from 'mongoose';
import { UserDocument } from '../modules/users/schemas/user.schema';
import { ProductDocument } from '../modules/products/schemas/product.schema';
import { OrderDocument } from '../modules/orders/schemas/order.schema';
import { ReviewDocument } from '../modules/reviews/schemas/review.schema';
export declare class SeedService {
    private userModel;
    private productModel;
    private orderModel;
    private reviewModel;
    constructor(userModel: Model<UserDocument>, productModel: Model<ProductDocument>, orderModel: Model<OrderDocument>, reviewModel: Model<ReviewDocument>);
    seed(): Promise<void>;
    private seedUsers;
    private seedProducts;
    private seedOrders;
    private seedReviews;
}
//# sourceMappingURL=seed.service.d.ts.map