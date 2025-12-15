import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { productImageStorage } from '../config/uploads.config';
import { ProductsService } from './products.service';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private service: ProductsService) {}

  @Get()
  findAll(@Query() q: ProductQueryDto) {
    return this.service.findAll(q);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('staff', 'admin')
  @UseInterceptors(FileInterceptor('image', { storage: productImageStorage }))
  create(@Body() body: CreateProductDto, @UploadedFile() file?: Express.Multer.File) {
    return this.service.create(body, file);
  }

  @Put(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('staff', 'admin')
  @UseInterceptors(FileInterceptor('image', { storage: productImageStorage }))
  update(
    @Param('id') id: string,
    @Body() body: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.service.update(id, body, file);
  }

  @Delete(':id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
