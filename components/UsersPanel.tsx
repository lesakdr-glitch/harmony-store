'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'seller' | 'admin';
  created_at: string;
}

const ROLE_LABELS: Record<string, string> = {
  customer: 'Покупатель',
  seller: 'Продавец',
  admin: 'Админ',
};

const ROLE_COLORS: Record<string, string> = {
  customer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  seller: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  admin: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
};

export default function UsersPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [pendingRoles, setPendingRoles] = useState<Record<string, string>>({});
  const [currentUserId, setCurrentUserId] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setCurrentUserId(user.id || '');

    fetch('/api/users', {
      headers: {
        'x-user-role': user.role || '',
      },
    })
      .then(res => res.json())
      .then(data => {
        const list: User[] = data.users || [];
        setUsers(list);
        setFiltered(list);
        // Инициализируем локальный стейт ролей
        const roles: Record<string, string> = {};
        list.forEach((u: User) => { roles[u.id] = u.role; });
        setPendingRoles(roles);
      })
      .catch(() => setMessage('Ошибка загрузки'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      users.filter(
        u =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      )
    );
  }, [search, users]);

  const handleSave = async (userId: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setSaving(userId);
    setMessage('');

    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id || '',
          'x-user-role': user.role || '',
        },
        body: JSON.stringify({ userId, role: pendingRoles[userId] }),
      });

      const data = await res.json();
      if (res.ok) {
        setUsers((prev: User[]) =>
          prev.map((u: User) => (u.id === userId ? { ...u, role: data.user.role } : u))
        );
        showMessage('✅ Роль обновлена');
      } else {
        showMessage(`❌ ${data.error || 'Ошибка'}`);
      }
    } catch {
      showMessage('❌ Ошибка сервера');
    } finally {
      setSaving(null);
    }
  };

  const showMessage = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <p className="text-text-secondary">Загрузка...</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-semibold text-xl">Пользователи</h2>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Поиск по имени или email..."
          className="w-full sm:w-72 px-4 py-2 rounded-xl border border-border bg-input text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent-olive"
        />
      </div>

      {message && (
        <div className="px-4 py-3 rounded-xl bg-card border border-border text-sm font-medium">
          {message}
        </div>
      )}

      <div className="bg-card rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Пользователь</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary hidden sm:table-cell">Телефон</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary">Роль</th>
                <th className="text-left py-3 px-4 font-medium text-text-secondary hidden md:table-cell">Зарегистрирован</th>
                <th className="py-3 px-4"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-text-secondary">
                    Пользователи не найдены
                  </td>
                </tr>
              )}
              {filtered.map(user => {
                const isSelf = user.id === currentUserId;
                return (
                  <tr
                    key={user.id}
                    className={`border-b border-border last:border-0 ${
                      isSelf ? 'opacity-50' : 'hover:bg-background'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <p className="font-medium text-text-primary">{user.name || '—'}</p>
                      <p className="text-text-secondary text-xs mt-0.5">{user.email}</p>
                    </td>
                    <td className="py-3 px-4 text-text-secondary hidden sm:table-cell">
                      {user.phone || '—'}
                    </td>
                    <td className="py-3 px-4">
                      {isSelf ? (
                        <span className={`px-2 py-1 rounded-full text-xs ${ROLE_COLORS[user.role]}`}>
                          {ROLE_LABELS[user.role]}
                        </span>
                      ) : (
                        <select
                          value={pendingRoles[user.id] ?? user.role}
                          onChange={e =>
                            setPendingRoles((prev: Record<string, string>) => ({ ...prev, [user.id]: e.target.value }))
                          }
                          className="px-2 py-1 rounded-lg border border-border bg-input text-text-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent-olive"
                        >
                          <option value="customer">Покупатель</option>
                          <option value="seller">Продавец</option>
                          <option value="admin">Админ</option>
                        </select>
                      )}
                    </td>
                    <td className="py-3 px-4 text-text-secondary hidden md:table-cell">
                      {user.created_at
                        ? new Date(user.created_at).toLocaleDateString('ru-RU')
                        : '—'}
                    </td>
                    <td className="py-3 px-4">
                      {!isSelf && (
                        <button
                          onClick={() => handleSave(user.id)}
                          disabled={
                            saving === user.id ||
                            pendingRoles[user.id] === user.role
                          }
                          className="text-xs px-3 py-1.5 bg-accent-olive text-white rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                          {saving === user.id ? '...' : 'Сохранить'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-text-secondary">
        Всего пользователей: {users.length}
      </p>
    </div>
  );
}
