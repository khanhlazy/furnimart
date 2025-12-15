import { Body, Controller, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtGuard)
export class OrdersController {
  constructor(private service: OrdersService) {}

  @Get('me')
  myOrders(@Req() req: any) {
    return this.service.findAllForUser(req.user.id);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin', 'manager')
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Req() req: any, @Body() body: CreateOrderDto) {
    return this.service.create({ ...body, userId: req.user.id });
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('staff', 'manager', 'admin', 'shipper')
  updateStatus(@Param('id') id: string, @Body() body: UpdateStatusDto) {
    return this.service.updateStatus(id, body.status);
  }

  @Get(':id')
  detail(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
