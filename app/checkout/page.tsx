'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, CreditCard, MapPin } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    delivery_method: 'sdek',
    delivery_address: '',
    payment_method: 'sbp',
    comment: '',
  });

  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cartRes, settingsRes] = await Promise.all([
        fetch('/api/cart'),
        fetch('/api/settings'),
      ]);

      const cartData = await cartRes.json();
      const settingsData = await settingsRes.json();

      setCart(cartData.cart || []);
      setSettings(settingsData);

      if (cartData.cart?.length === 0) {
        router.push('/cart');
      }
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const items = cart.map((item) => ({
        product_id: item.product_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      }));

      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          total_price: total,
          delivery_method: formData.delivery_method,
          delivery_address: formData.delivery_address,
          payment_method: formData.payment_method,
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email,
          comment: formData.comment,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Ошибка при оформлении заказа');
        return;
      }

      const data = await res.json();

      if (formData.payment_method === 'sbp' && settings?.sbp_qr_url) {
        setShowQR(true);
      } else {
        router.push(`/track?phone=${encodeURIComponent(formData.phone)}`);
      }
    } catch (error) {
      console.error('Ошибка оформления заказа:', error);
      alert('Ошибка при оформлении заказа');
    } finally {
      setSubmitting(false);
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

  if (showQR && settings?.sbp_qr_url) {
    return (
      <div className="min-h-screen bg-cream flex flex-col">
        <Navbar />
        <div className="flex-grow container mx-auto px-4 py-24">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-3xl p-8 card-shadow">
              <h1 className="text-3xl font-bold text-text-primary mb-4">Оплата заказа</h1>
              <p className="text-text-secondary mb-8">
                Отсканируйте QR-код для оплаты через Систему Быстрых Платежей
              </p>
              
              <div className="max-w-xs mx-auto mb-8">
                <img
                  src={settings.sbp_qr_url}
                  alt="QR код для оплаты"
                  className="w-full h-auto rounded-2xl"
                />
              </div>

              <div className="text-3xl font-bold text-brown mb-8">
                {total.toLocaleString('ru-RU')} ₽
              </div>

              <button
                onClick={() => router.push(`/track?phone=${encodeURIComponent(formData.phone)}`)}
                className="bg-olive hover:bg-olive-dark text-white px-8 py-4 rounded-xl font-medium transition-colors"
              >
                Я оплатил
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-text-primary mb-8">Оформление заказа</h1>

          <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
            {/* Форма */}
            <div className="lg:col-span-2 space-y-6">
              {/* Контактные данные */}
              <div className="bg-white rounded-2xl p-6 card-shadow">
                <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center space-x-2">
                  <Package className="w-5 h-5 text-olive" />
                  <span>Контактные данные</span>
                </h2>

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Ваше имя"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-cream-light rounded-xl border border-transparent focus:border-olive focus:outline-none transition-colors"
                    required
                  />

                  <input
                    type="tel"
                    placeholder="Телефон +7 (___) ___-__-__"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-cream-light rounded-xl border border-transparent focus:border-olive focus:outline-none transition-colors"
                    required
                  />

                  <input
                    type="email"
                    placeholder="Email (необязательно)"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-cream-light rounded-xl border border-transparent focus:border-olive focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Доставка */}
              <div className="bg-white rounded-2xl p-6 card-shadow">
                <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-olive" />
                  <span>Способ доставки</span>
                </h2>

                <div className="space-y-3 mb-4">
                  <label className="flex items-center space-x-3 p-4 bg-cream-light rounded-xl cursor-pointer hover:bg-cream transition-colors">
                    <input
                      type="radio"
                      name="delivery"
                      value="sdek"
                      checked={formData.delivery_method === 'sdek'}
                      onChange={(e) =>
                        setFormData({ ...formData, delivery_method: e.target.value })
                      }
                      className="w-5 h-5 text-olive"
                    />
                    <div className="flex-grow">
                      <div className="font-medium text-text-primary">СДЭК</div>
                      <div className="text-sm text-text-secondary">3-7 рабочих дней</div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 bg-cream-light rounded-xl cursor-pointer hover:bg-cream transition-colors">
                    <input
                      type="radio"
                      name="delivery"
                      value="pickup"
                      checked={formData.delivery_method === 'pickup'}
                      onChange={(e) =>
                        setFormData({ ...formData, delivery_method: e.target.value })
                      }
                      className="w-5 h-5 text-olive"
                    />
                    <div className="flex-grow">
                      <div className="font-medium text-text-primary">Самовывоз</div>
                      <div className="text-sm text-text-secondary">
                        {settings?.pickup_address || 'г. Новороссийск'}
                      </div>
                    </div>
                  </label>
                </div>

                {formData.delivery_method === 'sdek' && (
                  <textarea
                    placeholder="Адрес доставки"
                    value={formData.delivery_address}
                    onChange={(e) =>
                      setFormData({ ...formData, delivery_address: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-cream-light rounded-xl border border-transparent focus:border-olive focus:outline-none transition-colors resize-none"
                    rows={3}
                    required
                  />
                )}
              </div>

              {/* Оплата */}
              <div className="bg-white rounded-2xl p-6 card-shadow">
                <h2 className="text-xl font-bold text-text-primary mb-6 flex items-center space-x-2">
                  <CreditCard className="w-5 h-5 text-olive" />
                  <span>Способ оплаты</span>
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3 p-4 bg-cream-light rounded-xl cursor-pointer hover:bg-cream transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="sbp"
                      checked={formData.payment_method === 'sbp'}
                      onChange={(e) =>
                        setFormData({ ...formData, payment_method: e.target.value })
                      }
                      className="w-5 h-5 text-olive"
                    />
                    <div className="flex-grow">
                      <div className="font-medium text-text-primary">СБП (QR-код)</div>
                      <div className="text-sm text-text-secondary">
                        Быстрая оплата по QR-коду
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-4 bg-cream-light rounded-xl cursor-pointer hover:bg-cream transition-colors">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={formData.payment_method === 'cod'}
                      onChange={(e) =>
                        setFormData({ ...formData, payment_method: e.target.value })
                      }
                      className="w-5 h-5 text-olive"
                    />
                    <div className="flex-grow">
                      <div className="font-medium text-text-primary">
                        Наложенный платёж
                      </div>
                      <div className="text-sm text-text-secondary">
                        Оплата при получении
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Комментарий */}
              <div className="bg-white rounded-2xl p-6 card-shadow">
                <textarea
                  placeholder="Комментарий к заказу (необязательно)"
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  className="w-full px-4 py-3 bg-cream-light rounded-xl border border-transparent focus:border-olive focus:outline-none transition-colors resize-none"
                  rows={3}
                />
              </div>
            </div>

            {/* Итого */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 card-shadow sticky top-24">
                <h3 className="text-xl font-bold text-text-primary mb-6">Ваш заказ</h3>

                <div className="space-y-3 mb-6 pb-6 border-b border-brown/10">
                  {cart.map((item) => (
                    <div key={item.product_id} className="flex justify-between text-sm">
                      <span className="text-text-secondary">
                        {item.name} × {item.quantity}
                      </span>
                      <span className="font-medium">
                        {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-xl font-bold text-text-primary">Итого</span>
                  <span className="text-3xl font-bold text-brown">
                    {total.toLocaleString('ru-RU')} ₽
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-olive hover:bg-olive-dark text-white py-4 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Оформление...' : 'Оформить заказ'}
                </button>

                <p className="text-xs text-text-secondary mt-4 text-center">
                  Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}
