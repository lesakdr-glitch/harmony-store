'use client';

import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FloatingSupport() {
  const [isVisible, setIsVisible] = useState(true);
  const [supportUsername, setSupportUsername] = useState('HarmonySupport');

  useEffect(() => {
    // Загружаем настройки с сервера
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.support_telegram) {
          setSupportUsername(data.support_telegram);
        }
      })
      .catch(console.error);

    // Скрытие при скролле вниз
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Скроллим вниз — скрываем
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
        // Скроллим вверх или вверху страницы — показываем
        setIsVisible(true);
      }
      
      lastScrollY = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <a
      href={`https://t.me/${supportUsername}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`fixed bottom-6 right-6 z-50 transition-all duration-500 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
      aria-label="Чат поддержки в Telegram"
    >
      <div className="relative group">
        {/* Анимированная кнопка */}
        <div className="w-16 h-16 bg-gradient-to-br from-olive to-brown rounded-full flex items-center justify-center shadow-lg shadow-olive/30 hover:shadow-xl hover:shadow-olive/40 transition-all duration-300 group-hover:scale-105">
          <MessageCircle className="w-7 h-7 text-white" />
        </div>

        {/* Пульсация */}
        <div className="absolute inset-0 bg-olive/20 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 bg-olive/10 rounded-full animate-ping" style={{ animationDelay: '2s' }} />

        {/* Тултип */}
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="relative bg-white px-4 py-2 rounded-xl shadow-lg whitespace-nowrap">
            <div className="text-sm font-medium text-brown">
              Написать в поддержку
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2">
              <div className="w-2 h-2 bg-white transform rotate-45" />
            </div>
          </div>
        </div>

        {/* Уведомление */}
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs text-white font-bold">1</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.05);
            opacity: 0.8;
          }
        }
        
        .animate-ping {
          animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </a>
  );
}