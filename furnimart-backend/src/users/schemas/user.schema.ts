import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: false } })
export class User {
  @Prop({ required: true }) name: string;
  @Prop({ required: true, unique: true }) email: string;
  @Prop({ required: true }) password: string;

  @Prop() phone?: string;

  @Prop({ enum: ['customer', 'staff', 'manager', 'shipper', 'admin'], default: 'customer' })
  role: string;

  @Prop() branch?: string;
  @Prop() address?: string;
  @Prop() avatar?: string;

  @Prop({ default: true }) isActive: boolean;
  @Prop() createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
