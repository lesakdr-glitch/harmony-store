'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Загрузка количества товаров в корзине из localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));

    // Проверка авторизации
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);

    // Проверка темы
    const darkMode = localStorage.getItem('darkMode') === 'true';
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    }

    // Скролл для прозрачности
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('darkMode', String(newDark));
    document.documentElement.classList.toggle('dark');
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-card/95 backdrop-blur-md shadow-sm' : 'bg-card/80 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Логотип */}
          <Link href="/" className="font-raleway text-2xl font-bold text-accent-brown">
            Harmony Store
          </Link>

          {/* Навигация */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/catalog" className="text-text-secondary hover:text-accent-olive transition-colors">
              Каталог
            </Link>
            <Link href="/track" className="text-text-secondary hover:text-accent-olive transition-colors">
              Отследить заказ
            </Link>
            {isAuthenticated ? (
              <Link href="/account" className="text-text-secondary hover:text-accent-olive transition-colors">
                Личный кабинет
              </Link>
            ) : (
              <Link href="/login" className="text-text-secondary hover:text-accent-olive transition-colors">
                Войти
              </Link>
            )}
          </div>

          {/* Правая часть */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Переключить тему"
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            <Link href="/cart" className="relative p-2">
              <span className="text-2xl">🛒</span>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent-olive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
