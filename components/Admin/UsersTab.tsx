'use client';

import { useEffect, useState } from 'react';
import { Users as UsersIcon, Shield, Edit } from 'lucide-react';

export default function UsersTab({ user }: { user: any }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Ошибка загрузки пользователей:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: string, newRole: string) => {
    if (!confirm(`Изменить роль пользователя на "${newRole}"?`)) return;

    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, role: newRole }),
      });

      if (res.ok) {
        loadUsers();
      } else {
        alert('Ошибка при изменении роли');
      }
    } catch (error) {
      console.error('Ошибка изменения роли:', error);
      alert('Ошибка при изменении роли');
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-700';
      case 'seller':
        return 'bg-blue-100 text-blue-700';
      case 'customer':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Администратор';
      case 'seller':
        return 'Продавец';
      case 'customer':
        return 'Покупатель';
      default:
        return role;
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="bg-white rounded-2xl p-12 text-center">
        <Shield className="w-16 h-16 mx-auto mb-4 text-text-secondary" />
        <p className="text-text-secondary">Только администраторы могут управлять пользователями</p>
      </div>
    );
  }

  if (loading) {
    return <div className="text-text-secondary">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Пользователи</h2>
        <div className="text-sm text-text-secondary">
          Всего: {users.length}
        </div>
      </div>

      {users.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <UsersIcon className="w-16 h-16 mx-auto mb-4 text-text-secondary" />
          <p className="text-text-secondary">Нет пользователей</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-light">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                    Имя
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                    Телефон
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                    Роль
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                    Дата регистрации
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-text-secondary">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brown/10">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-cream-light/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary">{u.name}</div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">{u.email}</td>
                    <td className="px-6 py-4 text-text-secondary">
                      {u.phone || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${getRoleBadge(
                          u.role
                        )}`}
                      >
                        {getRoleLabel(u.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {new Date(u.created_at).toLocaleDateString('ru-RU')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.id !== user.id && (
                        <div className="relative inline-block">
                          <select
                            value={u.role}
                            onChange={(e) => updateRole(u.id, e.target.value)}
                            className="appearance-none bg-cream-light hover:bg-cream px-3 py-2 pr-8 rounded-lg text-sm cursor-pointer transition-colors"
                          >
                            <option value="customer">Покупатель</option>
                            <option value="seller">Продавец</option>
                            <option value="admin">Администратор</option>
                          </select>
                          <Edit className="w-3 h-3 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
