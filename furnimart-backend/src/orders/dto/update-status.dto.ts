import { IsIn } from 'class-validator';

export class UpdateStatusDto {
  @IsIn(['pending', 'confirmed', 'preparing', 'shipping', 'delivered', 'cancelled', 'failed'])
  status: string;
}
