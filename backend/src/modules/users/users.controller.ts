import { Controller, Get, Put, Delete, Param, Body, UseGuards, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CurrentUser } from '@common/decorators/user.decorator';
import { Roles } from '@common/decorators/roles.decorator';
import { RolesGuard } from '@common/guards/roles.guard';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser('userId') userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.formatUserResponse(user);
  }

  @Get()
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  async findAll() {
    const users = await this.usersService.findAll();
    return users.map((u) => this.formatUserResponse(u));
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.formatUserResponse(user);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() userData: any) {
    const user = await this.usersService.update(id, userData);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.formatUserResponse(user);
  }

  @Delete(':id')
  @Roles('admin')
  @UseGuards(RolesGuard)
  async delete(@Param('id') id: string) {
    const user = await this.usersService.delete(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User deleted successfully' };
  }

  private formatUserResponse(user: any) {
    const { password, ...rest } = user.toObject?.() || user;
    return rest;
  }
}
