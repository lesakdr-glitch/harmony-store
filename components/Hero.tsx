'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Hero() {
  const parallaxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current && window.scrollY <= window.innerHeight) {
        const scrolled = window.scrollY;
        const rate = scrolled * 0.3;
        parallaxRef.current.style.transform = `translateY(${rate}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Параллакс фон */}
      <div 
        ref={parallaxRef}
        className="absolute inset-0 gradient-natural z-0"
        style={{
          background: 'linear-gradient(135deg, #FAF7F2 0%, #F5F1E8 50%, #E8E4D8 100%)',
        }}
      >
        {/* Органические узоры */}
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-brown/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-olive/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brown/3 rounded-full blur-3xl" />
      </div>

      {/* Контент */}
      <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-3xl fade-in">
          <div className="inline-block bg-olive/10 text-olive px-4 py-2 rounded-full text-sm font-medium mb-6">
            🍃 Природная гармония здоровья
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 font-raleway leading-tight">
            Harmony Store — здоровье начинается с{' '}
            <span className="text-olive relative">
              митохондрий
              <svg 
                className="absolute -bottom-2 left-0 w-full" 
                height="4" 
                viewBox="0 0 200 4" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 2Q50 0 100 2T200 2" stroke="#6B8E4E" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
          
          <p className="text-xl text-text-secondary mb-8 max-w-2xl">
            Продукция Vilavi для митохондриального здоровья. БАДы, концентраты, масла и витаминные комплексы, 
            созданные на основе современных научных исследований.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/catalog"
              className="btn-primary flex items-center justify-center space-x-2 group"
            >
              <span>В каталог</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              href="/about"
              className="btn-secondary flex items-center justify-center space-x-2"
            >
              <span>Узнать о Vilavi</span>
            </Link>
          </div>
          
          <div className="mt-12 flex items-center space-x-8 text-sm text-text-secondary">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-olive rounded-full" />
              <span>Более 50 продуктов</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-olive rounded-full" />
              <span>Доставка по всей России</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-olive rounded-full" />
              <span>Консультации специалистов</span>
            </div>
          </div>
        </div>
      </div>

      {/* Декоративные элементы */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/50 to-transparent" />
      
      {/* Листик анимация */}
      <div className="absolute top-20 right-20 w-16 h-16 opacity-20">
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10C30 30 20 60 30 80C40 100 60 100 70 80C80 60 70 30 50 10Z" fill="#6B8E4E"/>
        </svg>
      </div>
    </section>
  );
}