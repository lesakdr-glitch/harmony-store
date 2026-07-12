'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingSupport from '@/components/FloatingSupport';
import ProductCard from '@/components/ProductCard';
import { formatPrice } from '@/lib/utils';

export default function Account() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [orders, setOrders] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(savedUser));
    setProfileData(JSON.parse(savedUser));
    loadOrders();
    loadFavorites();
  }, [router]);

  const loadOrders = async () => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (savedUser.email) {
      const response = await fetch(`/api/orders?email=${savedUser.email}`);
      const data = await response.json();
      setOrders(data.orders || []);
    }
  };

  const loadFavorites = async () => {
    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (savedUser.id) {
      const response = await fetch(`/api/favorites?user_id=${savedUser.id}`);
      const data = await response.json();
      setFavorites(data.favorites || []);
    }
  };

  const handleSaveProfile = async () => {
    const response = await fetch('/api/auth/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      alert('Профиль сохранён');
    }
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

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-raleway text-3xl font-bold text-text-primary mb-8">
            Личный кабинет
          </h1>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Вкладки */}
            <aside className="md:w-64 space-y-2">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                  activeTab === 'profile' ? 'bg-accent-olive text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Профиль
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
                onClick={() => setActiveTab('favorites')}
                className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                  activeTab === 'favorites' ? 'bg-accent-olive text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Избранное
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('user');
                  router.push('/');
                }}
                className="w-full text-left px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                Выйти
              </button>
            </aside>

            {/* Контент */}
            <div className="flex-1">
              {activeTab === 'profile' && (
                <div className="bg-card p-6 rounded-2xl shadow-sm space-y-4">
                  <h2 className="font-semibold text-xl mb-4">Профиль</h2>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Имя</label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Телефон</label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Адрес</label>
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    className="bg-accent-olive text-white px-6 py-3 rounded-xl hover:bg-opacity-90 transition-colors"
                  >
                    Сохранить
                  </button>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <p className="text-text-secondary">У вас пока нет заказов</p>
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

              {activeTab === 'favorites' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.length === 0 ? (
                    <p className="text-text-secondary col-span-full">У вас пока нет избранных товаров</p>
                  ) : (
                    favorites.map((item) => (
                      <ProductCard key={item.id} product={item.product} />
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingSupport />
    </div>
  );
}
