'use client';

import { useState } from 'react';
import { formatPrice } from '@/lib/utils';
import { Package, Search } from 'lucide-react';

export default function TrackPage() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const res = await fetch(`/api/orders?phone=${encodeURIComponent(phone)}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Новый':
        return 'bg-blue-100 text-blue-700';
      case 'В обработке':
        return 'bg-yellow-100 text-yellow-700';
      case 'Отправлен':
        return 'bg-green-100 text-green-700';
      case 'Доставлен':
        return 'bg-gray-100 text-gray-700';
      case 'Отменён':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-cream py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Package className="w-16 h-16 mx-auto mb-4 text-olive" />
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Отследить заказ
          </h1>
          <p className="text-lg text-text-secondary">
            Введите номер телефона, который указывали при оформлении
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-12">
          <div className="bg-white rounded-2xl p-6 card-shadow">
            <div className="flex gap-4">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 (___) ___-__-__"
                className="flex-1 px-4 py-3 bg-cream-light rounded-xl border border-transparent focus:border-olive focus:outline-none transition-colors"
                required
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-olive hover:bg-olive-dark text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <Search className="w-5 h-5" />
                <span>{loading ? 'Поиск...' : 'Найти'}</span>
              </button>
            </div>
          </div>
        </form>

        {searched && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center card-shadow">
                <Package className="w-16 h-16 mx-auto mb-4 text-text-secondary" />
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  Заказы не найдены
                </h3>
                <p className="text-text-secondary">
                  Проверьте номер телефона или свяжитесь с поддержкой
                </p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-shadow"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-xl text-text-primary mb-1">
                        Заказ от {new Date(order.created_at).toLocaleDateString('ru-RU')}
                      </h3>
                      <p className="text-text-secondary">
                        {order.items?.map((item: any) => `${item.name} × ${item.quantity}`).join(', ')}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm text-text-secondary mb-1">Сумма</div>
                      <div className="text-lg font-bold text-brown">
                        {formatPrice(order.total_price)} ₽
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-text-secondary mb-1">Доставка</div>
                      <div className="font-medium">
                        {order.delivery_method === 'sdek' ? 'СДЭК' : 'Самовывоз'}
                      </div>
                    </div>
                  </div>

                  {order.track_number && order.status === 'Отправлен' && (
                    <div className="bg-cream-light rounded-xl p-4">
                      <div className="text-sm text-text-secondary mb-1">Трек-номер</div>
                      <div className="font-bold text-olive">{order.track_number}</div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
