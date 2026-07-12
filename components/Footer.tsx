'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Settings {
  contact_phone?: string;
  contact_email?: string;
  inn_ogrn?: string;
}

export default function Footer() {
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-card border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* О компании */}
          <div>
            <h3 className="font-raleway text-xl font-bold text-accent-brown mb-4">
              Harmony Store
            </h3>
            <p className="text-text-secondary text-sm mb-4">
              Продукция Vilavi для митохондриального здоровья
            </p>
            <div className="flex space-x-4">
              <span className="text-2xl">🌿</span>
            </div>
          </div>

          {/* Навигация */}
          <div>
            <h4 className="font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <Link href="/catalog" className="hover:text-accent-olive transition-colors">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-accent-olive transition-colors">
                  Отследить заказ
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-accent-olive transition-colors">
                  Личный кабинет
                </Link>
              </li>
            </ul>
          </div>

          {/* Информация */}
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <Link href="/about" className="hover:text-accent-olive transition-colors">
                  О нас
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="hover:text-accent-olive transition-colors">
                  Доставка и оплата
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-accent-olive transition-colors">
                  Возврат товара
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent-olive transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-accent-olive transition-colors">
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              {settings.contact_phone && (
                <li>
                  <a href={`tel:${settings.contact_phone}`} className="hover:text-accent-olive transition-colors">
                    📱 {settings.contact_phone}
                  </a>
                </li>
              )}
              {settings.contact_email && (
                <li>
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-accent-olive transition-colors">
                    📧 {settings.contact_email}
                  </a>
                </li>
              )}
              {!settings.contact_phone && !settings.contact_email && (
                <li className="text-text-secondary">Контакты не указаны</li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-text-secondary">
          <p>© {new Date().getFullYear()} Harmony Store. Все права защищены.</p>
          {settings.inn_ogrn && (
            <p className="mt-2">{settings.inn_ogrn}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
