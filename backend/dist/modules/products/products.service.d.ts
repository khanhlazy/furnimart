import { Model } from 'mongoose';
import { ProductDocument } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';
export declare class ProductsService {
    private productModel;
    constructor(productModel: Model<ProductDocument>);
    create(createProductDto: CreateProductDto): Promise<ProductDocument>;
    findAll(filters?: any): Promise<ProductDocument[]>;
    findById(id: string): Promise<ProductDocument>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<ProductDocument>;
    delete(id: string): Promise<ProductDocument>;
    decreaseStock(id: string, quantity: number): Promise<ProductDocument>;
}
//# sourceMappingURL=products.service.d.ts.map