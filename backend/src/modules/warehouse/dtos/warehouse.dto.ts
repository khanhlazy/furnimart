import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';

export class CreateWarehouseDto {
  @IsString()
  productId!: string;

  @IsNumber()
  @Min(0)
  quantity!: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsNumber()
  minStockLevel?: number;

  @IsOptional()
  @IsNumber()
  maxStockLevel?: number;
}

export class WarehouseTransactionDto {
  @IsString()
  productId!: string;

  @IsNumber()
  quantity!: number; // Positive for import, negative for export

  @IsEnum(['import', 'export', 'adjustment', 'damaged', 'returned'])
  type!: string;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsString()
  note?: string;
}

export class AdjustStockDto {
  @IsNumber()
  quantity!: number;

  @IsString()
  note?: string;
}

