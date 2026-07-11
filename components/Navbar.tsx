'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Heart, ShoppingBag, User, Menu, X, Search } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-olive rounded-full flex items-center justify-center">
              <span className="text-white font-raleway font-bold text-lg">H</span>
            </div>
            <div>
              <div className="font-raleway font-bold text-xl text-brown">Harmony Store</div>
              <div className="text-xs text-text-secondary">Vilavi для здоровья</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-text-primary hover:text-olive transition-colors font-medium">
              Главная
            </Link>
            <Link href="/catalog" className="text-text-primary hover:text-olive transition-colors font-medium">
              Каталог
            </Link>
            <Link href="/about" className="text-text-primary hover:text-olive transition-colors font-medium">
              О Vilavi
            </Link>
            <Link href="/delivery" className="text-text-primary hover:text-olive transition-colors font-medium">
              Доставка
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="text-text-secondary hover:text-brown transition-colors"
              aria-label="Поиск"
            >
              <Search className="w-5 h-5" />
            </button>
            
            <Link href="/favorites" className="text-text-secondary hover:text-brown transition-colors relative">
              <Heart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-olive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                3
              </span>
            </Link>

            <Link href="/cart" className="text-text-secondary hover:text-brown transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-olive text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </Link>

            <Link
              href="/account"
              className="flex items-center space-x-2 text-text-secondary hover:text-brown transition-colors"
            >
              <User className="w-5 h-5" />
              <span className="font-medium">Личный кабинет</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-brown"
            aria-label="Меню"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="mt-4 animate-slide-up">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск товаров..."
                className="w-full px-4 py-3 pr-12 bg-cream-light border border-brown/20 rounded-2xl focus:outline-none focus:border-brown"
              />
              <Search className="absolute right-4 top-3.5 w-5 h-5 text-brown" />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 animate-fade-in border-t border-gray-100 pt-4">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-text-primary hover:text-olive transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Главная
              </Link>
              <Link
                href="/catalog"
                className="text-text-primary hover:text-olive transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Каталог
              </Link>
              <Link
                href="/about"
                className="text-text-primary hover:text-olive transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                О Vilavi
              </Link>
              <Link
                href="/delivery"
                className="text-text-primary hover:text-olive transition-colors font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Доставка
              </Link>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <Link
                  href="/favorites"
                  className="flex items-center space-x-2 text-text-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Heart className="w-5 h-5" />
                  <span>Избранное</span>
                </Link>
                <Link
                  href="/cart"
                  className="flex items-center space-x-2 text-text-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Корзина</span>
                </Link>
                <Link
                  href="/account"
                  className="flex items-center space-x-2 text-text-secondary"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Войти</span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}