import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { DashboardService } from './dashboard.service';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('stats')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Lấy thống kê chung' })
  async getStats() {
    return this.dashboardService.getStats();
  }

  @Get('orders-stats')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Lấy thống kê đơn hàng' })
  async getOrderStats(@Query('days') days?: string) {
    const parsedDays = days ? parseInt(days, 10) : 30;
    return this.dashboardService.getOrderStats(parsedDays);
  }

  @Get('top-products')
  @ApiOperation({ summary: 'Lấy sản phẩm hàng đầu' })
  async getTopProducts(@Query('limit') limit?: string) {
    const parsedLimit = limit ? parseInt(limit, 10) : 10;
    return this.dashboardService.getTopProducts(parsedLimit);
  }

  @Get('orders-by-status')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Lấy đơn hàng theo trạng thái' })
  async getOrdersByStatus() {
    return this.dashboardService.getOrdersByStatus();
  }
}
