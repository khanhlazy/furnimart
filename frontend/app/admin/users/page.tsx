'use client';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { usersService } from '@services/usersService';
import { useRequireAuth } from '@hooks/useRequireAuth';
import { toast } from 'react-toastify';
import { FiTrash2, FiEdit, FiX } from 'react-icons/fi';
import { useState } from 'react';

export default function AdminUsersPage() {
  const { user, isLoading } = useRequireAuth({ requiredRole: 'admin' });
  const queryClient = useQueryClient();
  const [editingRole, setEditingRole] = useState<{ userId: string; role: string } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: '',
    isActive: true,
  });

  const { data: users = [], error: usersError, isLoading: usersLoading } = useQuery<any[]>(
    ['users'],
    () => usersService.getAll(),
    { 
      enabled: !isLoading && user?.role === 'admin',
      retry: 1,
      onError: (error: any) => {
        console.error('Error fetching users:', error);
      }
    }
  );

  const deleteMutation = useMutation(
    (id: string) => usersService.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
        toast.success('Xóa người dùng thành công');
      },
    }
  );

  const updateRoleMutation = useMutation(
    ({ id, role }: { id: string; role: string }) => usersService.update(id, { role }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
        toast.success('Cập nhật quyền thành công');
        setEditingRole(null);
      },
      onError: () => {
        toast.error('Cập nhật quyền thất bại');
      },
    }
  );

  const handleRoleChange = (userId: string, newRole: string) => {
    updateRoleMutation.mutate({ id: userId, role: newRole });
  };

  const updateUserMutation = useMutation(
    ({ id, data }: { id: string; data: any }) => usersService.update(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['users']);
        toast.success('Cập nhật người dùng thành công');
        setIsEditModalOpen(false);
        setEditingUser(null);
        setEditForm({ name: '', email: '', phone: '', role: '', password: '', isActive: true });
      },
      onError: () => {
        toast.error('Cập nhật người dùng thất bại');
      },
    }
  );

  const handleEditUser = (userItem: any) => {
    setEditingUser(userItem);
    setEditForm({
      name: userItem.name || '',
      email: userItem.email || '',
      phone: userItem.phone || '',
      role: userItem.role || 'customer',
      password: '',
      isActive: userItem.isActive !== false,
    });
    setIsEditModalOpen(true);
  };

  const handleSubmitEdit = () => {
    if (!editingUser) return;
    
    const updateData: any = {
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      role: editForm.role,
      isActive: editForm.isActive,
    };

    // Chỉ cập nhật password nếu có nhập
    if (editForm.password.trim()) {
      updateData.password = editForm.password;
    }

    updateUserMutation.mutate({ id: editingUser._id, data: updateData });
  };

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

  const getRoleBadge = (role: string) => {
    const colors: Record<string, string> = {
      admin: 'bg-red-100 text-red-800',
      manager: 'bg-purple-100 text-purple-800',
      employee: 'bg-blue-100 text-blue-800',
      shipper: 'bg-green-100 text-green-800',
      customer: 'bg-gray-100 text-gray-800',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="page-shell">
      <Navbar />
      <div className="section-shell py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
        </div>

        {usersLoading ? (
          <div className="panel flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
          </div>
        ) : usersError ? (
          <div className="panel">
            <p className="text-red-600 text-center py-8">Lỗi khi tải danh sách người dùng. Vui lòng thử lại.</p>
          </div>
        ) : (
          <div className="panel overflow-hidden">
            <table className="w-full table-styled">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Email</th>
                  <th>Số điện thoại</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-gray-500">
                      Không có người dùng nào
                    </td>
                  </tr>
                ) : (
                  users.map((userItem: any) => (
                <tr key={userItem._id}>
                  <td className="font-semibold">{userItem.name}</td>
                  <td>{userItem.email}</td>
                  <td>{userItem.phone || '-'}</td>
                  <td>
                    {editingRole?.userId === userItem._id && editingRole ? (
                      <select
                        value={editingRole.role}
                        onChange={(e) => setEditingRole({ ...editingRole, role: e.target.value })}
                        onBlur={() => {
                          if (editingRole.role !== userItem.role) {
                            handleRoleChange(userItem._id, editingRole.role);
                          } else {
                            setEditingRole(null);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (editingRole.role !== userItem.role) {
                              handleRoleChange(userItem._id, editingRole.role);
                            } else {
                              setEditingRole(null);
                            }
                          } else if (e.key === 'Escape') {
                            setEditingRole(null);
                          }
                        }}
                        autoFocus
                        className="px-2 py-1 rounded text-xs font-medium border border-secondary focus:outline-none focus:ring-2 focus:ring-secondary"
                      >
                        <option value="admin">admin</option>
                        <option value="manager">manager</option>
                        <option value="employee">employee</option>
                        <option value="shipper">shipper</option>
                        <option value="customer">customer</option>
                      </select>
                    ) : (
                      <span
                        onClick={() => setEditingRole({ userId: userItem._id, role: userItem.role })}
                        className={`px-2 py-1 rounded text-xs font-medium cursor-pointer hover:opacity-80 transition ${getRoleBadge(userItem.role)}`}
                        title="Click để chỉnh sửa quyền"
                      >
                        {userItem.role}
                      </span>
                    )}
                  </td>
                  <td>
                    <span className={`px-2 py-1 rounded text-xs ${userItem.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {userItem.isActive ? 'Hoạt động' : 'Không hoạt động'}
                    </span>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditUser(userItem)}
                        className="text-secondary hover:text-yellow-600"
                        title="Chỉnh sửa người dùng"
                      >
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => {
                          if (userItem._id === user?.id) {
                            toast.error('Không thể xóa chính tài khoản của bạn');
                            return;
                          }
                          if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
                            deleteMutation.mutate(userItem._id);
                          }
                        }}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Xóa người dùng"
                        disabled={userItem._id === user?.id}
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
      </div>

      {/* Edit User Modal */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Chỉnh sửa người dùng</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingUser(null);
                  setEditForm({ name: '', email: '', phone: '', role: '', password: '', isActive: true });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="form-label">Tên</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="form-label">Số điện thoại</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="input-field"
                />
              </div>

              <div>
                <label className="form-label">Vai trò</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="input-field"
                >
                  <option value="admin">admin</option>
                  <option value="manager">manager</option>
                  <option value="employee">employee</option>
                  <option value="shipper">shipper</option>
                  <option value="customer">customer</option>
                </select>
              </div>

              <div>
                <label className="form-label">Mật khẩu mới (để trống nếu không đổi)</label>
                <input
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                  className="input-field"
                  placeholder="Nhập mật khẩu mới..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.isActive}
                    onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                    className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                  />
                  <span>Hoạt động</span>
                </label>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmitEdit}
                  disabled={updateUserMutation.isLoading || !editForm.name.trim() || !editForm.email.trim()}
                  className="btn-primary flex-1"
                >
                  {updateUserMutation.isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
                <button
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingUser(null);
                    setEditForm({ name: '', email: '', phone: '', role: '', password: '', isActive: true });
                  }}
                  className="btn-secondary flex-1"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

