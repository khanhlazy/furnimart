import { Model } from 'mongoose';
import { OrderDocument } from './schemas/order.schema';
import { CreateOrderDto, UpdateOrderStatusDto } from './dtos/order.dto';
import { ProductsService } from '../products/products.service';
export declare class OrdersService {
    private orderModel;
    private productsService;
    constructor(orderModel: Model<OrderDocument>, productsService: ProductsService);
    create(customerId: string, createOrderDto: CreateOrderDto): Promise<OrderDocument>;
    findByCustomerId(customerId: string): Promise<OrderDocument[]>;
    findAll(filters?: any): Promise<OrderDocument[]>;
    findById(id: string): Promise<OrderDocument>;
    updateStatus(id: string, updateDto: UpdateOrderStatusDto): Promise<OrderDocument>;
    assignShipper(orderId: string, shipperId: string): Promise<OrderDocument>;
    cancelOrder(orderId: string): Promise<OrderDocument>;
}
//# sourceMappingURL=orders.service.d.ts.map