'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((sum: number, item: any) => sum + item.quantity, 0));

    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);

    const darkMode = localStorage.getItem('theme') === 'dark';
    setIsDark(darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);

    // Обновлять корзину при изменении storage
    const handleStorage = () => {
      const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(updatedCart.reduce((sum: number, item: any) => sum + item.quantity, 0));
      setIsAuthenticated(!!localStorage.getItem('user'));
    };
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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

          {/* Навигация desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/catalog" className="text-text-secondary hover:text-accent-olive transition-colors">
              Каталог
            </Link>
            <Link href="/track" className="text-text-secondary hover:text-accent-olive transition-colors">
              Отследить заказ
            </Link>
            {isAuthenticated ? (
              <Link
                href="/account"
                className="text-text-secondary hover:text-accent-olive transition-colors"
              >
                Личный кабинет
              </Link>
            ) : (
              <Link
                href="/login"
                className="bg-accent-olive text-white px-4 py-2 rounded-xl hover:bg-opacity-90 transition-colors text-sm font-medium"
              >
                Войти
              </Link>
            )}
          </div>

          {/* Правая часть */}
          <div className="flex items-center space-x-3">
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

            {/* Мобильное меню */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Меню"
            >
              <div className="space-y-1">
                <span className="block w-5 h-0.5 bg-text-primary"></span>
                <span className="block w-5 h-0.5 bg-text-primary"></span>
                <span className="block w-5 h-0.5 bg-text-primary"></span>
              </div>
            </button>
          </div>
        </div>

        {/* Мобильное меню dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 dark:border-gray-800 py-4 space-y-3">
            <Link
              href="/catalog"
              onClick={() => setMenuOpen(false)}
              className="block px-2 py-2 text-text-secondary hover:text-accent-olive transition-colors"
            >
              Каталог
            </Link>
            <Link
              href="/track"
              onClick={() => setMenuOpen(false)}
              className="block px-2 py-2 text-text-secondary hover:text-accent-olive transition-colors"
            >
              Отследить заказ
            </Link>
            {isAuthenticated ? (
              <Link
                href="/account"
                onClick={() => setMenuOpen(false)}
                className="block px-2 py-2 text-text-secondary hover:text-accent-olive transition-colors"
              >
                Личный кабинет
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-2 py-2 text-accent-olive font-medium"
              >
                Войти
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
