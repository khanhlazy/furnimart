import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({ required: true })
  price!: number;

  @Prop({ default: 0 })
  discount!: number;

  @Prop({ default: 0 })
  stock!: number;

  @Prop({ type: [String], default: [] })
  images!: string[];

  @Prop()
  model3d?: string;

  @Prop({ required: true })
  category!: string;

  @Prop({ default: 0 })
  rating!: number;

  @Prop({ default: 0 })
  reviewCount!: number;

  @Prop({ default: true })
  isActive!: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
