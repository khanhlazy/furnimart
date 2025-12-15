import { IsMongoId, IsNumber, Min } from 'class-validator';

export class CartItemDto {
  @IsMongoId()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
