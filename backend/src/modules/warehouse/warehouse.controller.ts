import { Controller, Get, Post, Put, Param, Body, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto, WarehouseTransactionDto, AdjustStockDto } from './dtos/warehouse.dto';

@ApiTags('Warehouse')
@Controller('warehouse')
export class WarehouseController {
  constructor(private warehouseService: WarehouseService) {}

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Tạo kho mới (Admin/Manager)' })
  async create(@Request() req: any, @Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehouseService.create(createWarehouseDto, req.user.userId);
  }

  @Get()
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Lấy danh sách kho (Admin/Manager)' })
  async findAll() {
    return this.warehouseService.findAll();
  }

  @Get('low-stock')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Lấy sản phẩm sắp hết hàng (Admin/Manager)' })
  async getLowStockItems(@Query('threshold') threshold?: string) {
    return this.warehouseService.getLowStockItems(threshold ? parseInt(threshold) : undefined);
  }

  @Get('product/:productId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Lấy thông tin kho theo sản phẩm' })
  async findByProductId(@Param('productId') productId: string) {
    return this.warehouseService.findByProductId(productId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Lấy chi tiết kho' })
  async findById(@Param('id') id: string) {
    return this.warehouseService.findById(id);
  }

  @Post(':id/transaction')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Thêm giao dịch kho' })
  async addTransaction(
    @Param('id') id: string,
    @Request() req: any,
    @Body() transactionDto: WarehouseTransactionDto,
  ) {
    return this.warehouseService.addTransaction(id, { ...transactionDto, userId: req.user.userId });
  }

  @Put(':id/adjust')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager')
  @ApiOperation({ summary: 'Điều chỉnh tồn kho' })
  async adjustStock(
    @Param('id') id: string,
    @Request() req: any,
    @Body() adjustStockDto: AdjustStockDto,
  ) {
    return this.warehouseService.adjustStock(id, adjustStockDto, req.user.userId);
  }

  @Post('reserve/:productId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager', 'employee')
  @ApiOperation({ summary: 'Đặt trước hàng (khi tạo đơn hàng)' })
  async reserveStock(
    @Param('productId') productId: string,
    @Body() body: { quantity: number },
  ) {
    return this.warehouseService.reserveStock(productId, body.quantity);
  }

  @Post('release/:productId')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin', 'manager', 'employee')
  @ApiOperation({ summary: 'Giải phóng hàng đã đặt (khi hủy đơn)' })
  async releaseReservedStock(
    @Param('productId') productId: string,
    @Body() body: { quantity: number },
  ) {
    return this.warehouseService.releaseReservedStock(productId, body.quantity);
  }
}

