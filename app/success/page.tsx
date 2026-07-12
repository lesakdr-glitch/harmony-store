'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingSupport from '@/components/FloatingSupport';
import { formatPrice } from '@/lib/utils';

export default function Success() {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem('last_order');
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
      localStorage.removeItem('last_order');
    } else {
      router.push('/');
    }
  }, [router]);

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-6">✅</div>
          
          <h1 className="font-raleway text-3xl font-bold text-text-primary mb-4">
            Заказ оформлен!
          </h1>

          <div className="bg-card p-8 rounded-2xl shadow-sm space-y-4 text-left">
            <div className="flex justify-between">
              <span className="text-text-secondary">Номер заказа:</span>
              <span className="font-semibold">{order.id.slice(0, 8)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-text-secondary">Сумма:</span>
              <span className="font-semibold text-accent-olive">{formatPrice(order.total_price)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-text-secondary">Способ оплаты:</span>
              <span className="font-semibold">{order.payment_method === 'sbp' ? 'QR СБП' : 'Наложенный платёж'}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-text-secondary">Способ доставки:</span>
              <span className="font-semibold">{order.delivery_method === 'sdek' ? 'СДЭК' : 'Самовывоз'}</span>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <button
              onClick={() => router.push('/account')}
              className="w-full bg-accent-olive text-white py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-colors"
            >
              В личный кабинет
            </button>
            
            <button
              onClick={() => router.push('/catalog')}
              className="w-full px-6 py-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Продолжить покупки
            </button>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingSupport />
    </div>
  );
}
