import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CartItemDto } from './dto/cart-item.dto';
import { CartService } from './cart.service';

@Controller('cart')
@UseGuards(JwtGuard)
export class CartController {
  constructor(private service: CartService) {}

  @Get()
  getCart(@Req() req: any) {
    return this.service.getByUser(req.user.id);
  }

  @Post(':productId')
  add(
    @Req() req: any,
    @Param('productId') productId: string,
    @Body() body: Partial<CartItemDto>,
  ) {
    return this.service.addItem(req.user.id, productId, Number(body.quantity || 1));
  }

  @Put(':productId')
  update(
    @Req() req: any,
    @Param('productId') productId: string,
    @Body() body: CartItemDto,
  ) {
    return this.service.updateItem(req.user.id, productId, Number(body.quantity));
  }

  @Delete(':productId')
  remove(@Req() req: any, @Param('productId') productId: string) {
    return this.service.removeItem(req.user.id, productId);
  }
}
