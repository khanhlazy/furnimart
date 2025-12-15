import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private service: CategoriesService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin', 'manager', 'staff')
  create(@Body() body: any) {
    return this.service.create(body);
  }
}
