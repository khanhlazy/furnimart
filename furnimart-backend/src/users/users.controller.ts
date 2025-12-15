import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtGuard)
export class UsersController {
  constructor(private service: UsersService) {}

  @Get('me')
  me(@Req() req: any) {
    return this.service.findById(req.user.id);
  }

  @Get()
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @Roles('admin', 'manager')
  @UseGuards(RolesGuard)
  findOne(@Param('id') id: string) {
    return this.service.findById(id);
  }
}
