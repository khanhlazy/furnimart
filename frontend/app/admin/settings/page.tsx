'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useRequireAuth } from '@hooks/useRequireAuth';
import { settingsService, ThemeSettings } from '@services/settingsService';
import { toast } from 'react-toastify';
import { FiSave, FiPlus, FiTrash2 } from 'react-icons/fi';
import Layout from '@components/Layout';

export default function AdminSettingsPage() {
  const { user, isLoading } = useRequireAuth({ requiredRole: 'admin' });
  const queryClient = useQueryClient();
  const [settings, setSettings] = useState<ThemeSettings>({});

  const { data: themeSettings, isLoading: loadingSettings } = useQuery(
    ['settings', 'theme'],
    () => settingsService.getTheme(),
    {
      enabled: !isLoading && user?.role === 'admin',
    }
  );

  // Sync themeSettings to local state when data is loaded
  useEffect(() => {
    if (themeSettings) {
      setSettings(themeSettings);
    }
  }, [themeSettings]);

  const updateMutation = useMutation(
    (data: { value: ThemeSettings }) => settingsService.updateTheme(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['settings', 'theme']);
        toast.success('Cập nhật cấu hình thành công!');
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || 'Cập nhật thất bại');
      },
    }
  );

  const handleSave = () => {
    updateMutation.mutate({ value: settings });
  };

  const addQuickLink = () => {
    setSettings({
      ...settings,
      footer: {
        ...settings.footer,
        quickLinks: [...(settings.footer?.quickLinks || []), { label: '', url: '' }],
      },
    });
  };

  const removeQuickLink = (index: number) => {
    const links = settings.footer?.quickLinks || [];
    setSettings({
      ...settings,
      footer: {
        ...settings.footer,
        quickLinks: links.filter((_, i) => i !== index),
      },
    });
  };

  const addSupportLink = () => {
    setSettings({
      ...settings,
      footer: {
        ...settings.footer,
        supportLinks: [...(settings.footer?.supportLinks || []), { label: '', url: '' }],
      },
    });
  };

  const removeSupportLink = (index: number) => {
    const links = settings.footer?.supportLinks || [];
    setSettings({
      ...settings,
      footer: {
        ...settings.footer,
        supportLinks: links.filter((_, i) => i !== index),
      },
    });
  };

  if (isLoading || loadingSettings) {
    return (
      <Layout>
        <div className="section-shell flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      </Layout>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <Layout>
      <div className="section-shell">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-primary">Cài đặt giao diện</h1>
              <p className="text-gray-600 mt-2">Tùy chỉnh newsletter, footer và header</p>
            </div>
            <button
              onClick={handleSave}
              disabled={updateMutation.isLoading}
              className="btn-primary flex items-center gap-2"
            >
              <FiSave />
              {updateMutation.isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>

          <div className="space-y-6">
            {/* Newsletter Section */}
            <div className="panel">
              <h2 className="text-2xl font-bold mb-4">Newsletter Section</h2>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Tiêu đề</label>
                  <input
                    type="text"
                    value={settings.newsletter?.title || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        newsletter: { ...settings.newsletter, title: e.target.value },
                      })
                    }
                    className="input-field"
                    placeholder="Đăng ký nhận bản tin"
                  />
                </div>
                <div>
                  <label className="form-label">Mô tả</label>
                  <input
                    type="text"
                    value={settings.newsletter?.subtitle || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        newsletter: { ...settings.newsletter, subtitle: e.target.value },
                      })
                    }
                    className="input-field"
                    placeholder="Nhận thông tin sản phẩm mới, khuyến mãi đặc biệt"
                  />
                </div>
                <div>
                  <label className="form-label">Placeholder</label>
                  <input
                    type="text"
                    value={settings.newsletter?.placeholder || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        newsletter: { ...settings.newsletter, placeholder: e.target.value },
                      })
                    }
                    className="input-field"
                    placeholder="Nhập email của bạn"
                  />
                </div>
                <div>
                  <label className="form-label">Nút đăng ký</label>
                  <input
                    type="text"
                    value={settings.newsletter?.buttonText || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        newsletter: { ...settings.newsletter, buttonText: e.target.value },
                      })
                    }
                    className="input-field"
                    placeholder="Đăng ký"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={settings.newsletter?.enabled !== false}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        newsletter: { ...settings.newsletter, enabled: e.target.checked },
                      })
                    }
                    className="w-4 h-4"
                    id="newsletterEnabled"
                  />
                  <label htmlFor="newsletterEnabled" className="form-label mb-0">
                    Hiển thị newsletter section
                  </label>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div className="panel">
              <h2 className="text-2xl font-bold mb-4">Footer</h2>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Mô tả về công ty</label>
                  <textarea
                    value={settings.footer?.about || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, about: e.target.value },
                      })
                    }
                    className="input-field"
                    rows={3}
                    placeholder="Nền tảng thương mại điện tử nội thất hàng đầu..."
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Địa chỉ</label>
                    <input
                      type="text"
                      value={settings.footer?.address || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          footer: { ...settings.footer, address: e.target.value },
                        })
                      }
                      className="input-field"
                      placeholder="123 Nguyễn Hue, TP.HCM"
                    />
                  </div>
                  <div>
                    <label className="form-label">Số điện thoại</label>
                    <input
                      type="text"
                      value={settings.footer?.phone || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          footer: { ...settings.footer, phone: e.target.value },
                        })
                      }
                      className="input-field"
                      placeholder="0123 456 789"
                    />
                  </div>
                  <div>
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      value={settings.footer?.email || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          footer: { ...settings.footer, email: e.target.value },
                        })
                      }
                      className="input-field"
                      placeholder="info@furnimart.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="form-label">Facebook URL</label>
                    <input
                      type="url"
                      value={settings.footer?.socialMedia?.facebook || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          footer: {
                            ...settings.footer,
                            socialMedia: {
                              ...settings.footer?.socialMedia,
                              facebook: e.target.value,
                            },
                          },
                        })
                      }
                      className="input-field"
                      placeholder="#"
                    />
                  </div>
                  <div>
                    <label className="form-label">Instagram URL</label>
                    <input
                      type="url"
                      value={settings.footer?.socialMedia?.instagram || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          footer: {
                            ...settings.footer,
                            socialMedia: {
                              ...settings.footer?.socialMedia,
                              instagram: e.target.value,
                            },
                          },
                        })
                      }
                      className="input-field"
                      placeholder="#"
                    />
                  </div>
                  <div>
                    <label className="form-label">Twitter URL</label>
                    <input
                      type="url"
                      value={settings.footer?.socialMedia?.twitter || ''}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          footer: {
                            ...settings.footer,
                            socialMedia: {
                              ...settings.footer?.socialMedia,
                              twitter: e.target.value,
                            },
                          },
                        })
                      }
                      className="input-field"
                      placeholder="#"
                    />
                  </div>
                </div>
                <div>
                  <label className="form-label">Copyright</label>
                  <input
                    type="text"
                    value={settings.footer?.copyright || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        footer: { ...settings.footer, copyright: e.target.value },
                      })
                    }
                    className="input-field"
                    placeholder="© 2024 FurniMart. Tất cả quyền được bảo lưu."
                  />
                </div>

                {/* Quick Links */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="form-label">Liên kết nhanh</label>
                    <button
                      onClick={addQuickLink}
                      className="text-secondary hover:text-yellow-600 flex items-center gap-1"
                    >
                      <FiPlus /> Thêm
                    </button>
                  </div>
                  <div className="space-y-2">
                    {settings.footer?.quickLinks?.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const links = [...(settings.footer?.quickLinks || [])];
                            links[index] = { ...links[index], label: e.target.value };
                            setSettings({
                              ...settings,
                              footer: { ...settings.footer, quickLinks: links },
                            });
                          }}
                          className="input-field flex-1"
                          placeholder="Label"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => {
                            const links = [...(settings.footer?.quickLinks || [])];
                            links[index] = { ...links[index], url: e.target.value };
                            setSettings({
                              ...settings,
                              footer: { ...settings.footer, quickLinks: links },
                            });
                          }}
                          className="input-field flex-1"
                          placeholder="URL"
                        />
                        <button
                          onClick={() => removeQuickLink(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Support Links */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="form-label">Liên kết hỗ trợ</label>
                    <button
                      onClick={addSupportLink}
                      className="text-secondary hover:text-yellow-600 flex items-center gap-1"
                    >
                      <FiPlus /> Thêm
                    </button>
                  </div>
                  <div className="space-y-2">
                    {settings.footer?.supportLinks?.map((link, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const links = [...(settings.footer?.supportLinks || [])];
                            links[index] = { ...links[index], label: e.target.value };
                            setSettings({
                              ...settings,
                              footer: { ...settings.footer, supportLinks: links },
                            });
                          }}
                          className="input-field flex-1"
                          placeholder="Label"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => {
                            const links = [...(settings.footer?.supportLinks || [])];
                            links[index] = { ...links[index], url: e.target.value };
                            setSettings({
                              ...settings,
                              footer: { ...settings.footer, supportLinks: links },
                            });
                          }}
                          className="input-field flex-1"
                          placeholder="URL"
                        />
                        <button
                          onClick={() => removeSupportLink(index)}
                          className="text-red-500 hover:text-red-700 p-2"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Header Section */}
            <div className="panel">
              <h2 className="text-2xl font-bold mb-4">Header</h2>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Logo Text</label>
                  <input
                    type="text"
                    value={settings.header?.logoText || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        header: { ...settings.header, logoText: e.target.value },
                      })
                    }
                    className="input-field"
                    placeholder="FurniMart"
                  />
                </div>
                <div>
                  <label className="form-label">Search Placeholder</label>
                  <input
                    type="text"
                    value={settings.header?.searchPlaceholder || ''}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        header: { ...settings.header, searchPlaceholder: e.target.value },
                      })
                    }
                    className="input-field"
                    placeholder="Tìm sản phẩm..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

