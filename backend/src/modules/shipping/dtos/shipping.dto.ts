import { IsString, IsOptional, IsDateString } from 'class-validator';

export class UpdateShippingDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  currentLocation?: string;

  @IsOptional()
  @IsString()
  proofOfDeliveryImage?: string;

  @IsOptional()
  @IsString()
  customerSignature?: string;

  @IsOptional()
  @IsString()
  deliveryNote?: string;

  @IsOptional()
  @IsDateString()
  estimatedDelivery?: string;
}
