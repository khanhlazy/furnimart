import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private model: Model<UserDocument>) {}

  async findById(id: string) {
    const user = await this.model.findById(id).select('-password');
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findAll() {
    return this.model.find().select('-password');
  }
}
