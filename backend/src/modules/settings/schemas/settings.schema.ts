import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SettingsDocument = HydratedDocument<Settings>;

@Schema({ timestamps: true })
export class Settings {
  @Prop({ required: true, unique: true, default: 'theme' })
  key!: string;

  @Prop({ type: Object, required: true })
  value!: {
    // Newsletter Section
    newsletter?: {
      title?: string;
      subtitle?: string;
      placeholder?: string;
      buttonText?: string;
      enabled?: boolean;
    };
    // Footer
    footer?: {
      about?: string;
      address?: string;
      phone?: string;
      email?: string;
      socialMedia?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
      };
      quickLinks?: Array<{ label: string; url: string }>;
      supportLinks?: Array<{ label: string; url: string }>;
      copyright?: string;
    };
    // Header/Navbar
    header?: {
      logoText?: string;
      searchPlaceholder?: string;
    };
  };
}

export const SettingsSchema = SchemaFactory.createForClass(Settings);

