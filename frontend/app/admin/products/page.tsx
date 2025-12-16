'use client';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { productService } from '@services/productService';
import { categoryService } from '@services/categoryService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit, FiTrash2, FiImage, FiX } from 'react-icons/fi';
import { ProductForm } from '@types';
import { uploadService } from '@services/uploadService';

export default function AdminProductsPage() {
  const { user, isLoading } = useRequireAuth({ requiredRole: 'admin' });
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProductForm>();

  const { data: products = [], error: productsError, isLoading: productsLoading } = useQuery(
    ['products', 'admin'],
    () => productService.getAll({ limit: 100 }),
    { 
      enabled: !isLoading && user?.role === 'admin',
      retry: 1,
      onError: (error: any) => {
        console.error('Error fetching products:', error);
      }
    }
  );

  const { data: categories = [] } = useQuery(
    ['categories'],
    () => categoryService.getAll(),
    { enabled: !isLoading && user?.role === 'admin' }
  );

  const createMutation = useMutation(
    (data: ProductForm) => productService.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products']);
        toast.success('Tạo sản phẩm thành công');
        setIsModalOpen(false);
        setImages([]);
        reset();
      },
    }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<ProductForm> }) =>
      productService.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products']);
        toast.success('Cập nhật sản phẩm thành công');
        setIsModalOpen(false);
        setEditingProduct(null);
        setImages([]);
        reset();
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) => productService.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['products']);
        toast.success('Xóa sản phẩm thành công');
      },
    }
  );

  if (isLoading) {
    return (
      <div className="page-shell">
        <Navbar />
        <div className="flex-1 section-shell flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const fileArray = Array.from(files);
      const uploadResults = await uploadService.uploadImages(fileArray);
      
      // Ensure uploadResults is always an array
      const resultsArray = Array.isArray(uploadResults) ? uploadResults : [uploadResults];
      
      const newImageUrls = resultsArray.map((result) => {
        // Convert relative URL to absolute URL
        if (result?.url?.startsWith('/')) {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
          // Remove /api if present since uploads is served from root
          const baseUrl = apiUrl.replace('/api', '');
          return `${baseUrl}${result.url}`;
        }
        return result?.url || '';
      }).filter(url => url); // Filter out empty URLs
      
      if (newImageUrls.length > 0) {
        setImages((prev) => [...prev, ...newImageUrls]);
        toast.success(`Đã upload ${newImageUrls.length} ảnh thành công`);
      } else {
        toast.error('Không có ảnh nào được upload thành công');
      }
    } catch (error: any) {
      toast.error(error.message || 'Upload ảnh thất bại');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: ProductForm) => {
    const submitData = {
      ...data,
      images: images.length > 0 ? images : undefined,
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, data: submitData });
    } else {
      createMutation.mutate(submitData as ProductForm);
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setImages(product.images || []);
    reset({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category,
      categoryId: product.categoryId,
      discount: product.discount,
    });
    setIsModalOpen(true);
  };

  return (
    <div className="page-shell">
      <Navbar />
      
      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Quản trị viên</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Quản lý sản phẩm</h1>
          <p className="text-gray-100/90">Thêm, sửa, xóa sản phẩm</p>
        </div>
      </header>

      <div className="section-shell py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Danh sách sản phẩm</h2>
          <button
            onClick={() => {
              setEditingProduct(null);
              setImages([]);
              reset();
              setIsModalOpen(true);
            }}
            className="btn-primary"
          >
            <FiPlus /> Thêm sản phẩm
          </button>
        </div>

        {productsLoading ? (
          <div className="panel flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        ) : productsError ? (
          <div className="panel">
            <p className="text-red-600 text-center py-8">Lỗi khi tải danh sách sản phẩm. Vui lòng thử lại.</p>
          </div>
        ) : (
          <div className="panel overflow-hidden">
            <table className="w-full table-styled">
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Danh mục</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      Không có sản phẩm nào
                    </td>
                  </tr>
                ) : (
                  products.map((product: any) => (
                    <tr key={product._id}>
                      <td>
                        {product.images?.[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-16 h-16 object-cover rounded" />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">🛋️</div>
                        )}
                      </td>
                      <td className="font-semibold">{product.name}</td>
                      <td>{product.price.toLocaleString('vi-VN')}₫</td>
                      <td>{product.stock}</td>
                      <td>{product.category}</td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <FiEdit />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
                                deleteMutation.mutate(product._id);
                              }
                            }}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold mb-4">
                {editingProduct ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="form-label">Tên sản phẩm</label>
                  <input {...register('name', { required: true })} className="input-field" />
                  {errors.name && <p className="text-red-500 text-sm">Tên là bắt buộc</p>}
                </div>

                <div>
                  <label className="form-label">Mô tả</label>
                  <textarea {...register('description', { required: true })} rows={3} className="input-field" />
                  {errors.description && <p className="text-red-500 text-sm">Mô tả là bắt buộc</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Giá (VNĐ)</label>
                    <input type="number" {...register('price', { required: true, min: 0 })} className="input-field" />
                  </div>
                  <div>
                    <label className="form-label">Tồn kho</label>
                    <input type="number" {...register('stock', { required: true, min: 0 })} className="input-field" />
                  </div>
                </div>

                <div>
                  <label className="form-label">Danh mục</label>
                  <select {...register('category', { required: true })} className="input-field">
                    <option value="">Chọn danh mục</option>
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="form-label">Hình ảnh sản phẩm</label>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <label className="btn-secondary cursor-pointer">
                        <FiImage className="inline mr-2" />
                        {uploading ? 'Đang upload...' : 'Chọn ảnh'}
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="hidden"
                        />
                      </label>
                      <span className="text-sm text-gray-500">
                        Tối đa 10 ảnh, mỗi ảnh tối đa 5MB
                      </span>
                    </div>

                    {/* Image Preview */}
                    {images.length > 0 && (
                      <div className="grid grid-cols-4 gap-3 mt-3">
                        {images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={img}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <FiX />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="btn-primary">
                    {editingProduct ? 'Cập nhật' : 'Tạo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingProduct(null);
                      setImages([]);
                      reset();
                    }}
                    className="btn-secondary"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

