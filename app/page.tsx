'use client';

import { useEffect, useState } from 'react';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import AboutVilavi from '@/components/AboutVilavi';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingSupport from '@/components/FloatingSupport';

export default function Home() {
  const [settings, setSettings] = useState({ hero_title: '', hero_subtitle: '' });
  const [soldToday, setSoldToday] = useState(0);

  useEffect(() => {
    // Загрузка настроек
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSettings(data))
      .catch(console.error);

    // Счётчик продаж (рандом или из localStorage)
    const stored = localStorage.getItem('sold_today');
    if (stored) {
      setSoldToday(parseInt(stored));
    } else {
      const random = Math.floor(Math.random() * 11) + 5; // 5-15
      setSoldToday(random);
      localStorage.setItem('sold_today', String(random));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Hero title={settings.hero_title} subtitle={settings.hero_subtitle} />
        
        <div className="text-center py-8 bg-card">
          <p className="text-lg text-text-secondary">
            Продано сегодня: <span className="font-bold text-accent-olive">{soldToday}</span> товаров
          </p>
        </div>

        <FeaturedProducts />
        <AboutVilavi />
      </main>

      <Footer />
      <FloatingSupport />
    </div>
  );
}
