import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ShippingService } from './shipping.service';
import { UpdateShippingDto } from './dtos/shipping.dto';
import { CurrentUser } from '@common/decorators/user.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';

@ApiTags('Shipping')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('shipping')
export class ShippingController {
  constructor(private shippingService: ShippingService) {}

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Lấy thông tin vận chuyển của đơn' })
  async getByOrderId(@Param('orderId') orderId: string) {
    return this.shippingService.findByOrderId(orderId);
  }

  @Get('my-deliveries')
  @Roles('shipper')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Lấy danh sách giao hàng của tôi (Shipper)' })
  async getMyDeliveries(@CurrentUser('userId') userId: string) {
    return this.shippingService.findByShipperId(userId);
  }

  @Put('order/:orderId/update')
  @Roles('shipper')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Cập nhật trạng thái vận chuyển' })
  async updateStatus(@Param('orderId') orderId: string, @Body() updateDto: UpdateShippingDto) {
    return this.shippingService.updateStatus(orderId, updateDto);
  }
}
