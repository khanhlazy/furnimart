import { IsString, IsArray, IsOptional, IsNumber } from 'class-validator';

export class OrderItemDto {
  @IsString()
  productId!: string;

  @IsNumber()
  quantity!: number;

  @IsString()
  productName!: string;

  @IsNumber()
  price!: number;

  @IsOptional()
  @IsNumber()
  discount?: number;
}

export class CreateOrderDto {
  @IsArray()
  items!: OrderItemDto[];

  @IsString()
  shippingAddress!: string;

  @IsString()
  phone!: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateOrderStatusDto {
  @IsString()
  status!: string;
}
