import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(userData: any): Promise<UserDocument> {
    return this.userModel.create(userData);
  }

  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email });
  }

  async findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }

  async findAll(role?: string): Promise<UserDocument[]> {
    if (role) {
      return this.userModel.find({ role });
    }
    return this.userModel.find();
  }

  async update(id: string, userData: any): Promise<UserDocument | null> {
    // Hash password if provided
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    return this.userModel.findByIdAndUpdate(id, userData, { new: true });
  }

  async delete(id: string): Promise<UserDocument | null> {
    return this.userModel.findByIdAndDelete(id);
  }
}
