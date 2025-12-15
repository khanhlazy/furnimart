export declare class OrderItemDto {
    productId: string;
    quantity: number;
    productName: string;
    price: number;
    discount?: number;
}
export declare class CreateOrderDto {
    items: OrderItemDto[];
    shippingAddress: string;
    phone: string;
    paymentMethod?: string;
    notes?: string;
}
export declare class UpdateOrderStatusDto {
    status: string;
}
//# sourceMappingURL=order.dto.d.ts.map