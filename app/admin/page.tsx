'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Dashboard from '@/components/Dashboard';

export default function Admin() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth');
    if (auth) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123';
    if (password === adminPassword) {
      localStorage.setItem('admin_auth', password);
      setIsAuthenticated(true);
    } else {
      alert('Неверный пароль');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth');
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="bg-card p-8 rounded-2xl shadow-sm w-full max-w-md">
          <h1 className="font-raleway text-2xl font-bold text-text-primary mb-6 text-center">
            Вход в админку
          </h1>
          <div className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Пароль"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
            />
            <button
              onClick={handleLogin}
              className="w-full bg-accent-olive text-white py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-colors"
            >
              Войти
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="font-raleway text-3xl font-bold text-text-primary">
              Админ-панель
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Выйти
            </button>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Вкладки */}
            <aside className="md:w-64 space-y-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                  activeTab === 'dashboard' ? 'bg-accent-olive text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Дашборд
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                  activeTab === 'products' ? 'bg-accent-olive text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Товары
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                  activeTab === 'orders' ? 'bg-accent-olive text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Заказы
              </button>
              <button
                onClick={() => setActiveTab('categories')}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                  activeTab === 'categories' ? 'bg-accent-olive text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Категории
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                  activeTab === 'settings' ? 'bg-accent-olive text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Настройки
              </button>
            </aside>

            {/* Контент */}
            <div className="flex-1">
              {activeTab === 'dashboard' && <Dashboard />}
              
              {activeTab === 'products' && (
                <div className="bg-card p-6 rounded-2xl shadow-sm">
                  <h2 className="font-semibold text-xl mb-4">Управление товарами</h2>
                  <p className="text-text-secondary">
                    Функционал управления товарами будет добавлен в следующей версии.
                  </p>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="bg-card p-6 rounded-2xl shadow-sm">
                  <h2 className="font-semibold text-xl mb-4">Управление заказами</h2>
                  <p className="text-text-secondary">
                    Функционал управления заказами будет добавлен в следующей версии.
                  </p>
                </div>
              )}

              {activeTab === 'categories' && (
                <div className="bg-card p-6 rounded-2xl shadow-sm">
                  <h2 className="font-semibold text-xl mb-4">Управление категориями</h2>
                  <p className="text-text-secondary">
                    Функционал управления категориями будет добавлен в следующей версии.
                  </p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="bg-card p-6 rounded-2xl shadow-sm">
                  <h2 className="font-semibold text-xl mb-4">Настройки сайта</h2>
                  <p className="text-text-secondary">
                    Функционал настроек будет добавлен в следующей версии.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
