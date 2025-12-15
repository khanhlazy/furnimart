'use client';

import { useQuery } from 'react-query';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import { usersService } from '@services/usersService';
import { useRequireAuth } from '@hooks/useRequireAuth';

export default function ManagerUsersPage() {
  const { user, isLoading } = useRequireAuth({ requiredRole: ['manager', 'admin'] });

  const { data: users = [], error: usersError, isLoading: usersLoading } = useQuery<any[]>(
    ['users', 'manager'],
    () => usersService.getAll(),
    { 
      enabled: !isLoading && (user?.role === 'manager' || user?.role === 'admin'),
      retry: 1,
      onError: (error: any) => {
        console.error('Error fetching users:', error);
      }
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

  if (!user || !['manager', 'admin'].includes(user.role)) {
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
      
      <header className="hero-banner">
        <div className="section-shell relative z-10">
          <p className="pill mb-3 inline-flex">Quản lý</p>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Quản lý người dùng</h1>
          <p className="text-gray-100/90">Xem và quản lý người dùng</p>
        </div>
      </header>

      <div className="section-shell py-10">

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
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-gray-500">
                      Không có người dùng nào
                    </td>
                  </tr>
                ) : (
                  users.map((u: any) => (
                    <tr key={u._id}>
                      <td className="font-semibold">{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || '-'}</td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleBadge(u.role)}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>
                        <span className={`px-2 py-1 rounded text-xs ${u.isActive ? 'text-green-600' : 'text-red-600'}`}>
                          {u.isActive ? 'Hoạt động' : 'Không hoạt động'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

