import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private service: ReviewsService) {}

  @Get(':productId')
  list(@Param('productId') productId: string) {
    return this.service.list(productId);
  }

  @Post(':productId')
  @UseGuards(JwtGuard)
  create(@Req() req: any, @Param('productId') productId: string, @Body() body: any) {
    return this.service.create(req.user.id, { ...body, productId });
  }
}
