import { IsString, IsOptional } from 'class-validator';

export class UpdateShippingDto {
  @IsString()
  status!: string;

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
}
