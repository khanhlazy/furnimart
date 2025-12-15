import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true }) name: string;
  @Prop() description?: string;
  @Prop({ required: true }) price: number;
  @Prop() category?: string;

  @Prop() image?: string;
  @Prop([String]) images?: string[];
  @Prop() model3D?: string;

  @Prop({ default: 0 }) stock: number;
  @Prop({ default: 4.5 }) rating: number;
  @Prop({ default: 0 }) reviewCount: number;

  @Prop() sku?: string;
  @Prop({ default: true }) isActive: boolean;
}
export const ProductSchema = SchemaFactory.createForClass(Product);
