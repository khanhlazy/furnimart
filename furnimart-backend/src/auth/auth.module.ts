import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { jwtConstants } from './constants';
import { User, UserSchema } from '../users/schemas/user.schema';
import { JwtGuard } from './jwt.guard';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtGuard, RolesGuard],
  exports: [JwtModule, MongooseModule, JwtGuard, RolesGuard],
})
export class AuthModule {}
