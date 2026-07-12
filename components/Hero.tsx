'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface HeroProps {
  title: string;
  subtitle: string;
}

export default function Hero({ title, subtitle }: HeroProps) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
      {/* Градиентный фон */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5E6D3] via-[#FAF7F2] to-[#E8D5C4]" />
      
      {/* Параллакс эффект */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-accent-olive/10 to-accent-brown/10"
        style={{
          y: scrollY * 0.3,
        }}
      />

      {/* Контент */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto py-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-raleway text-5xl md:text-6xl lg:text-[48px] font-bold text-text-primary mb-8 leading-tight"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl md:text-2xl text-text-secondary mb-12 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Link
            href="/catalog"
            className="inline-block bg-accent-olive text-white px-10 py-4 rounded-[30px] font-semibold hover:bg-opacity-90 transition-all hover:scale-105 shadow-lg hover:shadow-xl"
          >
            В каталог
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
