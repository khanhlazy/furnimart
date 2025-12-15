import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwt: JwtService,
  ) {}

  private sign(user: UserDocument) {
    return this.jwt.sign({ id: user._id, email: user.email, role: user.role });
  }

  async register(dto: RegisterDto) {
    const existed = await this.userModel.findOne({ email: dto.email });
    if (existed) throw new BadRequestException('Email already exists');

    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password: hashed,
      phone: dto.phone,
      role: 'customer',
    });

    return {
      message: 'Registered successfully',
      token: this.sign(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    };
  }

  async login(dto: LoginDto) {
    const user = await this.userModel.findOne({ email: dto.email });
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const ok = await bcrypt.compare(dto.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid email or password');

    return {
      message: 'Login successful',
      token: this.sign(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    };
  }
}
