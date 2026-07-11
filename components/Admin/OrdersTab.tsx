'use client';

import { useEffect, useState } from 'react';
import { Order } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders', { credentials: 'include' });
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id: string, status: string, trackNumber?: string) => {
    try {
      const response = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, status, track_number: trackNumber }),
      });

      if (response.ok) {
        fetchOrders();
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'Новый').length,
    processing: orders.filter(o => o.status === 'В обработке').length,
    shipped: orders.filter(o => o.status === 'Отправлен').length,
    today: orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).length,
    sum: orders.reduce((acc, o) => acc + o.price, 0),
  };

  if (loading) {
    return <div className="text-center py-8 text-secondary">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Статистика */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-card p-4 rounded-card">
          <div className="text-secondary text-sm mb-1">Всего</div>
          <div className="text-2xl font-bold text-text">{stats.total}</div>
        </div>
        <div className="bg-card p-4 rounded-card">
          <div className="text-secondary text-sm mb-1">Новых</div>
          <div className="text-2xl font-bold text-accent">{stats.new}</div>
        </div>
        <div className="bg-card p-4 rounded-card">
          <div className="text-secondary text-sm mb-1">В обработке</div>
          <div className="text-2xl font-bold text-text">{stats.processing}</div>
        </div>
        <div className="bg-card p-4 rounded-card">
          <div className="text-secondary text-sm mb-1">Отправлено</div>
          <div className="text-2xl font-bold text-success">{stats.shipped}</div>
        </div>
        <div className="bg-card p-4 rounded-card">
          <div className="text-secondary text-sm mb-1">Сегодня</div>
          <div className="text-2xl font-bold text-text">{stats.today}</div>
        </div>
        <div className="bg-card p-4 rounded-card">
          <div className="text-secondary text-sm mb-1">На сумму</div>
          <div className="text-2xl font-bold text-success">{formatPrice(stats.sum)}₽</div>
        </div>
      </div>

      {/* Фильтр */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'Новый', 'В обработке', 'Отправлен', 'Доставлен', 'Отменён'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === status
                ? 'bg-accent text-white'
                : 'bg-card text-secondary hover:text-text'
            }`}
          >
            {status === 'all' ? 'Все' : status}
          </button>
        ))}
      </div>

      {/* Таблица */}
      <div className="bg-card rounded-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-card/50 border-b border-secondary/20">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Имя</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Телефон</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Город</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Доставка</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Товар</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Сумма</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Статус</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Трек</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-secondary">Дата</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary/10">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-card/50">
                  <td className="px-4 py-3 text-sm text-text">{order.name}</td>
                  <td className="px-4 py-3 text-sm text-text">{order.phone}</td>
                  <td className="px-4 py-3 text-sm text-text">{order.city}</td>
                  <td className="px-4 py-3 text-sm text-text">{order.delivery}</td>
                  <td className="px-4 py-3 text-sm text-text">{order.product_name}</td>
                  <td className="px-4 py-3 text-sm font-medium text-success">{formatPrice(order.price)}₽</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                      className="text-sm bg-background border border-secondary/30 rounded-lg px-2 py-1 text-text focus:border-accent focus:outline-none"
                    >
                      <option value="Новый">Новый</option>
                      <option value="В обработке">В обработке</option>
                      <option value="Отправлен">Отправлен</option>
                      <option value="Доставлен">Доставлен</option>
                      <option value="Отменён">Отменён</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    {order.status === 'Отправлен' && (
                      <input
                        type="text"
                        value={order.track_number || ''}
                        onChange={(e) => updateOrderStatus(order.id, order.status, e.target.value)}
                        placeholder="Трек-номер"
                        className="text-sm bg-background border border-secondary/30 rounded-lg px-2 py-1 text-text focus:border-accent focus:outline-none w-32"
                      />
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-secondary">
                    {new Date(order.created_at).toLocaleDateString('ru-RU')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
