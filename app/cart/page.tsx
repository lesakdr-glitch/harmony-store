'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingSupport from '@/components/FloatingSupport';
import { formatPrice } from '@/lib/utils';

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadCart();
    window.addEventListener('cart-updated', loadCart);
    return () => window.removeEventListener('cart-updated', loadCart);
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
    setTotal(savedCart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0));
  };

  const updateQuantity = (id: string, delta: number) => {
    const newCart = cart.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setTotal(newCart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0));
  };

  const removeItem = (id: string) => {
    const newCart = cart.filter((item) => item.id !== id);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
    setTotal(newCart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-raleway text-3xl font-bold text-text-primary mb-8">
            Корзина
          </h1>

          {cart.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary mb-6">Корзина пуста</p>
              <button
                onClick={() => router.push('/catalog')}
                className="bg-accent-olive text-white px-6 py-3 rounded-xl hover:bg-opacity-90 transition-colors"
              >
                Перейти в каталог
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-8">
                {cart.map((item) => (
                  <div key={item.id} className="bg-card p-4 rounded-2xl shadow-sm flex items-center space-x-4">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-xl"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-text-primary">{item.name}</h3>
                      <p className="text-accent-olive font-bold">{formatPrice(item.price)}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-bold text-text-primary">{formatPrice(item.price * item.quantity)}</p>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-card p-6 rounded-2xl shadow-sm mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-xl font-semibold">Итого:</span>
                  <span className="text-2xl font-bold text-accent-olive">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-accent-olive text-white py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-colors"
              >
                Оформить заказ
              </button>
            </>
          )}
        </div>
      </main>

      <Footer />
      <FloatingSupport />
    </div>
  );
}
