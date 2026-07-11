'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import OrdersTab from '@/components/Admin/OrdersTab';
import ProductsTab from '@/components/Admin/ProductsTab';
import SettingsTab from '@/components/Admin/SettingsTab';
import ReviewsTab from '@/components/Admin/ReviewsTab';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'reviews' | 'settings'>('orders');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/session', { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setIsAuthenticated(data.authenticated === true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setPassword('');
      } else {
        alert('Неверный пароль');
      }
    } catch {
      alert('Ошибка авторизации');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    setIsAuthenticated(false);
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-secondary">Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="bg-card p-8 rounded-card max-w-md w-full">
          <h1 className="text-3xl font-bold text-center mb-8">Вход в админку</h1>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-text mb-2 font-medium">Пароль</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none"
                placeholder="Введите пароль"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-full transition-colors disabled:opacity-50"
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-secondary/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Панель управления</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-accent/20 hover:bg-accent text-text rounded-lg transition-colors"
            >
              Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="bg-card/50 border-b border-secondary/20">
        <div className="container mx-auto px-4">
          <div className="flex gap-4">
            {(['orders', 'products', 'reviews', 'settings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition-colors relative ${
                  activeTab === tab ? 'text-accent' : 'text-secondary hover:text-text'
                }`}
              >
                {tab === 'orders' && 'Заказы'}
                {tab === 'products' && 'Товары'}
                {tab === 'reviews' && 'Отзывы'}
                {tab === 'settings' && 'Настройки'}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'orders' && <OrdersTab />}
        {activeTab === 'products' && <ProductsTab />}
        {activeTab === 'reviews' && <ReviewsTab />}
        {activeTab === 'settings' && <SettingsTab />}
      </div>
    </div>
  );
}
