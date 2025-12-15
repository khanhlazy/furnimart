import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CreateReviewDto } from './dto/create-review.dto';
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
  create(
    @Req() req: any,
    @Param('productId') productId: string,
    @Body() body: Omit<CreateReviewDto, 'productId'>,
  ) {
    return this.service.create(req.user.id, { ...body, productId });
  }
}
