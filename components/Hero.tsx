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
    <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
      {/* Параллакс фон */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-accent-olive/20 to-accent-brown/20"
        style={{
          y: scrollY * 0.3,
        }}
      />

      {/* Контент */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-raleway text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary mb-6"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-text-secondary mb-8"
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
            className="inline-block bg-accent-olive text-white px-8 py-4 rounded-2xl font-semibold hover:bg-opacity-90 transition-all hover:scale-105"
          >
            В каталог
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
