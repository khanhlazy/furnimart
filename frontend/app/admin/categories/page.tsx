'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { categoryService } from '@services/categoryService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { FiPlus, FiEdit, FiTrash2 } from 'react-icons/fi';

interface CategoryForm {
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
}

export default function AdminCategoriesPage() {
  const { user, isLoading } = useRequireAuth({ requiredRole: 'admin' });
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const { register, handleSubmit, reset } = useForm<CategoryForm>();

  const { data: categories = [] } = useQuery<any[]>(
    ['categories', 'all'],
    () => categoryService.getAll(true),
    { enabled: !isLoading && user?.role === 'admin' }
  );

  const createMutation = useMutation(
    (data: CategoryForm) => categoryService.create(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories']);
        toast.success('Tạo danh mục thành công');
        setIsModalOpen(false);
        reset();
      },
    }
  );

  const updateMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<CategoryForm> }) =>
      categoryService.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories']);
        toast.success('Cập nhật danh mục thành công');
        setIsModalOpen(false);
        setEditingCategory(null);
        reset();
      },
    }
  );

  const deleteMutation = useMutation(
    (id: string) => categoryService.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['categories']);
        toast.success('Xóa danh mục thành công');
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

  const onSubmit = (data: CategoryForm) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <div className="section-shell py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Quản lý danh mục</h1>
          <button
            onClick={() => {
              setEditingCategory(null);
              reset();
              setIsModalOpen(true);
            }}
            className="btn-primary"
          >
            <FiPlus /> Thêm danh mục
          </button>
        </div>

        <div className="panel overflow-hidden">
          <table className="w-full table-styled">
            <thead>
              <tr>
                <th>Tên</th>
                <th>Slug</th>
                <th>Mô tả</th>
                <th>Trạng thái</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category: any) => (
                <tr key={category._id}>
                  <td className="font-semibold">{category.name}</td>
                  <td className="font-mono text-sm">{category.slug}</td>
                  <td>{category.description || '-'}</td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs ${category.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {category.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingCategory(category);
                          reset({
                            name: category.name,
                            slug: category.slug,
                            description: category.description,
                          });
                          setIsModalOpen(true);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
                            deleteMutation.mutate(category._id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">
                {editingCategory ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}
              </h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="form-label">Tên danh mục</label>
                  <input {...register('name', { required: true })} className="input-field" />
                </div>

                <div>
                  <label className="form-label">Slug</label>
                  <input {...register('slug', { required: true })} className="input-field" />
                </div>

                <div>
                  <label className="form-label">Mô tả</label>
                  <textarea {...register('description')} rows={3} className="input-field" />
                </div>

                <div className="flex gap-4">
                  <button type="submit" className="btn-primary">
                    {editingCategory ? 'Cập nhật' : 'Tạo'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingCategory(null);
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

