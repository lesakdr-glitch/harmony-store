'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Package, Heart, LogOut } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type Tab = 'profile' | 'orders' | 'favorites';

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [profileData, setProfileData] = useState({
    name: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (user) {
      if (activeTab === 'orders') loadOrders();
      if (activeTab === 'favorites') loadFavorites();
    }
  }, [activeTab, user]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (!res.ok) {
        router.push('/login?redirect=/account');
        return;
      }
      const data = await res.json();
      setUser(data.user);
      setProfileData({
        name: data.user.name || '',
        phone: data.user.phone || '',
        address: data.user.address || '',
      });
    } catch (error) {
      router.push('/login?redirect=/account');
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Ошибка загрузки заказов:', error);
    }
  };

  const loadFavorites = async () => {
    try {
      const res = await fetch('/api/favorites');
      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error('Ошибка загрузки избранного:', error);
    }
  };

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
      });

      if (res.ok) {
        alert('Профиль обновлён');
        const data = await res.json();
        setUser(data.user);
      }
    } catch (error) {
      console.error('Ошибка обновления профиля:', error);
      alert('Ошибка при обновлении профиля');
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  const removeFavorite = async (productId: string) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      });
      if (res.ok) {
        setFavorites(favorites.filter((f: any) => f.product.id !== productId));
      }
    } catch (error) {
      console.error('Ошибка удаления из избранного:', error);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="text-text-secondary">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold text-text-primary">Личный кабинет</h1>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-text-secondary hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Выйти</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Меню */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-4 card-shadow space-y-2">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'profile'
                      ? 'bg-olive text-white'
                      : 'text-text-secondary hover:bg-cream-light'
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Профиль</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'orders'
                      ? 'bg-olive text-white'
                      : 'text-text-secondary hover:bg-cream-light'
                  }`}
                >
                  <Package className="w-5 h-5" />
                  <span className="font-medium">Заказы</span>
                </button>

                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${
                    activeTab === 'favorites'
                      ? 'bg-olive text-white'
                      : 'text-text-secondary hover:bg-cream-light'
                  }`}
                >
                  <Heart className="w-5 h-5" />
                  <span className="font-medium">Избранное</span>
                </button>
              </div>
            </div>

            {/* Контент */}
            <div className="lg:col-span-3">
              {/* Профиль */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-2xl p-8 card-shadow">
                  <h2 className="text-2xl font-bold text-text-primary mb-6">Мой профиль</h2>
                  
                  <form onSubmit={updateProfile} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl text-text-secondary cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Имя
                      </label>
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData({ ...profileData, name: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-cream-light rounded-xl border border-transparent focus:border-olive focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Телефон
                      </label>
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData({ ...profileData, phone: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-cream-light rounded-xl border border-transparent focus:border-olive focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Адрес
                      </label>
                      <textarea
                        value={profileData.address}
                        onChange={(e) =>
                          setProfileData({ ...profileData, address: e.target.value })
                        }
                        className="w-full px-4 py-3 bg-cream-light rounded-xl border border-transparent focus:border-olive focus:outline-none transition-colors resize-none"
                        rows={3}
                      />
                    </div>

                    <button
                      type="submit"
                      className="bg-olive hover:bg-olive-dark text-white px-8 py-3 rounded-xl font-medium transition-colors"
                    >
                      Сохранить изменения
                    </button>
                  </form>
                </div>
              )}

              {/* Заказы */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-text-primary mb-6">Мои заказы</h2>
                  
                  {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 card-shadow text-center">
                      <Package className="w-16 h-16 mx-auto mb-4 text-text-secondary" />
                      <p className="text-text-secondary">У вас пока нет заказов</p>
                    </div>
                  ) : (
                    orders.map((order: any) => (
                      <div
                        key={order.id}
                        className="bg-white rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <div className="text-sm text-text-secondary mb-1">
                              Заказ от{' '}
                              {new Date(order.created_at).toLocaleDateString('ru-RU')}
                            </div>
                            <div className="font-bold text-text-primary">
                              {order.total_price.toLocaleString('ru-RU')} ₽
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="space-y-2">
                          {order.items.map((item: any, idx: number) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-text-secondary">
                                {item.name} × {item.quantity}
                              </span>
                              <span className="font-medium">
                                {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                              </span>
                            </div>
                          ))}
                        </div>

                        {order.track_number && (
                          <div className="mt-4 pt-4 border-t border-brown/10">
                            <span className="text-sm text-text-secondary">
                              Трек-номер: <span className="font-medium">{order.track_number}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Избранное */}
              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-2xl font-bold text-text-primary mb-6">Избранное</h2>
                  
                  {favorites.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 card-shadow text-center">
                      <Heart className="w-16 h-16 mx-auto mb-4 text-text-secondary" />
                      <p className="text-text-secondary">У вас пока нет избранных товаров</p>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      {favorites.map((fav: any) => (
                        <div
                          key={fav.id}
                          className="bg-white rounded-2xl p-4 card-shadow hover:card-shadow-hover transition-shadow"
                        >
                          <div className="flex gap-4">
                            <div className="w-20 h-20 bg-cream-light rounded-xl overflow-hidden flex-shrink-0">
                              <img
                                src={fav.product.image_url}
                                alt={fav.product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-grow">
                              <h3 className="font-bold text-text-primary mb-1 line-clamp-2">
                                {fav.product.name}
                              </h3>
                              <div className="text-lg font-bold text-brown mb-2">
                                {fav.product.price.toLocaleString('ru-RU')} ₽
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => router.push(`/product/${fav.product.slug}`)}
                                  className="flex-1 text-sm bg-olive hover:bg-olive-dark text-white py-2 rounded-lg transition-colors"
                                >
                                  Смотреть
                                </button>
                                <button
                                  onClick={() => removeFavorite(fav.product.id)}
                                  className="text-sm text-text-secondary hover:text-red-500 transition-colors px-3"
                                >
                                  Удалить
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
