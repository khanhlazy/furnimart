import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';
import { SettingsService } from './settings.service';
import { UpdateSettingsDto } from './dtos/settings.dto';

@ApiTags('Settings')
@Controller('settings')
export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  @Get('theme')
  @ApiOperation({ summary: 'Lấy cấu hình giao diện' })
  async getThemeSettings() {
    const settings = await this.settingsService.getSettings('theme');
    return settings.value || {};
  }

  @Put('theme')
  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Cập nhật cấu hình giao diện (Admin only)' })
  async updateThemeSettings(@Body() updateDto: UpdateSettingsDto) {
    return this.settingsService.updateSettings('theme', updateDto);
  }
}

