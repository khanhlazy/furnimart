import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';
export declare class ProductsController {
    private productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/product.schema").Product, {}, {}> & import("./schemas/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    findAll(filters: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/product.schema").Product, {}, {}> & import("./schemas/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findById(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/product.schema").Product, {}, {}> & import("./schemas/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(id: string, updateProductDto: UpdateProductDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/product.schema").Product, {}, {}> & import("./schemas/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    delete(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/product.schema").Product, {}, {}> & import("./schemas/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
}
//# sourceMappingURL=products.controller.d.ts.map