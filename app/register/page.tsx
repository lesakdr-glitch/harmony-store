'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, User, Phone } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Валидация
    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    if (!formData.acceptTerms) {
      setError('Необходимо принять условия соглашения');
      setLoading(false);
      return;
    }

    try {
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

      if (!response.ok) {
        throw new Error(data.error || 'Ошибка при регистрации');
      }

      // Успешная регистрация
      router.push('/account');
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold font-raleway mb-2">Регистрация</h1>
          <p className="text-text-secondary">
            Создайте аккаунт для покупок и отслеживания заказов
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 card-shadow">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Имя</label>
              <div className="relative">
                <User className="absolute left-3 top-3.5 w-5 h-5 text-text-secondary" />
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-brown/20 rounded-xl focus:outline-none focus:border-brown"
                  placeholder="Иван Иванов"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-text-secondary" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-brown/20 rounded-xl focus:outline-none focus:border-brown"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Телефон (опционально)</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 w-5 h-5 text-text-secondary" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-brown/20 rounded-xl focus:outline-none focus:border-brown"
                  placeholder="+7 (900) 123-45-67"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-text-secondary" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-brown/20 rounded-xl focus:outline-none focus:border-brown"
                  placeholder="Минимум 6 символов"
                  minLength={6}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Повторите пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-text-secondary" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-brown/20 rounded-xl focus:outline-none focus:border-brown"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={formData.acceptTerms}
                onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                className="mt-1 w-5 h-5 accent-olive"
              />
              <label htmlFor="terms" className="text-sm text-text-secondary">
                Принимаю{' '}
                <Link href="/terms" className="text-olive hover:underline">
                  условия пользовательского соглашения
                </Link>
                {' '}и{' '}
                <Link href="/privacy" className="text-olive hover:underline">
                  политику конфиденциальности
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-secondary">
              Уже есть аккаунт?{' '}
              <Link href="/login" className="text-olive font-medium hover:underline">
                Войти
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-text-secondary hover:text-brown">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}