'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingSupport from '@/components/FloatingSupport';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    acceptTerms: false,
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.acceptTerms) {
      setError('Необходимо принять условия использования');
      return;
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/account');
    } else {
      setError(data.error || 'Ошибка регистрации');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-raleway text-3xl font-bold text-text-primary mb-8 text-center">
            Регистрация
          </h1>

          <form onSubmit={handleSubmit} className="bg-card p-8 rounded-2xl shadow-sm space-y-6">
            {error && (
              <div className="bg-red-100 text-red-800 p-4 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Имя *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Телефон *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Пароль *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
              />
            </div>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                required
                className="w-5 h-5 text-accent-olive"
              />
              <span className="text-sm">
                Принимаю{' '}
                <a href="/terms" className="text-accent-olive hover:underline">
                  условия использования
                </a>
              </span>
            </label>

            <button
              type="submit"
              className="w-full bg-accent-olive text-white py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-colors"
            >
              Зарегистрироваться
            </button>

            <p className="text-center text-text-secondary">
              Уже есть аккаунт?{' '}
              <a href="/login" className="text-accent-olive hover:underline">
                Войти
              </a>
            </p>
          </form>
        </div>
      </main>

      <Footer />
      <FloatingSupport />
    </div>
  );
}
