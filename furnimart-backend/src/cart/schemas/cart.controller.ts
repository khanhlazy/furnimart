import { Controller, Get, Post, Delete, Body, Param, Req, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { JwtGuard } from '../auth/jwt.guard';

@Controller('cart')
@UseGuards(JwtGuard)
export class CartController {
  constructor(private service: CartService) {}

  @Get()
  get(@Req() req) {
    return this.service.get(req.user.id);
  }

  @Post('add')
  add(@Req() req, @Body() body: any) {
    return this.service.add(req.user.id, body);
  }

  @Delete('remove/:id')
  remove(@Req() req, @Param('id') id: string) {
    return this.service.remove(req.user.id, id);
  }
}
