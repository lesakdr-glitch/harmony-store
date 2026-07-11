'use client';

import Link from 'next/link';
import { Leaf, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* О компании */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-olive rounded-full flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="font-raleway font-bold text-xl text-brown">Harmony Store</span>
            </div>
            <p className="text-text-secondary text-sm leading-relaxed">
              Продукция Vilavi для митохондриального здоровья. Гармония клеточного здоровья начинается здесь.
            </p>
          </div>

          {/* Каталог */}
          <div>
            <h4 className="font-raleway font-bold text-brown mb-4">Каталог</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/catalog?category=bady" className="text-text-secondary hover:text-olive transition-colors">
                  БАДы и концентраты
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=vitamins" className="text-text-secondary hover:text-olive transition-colors">
                  Витаминные комплексы
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=oils" className="text-text-secondary hover:text-olive transition-colors">
                  Масла
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=fiber" className="text-text-secondary hover:text-olive transition-colors">
                  Клетчатка
                </Link>
              </li>
              <li>
                <Link href="/catalog?category=smoothies" className="text-text-secondary hover:text-olive transition-colors">
                  Смузи
                </Link>
              </li>
            </ul>
          </div>

          {/* Информация */}
          <div>
            <h4 className="font-raleway font-bold text-brown mb-4">Информация</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-text-secondary hover:text-olive transition-colors">
                  О Vilavi
                </Link>
              </li>
              <li>
                <Link href="/delivery" className="text-text-secondary hover:text-olive transition-colors">
                  Доставка и оплата
                </Link>
              </li>
              <li>
                <Link href="/track" className="text-text-secondary hover:text-olive transition-colors">
                  Отследить заказ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-text-secondary hover:text-olive transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-text-secondary hover:text-olive transition-colors">
                  Пользовательское соглашение
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="font-raleway font-bold text-brown mb-4">Контакты</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <Mail className="w-5 h-5 text-olive flex-shrink-0 mt-0.5" />
                <a href="mailto:info@harmony-store.ru" className="text-text-secondary hover:text-olive transition-colors">
                  info@harmony-store.ru
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <Phone className="w-5 h-5 text-olive flex-shrink-0 mt-0.5" />
                <a href="tel:+79001234567" className="text-text-secondary hover:text-olive transition-colors">
                  +7 (900) 123-45-67
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-olive flex-shrink-0 mt-0.5" />
                <span className="text-text-secondary">
                  г. Новороссийск
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-100 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-text-secondary text-sm">
            © 2024 Harmony Store. Все права защищены.
          </p>
          <p className="text-text-secondary text-xs mt-2 md:mt-0">
            Данный сайт не является оффициальным представителем Vilavi
          </p>
        </div>
      </div>
    </footer>
  );
}