import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dtos/product.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {
    console.log('✅ ProductsController initialized');
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Tạo sản phẩm mới (Admin/Employee)' })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
  async findAll(@Query() filters: any) {
    console.log('📦 GET /products called with filters:', filters);
    const result = await this.productsService.findAll(filters);
    console.log('📦 Products count:', result.length);
    return result;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Lấy chi tiết sản phẩm' })
  async findById(@Param('id') id: string) {
    console.log('📦 GET /products/:id called with id:', id);
    return this.productsService.findById(id);
  }

  @Put(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Cập nhật sản phẩm' })
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Xóa sản phẩm' })
  async delete(@Param('id') id: string) {
    return this.productsService.delete(id);
  }
}
