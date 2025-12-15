import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from './schemas/settings.schema';
import { UpdateSettingsDto } from './dtos/settings.dto';

@Injectable()
export class SettingsService {
  constructor(@InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>) {}

  async getSettings(key: string = 'theme'): Promise<SettingsDocument> {
    const existingSettings = await this.settingsModel.findOne({ key }).exec();
    
    // If no settings exist, create default
    if (existingSettings) {
      return existingSettings;
    }
    
    return this.createDefaultSettings(key);
  }

  async updateSettings(key: string, updateDto: UpdateSettingsDto): Promise<SettingsDocument> {
    const settings = await this.settingsModel.findOneAndUpdate(
      { key },
      { $set: { value: updateDto.value } },
      { new: true, upsert: true }
    ).exec();
    
    if (!settings) {
      // This should never happen with upsert: true, but TypeScript needs this
      return this.createDefaultSettings(key);
    }
    
    return settings;
  }

  private async createDefaultSettings(key: string): Promise<SettingsDocument> {
    const defaultSettings = {
      key,
      value: {
        newsletter: {
          title: 'Đăng ký nhận bản tin',
          subtitle: 'Nhận thông tin sản phẩm mới, khuyến mãi đặc biệt',
          placeholder: 'Nhập email của bạn',
          buttonText: 'Đăng ký',
          enabled: true,
        },
        footer: {
          about: 'Nền tảng thương mại điện tử nội thất hàng đầu, cung cấp sản phẩm chất lượng với giá cạnh tranh.',
          address: '123 Nguyễn Hue, TP.HCM',
          phone: '0123 456 789',
          email: 'info@furnimart.com',
          socialMedia: {
            facebook: '#',
            instagram: '#',
            twitter: '#',
          },
          quickLinks: [
            { label: 'Sản phẩm', url: '/products' },
            { label: 'Đơn hàng', url: '/orders' },
            { label: 'Về chúng tôi', url: '#' },
            { label: 'Blog', url: '#' },
          ],
          supportLinks: [
            { label: 'Hướng dẫn mua hàng', url: '#' },
            { label: 'Chính sách đổi trả', url: '#' },
            { label: 'Chính sách bảo mật', url: '#' },
            { label: 'Điều khoản dịch vụ', url: '#' },
          ],
          copyright: '© 2024 FurniMart. Tất cả quyền được bảo lưu.',
        },
        header: {
          logoText: 'FurniMart',
          searchPlaceholder: 'Tìm sản phẩm...',
        },
      },
    };

    return this.settingsModel.create(defaultSettings);
  }
}

