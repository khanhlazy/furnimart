'use client';

import { useState } from 'react';
import { FiX, FiFilter } from 'react-icons/fi';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    materials?: string[];
    colors?: string[];
    sortBy?: string;
  };
  onFilterChange: (filters: any) => void;
  categories?: Array<{ _id: string; name: string; slug: string }>;
}

const MATERIALS = ['Gỗ', 'Da', 'Kim loại', 'Vải', 'Nhựa', 'Kính'];
const COLORS = ['Đen', 'Trắng', 'Xám', 'Nâu', 'Be', 'Xanh', 'Đỏ'];

export default function FilterSidebar({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  categories = [],
}: FilterSidebarProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleCategoryChange = (categoryId: string) => {
    const newFilters = {
      ...localFilters,
      category: localFilters.category === categoryId ? undefined : categoryId,
    };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: number) => {
    const newFilters = { ...localFilters, [field]: value || undefined };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleMaterialToggle = (material: string) => {
    const materials = localFilters.materials || [];
    const newMaterials = materials.includes(material)
      ? materials.filter((m) => m !== material)
      : [...materials, material];
    const newFilters = { ...localFilters, materials: newMaterials.length > 0 ? newMaterials : undefined };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleColorToggle = (color: string) => {
    const colors = localFilters.colors || [];
    const newColors = colors.includes(color)
      ? colors.filter((c) => c !== color)
      : [...colors, color];
    const newFilters = { ...localFilters, colors: newColors.length > 0 ? newColors : undefined };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (sortBy: string) => {
    const newFilters = { ...localFilters, sortBy };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto lg:relative lg:z-0 lg:shadow-none">
        <div className="p-4 border-b lg:hidden">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FiFilter /> Bộ lọc
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <FiX size={24} />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <h3 className="font-semibold mb-3">Danh mục</h3>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryChange(cat._id)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition ${
                    localFilters.category === cat._id
                      ? 'bg-secondary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h3 className="font-semibold mb-3">Khoảng giá (VNĐ)</h3>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600">Từ</label>
                <input
                  type="number"
                  value={localFilters.minPrice || ''}
                  onChange={(e) => handlePriceChange('minPrice', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Đến</label>
                <input
                  type="number"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) => handlePriceChange('maxPrice', parseInt(e.target.value) || 0)}
                  placeholder="Không giới hạn"
                  className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Materials */}
          <div>
            <h3 className="font-semibold mb-3">Chất liệu</h3>
            <div className="flex flex-wrap gap-2">
              {MATERIALS.map((material) => (
                <button
                  key={material}
                  onClick={() => handleMaterialToggle(material)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    localFilters.materials?.includes(material)
                      ? 'bg-secondary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {material}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <h3 className="font-semibold mb-3">Màu sắc</h3>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorToggle(color)}
                  className={`px-3 py-1 rounded-full text-sm transition ${
                    localFilters.colors?.includes(color)
                      ? 'bg-secondary text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="font-semibold mb-3">Sắp xếp</h3>
            <select
              value={localFilters.sortBy || 'newest'}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-secondary focus:border-transparent"
            >
              <option value="newest">Mới nhất</option>
              <option value="price_asc">Giá tăng dần</option>
              <option value="price_desc">Giá giảm dần</option>
              <option value="rating">Đánh giá cao nhất</option>
            </select>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            Xóa bộ lọc
          </button>
        </div>
      </div>
    </>
  );
}

