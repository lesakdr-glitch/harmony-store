'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await fetch('/api/cart');
      const data = await res.json();
      setCart(data.cart || []);
    } catch (error) {
      console.error('Ошибка загрузки корзины:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId, quantity: newQuantity }),
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Ошибка обновления количества:', error);
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: productId }),
      });

      if (res.ok) {
        const data = await res.json();
        setCart(data.cart);
      }
    } catch (error) {
      console.error('Ошибка удаления товара:', error);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
          <h1 className="text-4xl font-bold text-text-primary mb-8">Корзина</h1>

          {cart.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl card-shadow">
              <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-text-secondary" />
              <h2 className="text-2xl font-bold text-text-primary mb-2">Корзина пуста</h2>
              <p className="text-text-secondary mb-6">Добавьте товары из каталога</p>
              <button
                onClick={() => router.push('/catalog')}
                className="bg-olive hover:bg-olive-dark text-white px-8 py-3 rounded-xl font-medium transition-colors"
              >
                Перейти в каталог
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Список товаров */}
              <div className="lg:col-span-2 space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.product_id}
                    className="bg-white rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-shadow"
                  >
                    <div className="flex gap-6">
                      {/* Изображение */}
                      <div className="w-24 h-24 bg-cream-light rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Информация */}
                      <div className="flex-grow">
                        <h3 className="font-bold text-text-primary mb-2">{item.name}</h3>
                        <div className="text-lg font-bold text-brown mb-4">
                          {item.price.toLocaleString('ru-RU')} ₽
                        </div>

                        {/* Количество */}
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 bg-cream-light rounded-lg hover:bg-cream transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Minus className="w-4 h-4 text-text-primary" />
                          </button>
                          
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="w-8 h-8 bg-cream-light rounded-lg hover:bg-cream transition-colors flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4 text-text-primary" />
                          </button>
                        </div>
                      </div>

                      {/* Сумма и удаление */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="text-text-secondary hover:text-red-500 transition-colors"
                          aria-label="Удалить"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        
                        <div className="text-xl font-bold text-brown">
                          {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Итого */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 card-shadow sticky top-24">
                  <h3 className="text-xl font-bold text-text-primary mb-6">Итого</h3>

                  <div className="space-y-3 mb-6 pb-6 border-b border-brown/10">
                    <div className="flex justify-between text-text-secondary">
                      <span>Товары ({cart.length})</span>
                      <span>{total.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <div className="flex justify-between text-text-secondary">
                      <span>Доставка</span>
                      <span>Рассчитается при оформлении</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline mb-6">
                    <span className="text-xl font-bold text-text-primary">Всего</span>
                    <span className="text-3xl font-bold text-brown">
                      {total.toLocaleString('ru-RU')} ₽
                    </span>
                  </div>

                  <button
                    onClick={() => router.push('/checkout')}
                    className="w-full bg-olive hover:bg-olive-dark text-white py-4 rounded-xl font-medium transition-colors"
                  >
                    Оформить заказ
                  </button>

                  <button
                    onClick={() => router.push('/catalog')}
                    className="w-full mt-3 border border-brown/20 hover:border-olive text-text-primary py-4 rounded-xl font-medium transition-colors"
                  >
                    Продолжить покупки
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
