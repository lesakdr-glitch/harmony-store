'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Product } from '@/lib/supabase';
import { formatPrice } from '@/lib/utils';

interface OrderFormProps {
  product: Product;
}

export default function OrderForm({ product }: OrderFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    delivery: 'СДЭК',
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const normalizePhone = (phone: string): string => {
    // Убираем все символы кроме цифр
    const digits = phone.replace(/\D/g, '');
    
    // Если начинается с 8, заменяем на 7
    if (digits.startsWith('8')) {
      return '+7' + digits.slice(1);
    }
    
    // Если начинается с 7
    if (digits.startsWith('7')) {
      return '+' + digits;
    }
    
    // Если 10 цифр без кода страны
    if (digits.length === 10) {
      return '+7' + digits;
    }
    
    // Если уже 11 цифр
    if (digits.length === 11) {
      return '+' + digits;
    }
    
    // В остальных случаях добавляем +7
    return '+7' + digits;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Нормализуем телефон перед отправкой
      const normalizedPhone = normalizePhone(formData.phone);

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: normalizedPhone,
          product_name: product.name,
          price: product.price,
        }),
      });

      if (response.ok) {
        setShowSuccess(true);
        setFormData({ name: '', phone: '', city: '', delivery: 'СДЭК' });
        setTimeout(() => setShowSuccess(false), 5000);
      } else {
        const data = await response.json();
        alert(data.error || 'Ошибка при оформлении заказа');
      }
    } catch (error) {
      alert('Ошибка при оформлении заказа. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="order-form" className="py-20 px-4">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-card p-8 md:p-12 rounded-card-lg"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">Оформить заказ</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-text mb-2 font-medium">Ваше имя</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none transition-colors"
                placeholder="Иван Иванов"
              />
            </div>

            <div>
              <label className="block text-text mb-2 font-medium">Телефон</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none transition-colors"
                placeholder="+7 (900) 123-45-67 или 89001234567"
              />
              <p className="text-secondary text-xs mt-1">
                Принимаются любые форматы: +7, 8, без символов
              </p>
            </div>

            <div>
              <label className="block text-text mb-2 font-medium">Город</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none transition-colors"
                placeholder="Москва"
              />
            </div>

            <div>
              <label className="block text-text mb-2 font-medium">Способ доставки</label>
              <select
                value={formData.delivery}
                onChange={(e) => setFormData({ ...formData, delivery: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none transition-colors"
              >
                <option value="СДЭК">СДЭК (3-7 дней)</option>
                <option value="Почта России">Почта России (7-14 дней)</option>
                <option value="Самовывоз">Самовывоз (только Новороссийск)</option>
              </select>
              {formData.delivery === 'Самовывоз' && (
                <p className="mt-2 text-sm text-secondary">
                  📍 Самовывоз доступен только в Новороссийске
                </p>
              )}
            </div>

            <div className="bg-background/50 p-4 rounded-xl">
              <div className="flex justify-between mb-2">
                <span className="text-secondary">Товар:</span>
                <span className="text-text font-medium">{product.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary">Стоимость:</span>
                <span className="text-accent font-bold text-xl">{formatPrice(product.price)}₽</span>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full py-4 bg-accent hover:bg-accent/90 text-white text-lg font-semibold rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Оформление...' : `Оформить заказ — ${formatPrice(product.price)}₽`}
            </motion.button>

            <p className="text-center text-secondary text-sm">
              Нажимая кнопку, вы соглашаетесь с условиями обработки данных
            </p>
          </form>
        </motion.div>

        {/* Попап успеха */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 flex items-center justify-center z-50 px-4"
          >
            <div className="absolute inset-0 bg-black/80" onClick={() => setShowSuccess(false)} />
            <div className="relative bg-card p-8 rounded-card-lg max-w-md">
              <h3 className="text-2xl font-bold text-success mb-4">Спасибо за заказ!</h3>
              <p className="text-secondary">
                Мы перезвоним вам в течение 15 минут для подтверждения.
              </p>
              <button
                onClick={() => setShowSuccess(false)}
                className="mt-6 w-full py-3 bg-accent text-white rounded-full hover:bg-accent/90 transition-colors"
              >
                Закрыть
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
