import { Controller, Get, Post, Put, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dtos/order.dto';
import { CurrentUser } from '@common/decorators/user.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Tạo đơn hàng mới' })
  async create(@CurrentUser('userId') userId: string, @Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(userId, createOrderDto);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Lấy đơn hàng của tôi' })
  async getMyOrders(@CurrentUser('userId') userId: string) {
    return this.ordersService.findByCustomerId(userId);
  }

  @Get()
  @Roles('admin', 'manager', 'employee')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Lấy tất cả đơn hàng' })
  async findAll(@Query() filters: any) {
    return this.ordersService.findAll(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết đơn hàng' })
  async findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }

  @Put(':id/status')
  @Roles('admin', 'manager', 'employee')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Cập nhật trạng thái đơn hàng' })
  async updateStatus(@Param('id') id: string, @Body() updateDto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, updateDto);
  }

  @Put(':id/assign-shipper')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Phân công shipper' })
  async assignShipper(@Param('id') orderId: string, @Body() body: any) {
    return this.ordersService.assignShipper(orderId, body.shipperId);
  }
}
