'use client';

import { useState } from 'react';
import { Order } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';
import { Package, Search } from 'lucide-react';

export default function TrackPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      // Нормализуем номер
      const normalizedPhone = phone.replace(/[\s\-\(\)]/g, '');
      
      const response = await fetch(`/api/orders?phone=${encodeURIComponent(normalizedPhone)}`);
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error tracking orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Новый':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'В обработке':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Отправлен':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Доставлен':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
      case 'Отменён':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-background py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <Package className="w-16 h-16 mx-auto mb-4 text-accent" />
          <h1 className="text-4xl font-bold text-text mb-4">Отследить заказ</h1>
          <p className="text-secondary text-lg">
            Введите номер телефона, указанный при оформлении заказа
          </p>
        </div>

        <form onSubmit={handleSearch} className="bg-card p-8 rounded-card-lg mb-8">
          <div className="space-y-4">
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-6 py-4 bg-background border-2 border-secondary/30 rounded-xl text-text text-lg focus:border-accent focus:outline-none transition-colors"
              placeholder="+7 (900) 123-45-67"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-accent hover:bg-accent/90 text-white text-lg font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Search className="w-5 h-5" />
              {loading ? 'Поиск...' : 'Найти заказы'}
            </button>
          </div>
        </form>

        {searched && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-card p-8 rounded-card-lg text-center space-y-4">
                <p className="text-secondary text-lg">
                  Заказы с номером <span className="text-text font-medium">{phone}</span> не найдены.
                </p>
                <p className="text-secondary">
                  Проверьте номер или напишите нам в поддержку.
                </p>
                <a
                  href="https://t.me/Smartstoretech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-[#0088cc] text-white rounded-xl hover:bg-[#0088cc]/90 transition-colors"
                >
                  💬 Написать в поддержку
                </a>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-card p-6 rounded-card-lg">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-text mb-1">{order.product_name}</h3>
                      <p className="text-secondary">
                        {new Date(order.created_at).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-text">{formatPrice(order.price)}₽</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-t border-secondary/20">
                      <span className="text-secondary">Статус</span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex justify-between py-2 border-t border-secondary/20">
                      <span className="text-secondary">Доставка</span>
                      <span className="text-text font-medium">{order.delivery}</span>
                    </div>

                    <div className="flex justify-between py-2 border-t border-secondary/20">
                      <span className="text-secondary">Город</span>
                      <span className="text-text font-medium">{order.city}</span>
                    </div>

                    {order.status === 'Отправлен' && order.track_number && (
                      <div className="flex justify-between py-2 border-t border-secondary/20">
                        <span className="text-secondary">Трек-номер</span>
                        <span className="text-accent font-mono font-medium">{order.track_number}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="/"
            className="text-accent hover:underline font-medium"
          >
            ← Вернуться на главную
          </a>
        </div>
      </div>
    </div>
  );
}
