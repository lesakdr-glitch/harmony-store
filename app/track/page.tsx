'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingSupport from '@/components/FloatingSupport';
import { formatPrice } from '@/lib/utils';

export default function Track() {
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const response = await fetch(`/api/orders?phone=${phone}`);
    const data = await response.json();
    setOrders(data.orders || []);
    setSearched(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Новый': return 'bg-blue-100 text-blue-800';
      case 'В обработке': return 'bg-yellow-100 text-yellow-800';
      case 'Отправлен': return 'bg-green-100 text-green-800';
      case 'Доставлен': return 'bg-gray-100 text-gray-800';
      case 'Отменён': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-raleway text-3xl font-bold text-text-primary mb-8 text-center">
            Отследить заказ
          </h1>

          <div className="bg-card p-8 rounded-2xl shadow-sm mb-8">
            <div className="flex space-x-4">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Номер телефона"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
              />
              <button
                onClick={handleSearch}
                className="bg-accent-olive text-white px-8 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-colors"
              >
                Найти
              </button>
            </div>
          </div>

          {searched && (
            <div className="space-y-4">
              {orders.length === 0 ? (
                <p className="text-center text-text-secondary">Заказы не найдены</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="bg-card p-6 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-semibold">Заказ #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-text-secondary">
                          {new Date(order.created_at).toLocaleDateString('ru-RU')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="mb-4">
                      {order.items.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} x{item.quantity}</span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="font-semibold">Итого: {formatPrice(order.total_price)}</span>
                      {order.track_number && (
                        <span className="text-sm text-text-secondary">
                          Трек-номер: {order.track_number}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <FloatingSupport />
    </div>
  );
}
