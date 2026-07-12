'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingSupport from '@/components/FloatingSupport';
import { formatPrice } from '@/lib/utils';

export default function Checkout() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [settings, setSettings] = useState({ pickup_address: '', sbp_qr_url: '' });
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    delivery_method: 'sdek',
    payment_method: 'sbp',
  });

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0) {
      router.push('/cart');
      return;
    }
    setCart(savedCart);
    setTotal(savedCart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0));

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const order = {
      items: cart,
      total_price: total,
      customer_name: formData.name,
      customer_phone: formData.phone,
      customer_email: formData.email,
      delivery_address: formData.delivery_method === 'sdek' ? formData.address : settings.pickup_address,
      delivery_method: formData.delivery_method,
      payment_method: formData.payment_method,
    };

    const response = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('cart', '[]');
      localStorage.setItem('last_order', JSON.stringify({ ...data.order, payment_method: formData.payment_method }));
      router.push('/success');
    } else {
      alert('Ошибка при оформлении заказа');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-raleway text-3xl font-bold text-text-primary mb-8">
            Оформление заказа
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="bg-card p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="font-semibold text-xl mb-4">Контактные данные</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2">Имя *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Телефон *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
                />
              </div>
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="font-semibold text-xl mb-4">Доставка</h2>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="sdek"
                    checked={formData.delivery_method === 'sdek'}
                    onChange={(e) => setFormData({ ...formData, delivery_method: e.target.value })}
                    className="w-5 h-5 text-accent-olive"
                  />
                  <span>СДЭК (3-7 дней)</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="pickup"
                    checked={formData.delivery_method === 'pickup'}
                    onChange={(e) => setFormData({ ...formData, delivery_method: e.target.value })}
                    className="w-5 h-5 text-accent-olive"
                  />
                  <span>Самовывоз ({settings.pickup_address})</span>
                </label>
              </div>

              {formData.delivery_method === 'sdek' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Адрес доставки *</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
                  />
                </div>
              )}
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-sm space-y-4">
              <h2 className="font-semibold text-xl mb-4">Оплата</h2>
              
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="sbp"
                    checked={formData.payment_method === 'sbp'}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-5 h-5 text-accent-olive"
                  />
                  <span>QR СБП</span>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="cod"
                    checked={formData.payment_method === 'cod'}
                    onChange={(e) => setFormData({ ...formData, payment_method: e.target.value })}
                    className="w-5 h-5 text-accent-olive"
                  />
                  <span>Наложенный платёж</span>
                </label>
              </div>

              {formData.payment_method === 'sbp' && settings.sbp_qr_url && (
                <div className="text-center">
                  <img src={settings.sbp_qr_url} alt="QR СБП" className="max-w-xs mx-auto rounded-xl" />
                  <p className="text-sm text-text-secondary mt-2">Отсканируйте QR-код для оплаты</p>
                </div>
              )}
            </div>

            <div className="bg-card p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold">К оплате:</span>
                <span className="text-2xl font-bold text-accent-olive">{formatPrice(total)}</span>
              </div>

              <button
                type="submit"
                className="w-full bg-accent-olive text-white py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-colors"
              >
                Подтвердить заказ
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
      <FloatingSupport />
    </div>
  );
}
