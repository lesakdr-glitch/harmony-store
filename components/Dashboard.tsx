'use client';

import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    ordersToday: 0,
    revenueToday: 0,
    totalOrders: 0,
    totalProducts: 0,
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const adminPassword = localStorage.getItem('admin_auth');
      if (!adminPassword) return;

      try {
        // Статистика
        const statsRes = await fetch('/api/admin/dashboard', {
          headers: { 'x-admin-password': adminPassword },
        });
        const statsData = await statsRes.json();
        if (statsData) {
          setStats(statsData);
          setChartData(statsData.chartData || []);
          setRecentOrders(statsData.recentOrders || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Карточки статистики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card p-6 rounded-2xl shadow-sm">
          <h3 className="text-text-secondary text-sm mb-2">Заказов сегодня</h3>
          <p className="text-3xl font-bold text-accent-olive">{stats.ordersToday}</p>
        </div>
        <div className="bg-card p-6 rounded-2xl shadow-sm">
          <h3 className="text-text-secondary text-sm mb-2">Выручка сегодня</h3>
          <p className="text-3xl font-bold text-accent-olive">{stats.revenueToday.toLocaleString()} ₽</p>
        </div>
        <div className="bg-card p-6 rounded-2xl shadow-sm">
          <h3 className="text-text-secondary text-sm mb-2">Всего заказов</h3>
          <p className="text-3xl font-bold text-accent-brown">{stats.totalOrders}</p>
        </div>
        <div className="bg-card p-6 rounded-2xl shadow-sm">
          <h3 className="text-text-secondary text-sm mb-2">Всего товаров</h3>
          <p className="text-3xl font-bold text-accent-brown">{stats.totalProducts}</p>
        </div>
      </div>

      {/* График выручки */}
      <div className="bg-card p-6 rounded-2xl shadow-sm">
        <h3 className="font-raleway text-xl font-bold text-text-primary mb-6">
          Выручка по дням (последние 30 дней)
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#6B8E4E" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Последние заказы */}
      <div className="bg-card p-6 rounded-2xl shadow-sm">
        <h3 className="font-raleway text-xl font-bold text-text-primary mb-6">
          Последние заказы
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4">Имя</th>
                <th className="text-left py-3 px-4">Телефон</th>
                <th className="text-left py-3 px-4">Сумма</th>
                <th className="text-left py-3 px-4">Статус</th>
                <th className="text-left py-3 px-4">Дата</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="py-3 px-4">{order.customer_name}</td>
                  <td className="py-3 px-4">{order.customer_phone}</td>
                  <td className="py-3 px-4">{order.total_price.toLocaleString()} ₽</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">{new Date(order.created_at).toLocaleDateString('ru-RU')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
