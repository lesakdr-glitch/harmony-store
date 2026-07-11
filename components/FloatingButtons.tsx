'use client';

import { motion } from 'framer-motion';
import { Send } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function FloatingButtons() {
  const [supportTelegram, setSupportTelegram] = useState('Smartstoretech');
  const [soldToday, setSoldToday] = useState(0);

  useEffect(() => {
    // Загружаем настройки с сервера
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.support_telegram) {
          setSupportTelegram(data.support_telegram);
        }
        if (data.sold_today) {
          setSoldToday(data.sold_today);
        }
      })
      .catch(console.error);

    // Локальный счётчик продаж (если не задан в настройках)
    const stored = localStorage.getItem('soldToday');
    const storedDate = localStorage.getItem('soldTodayDate');
    const today = new Date().toDateString();

    if (storedDate === today && stored && soldToday === 0) {
      setSoldToday(parseInt(stored));
    } else if (soldToday === 0) {
      const random = Math.floor(Math.random() * 10) + 3; // 3-12
      setSoldToday(random);
      localStorage.setItem('soldToday', random.toString());
      localStorage.setItem('soldTodayDate', today);
    }
  }, [soldToday]);

  return (
    <>
      {/* Telegram кнопка */}
      <motion.a
        href={`https://t.me/${supportTelegram}`}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-[#0088cc] hover:bg-[#0088cc]/90 rounded-full flex items-center justify-center shadow-lg"
        style={{
          animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      >
        <Send className="w-8 h-8 text-white" />
      </motion.a>

      {/* Плашка продано */}
      {soldToday > 0 && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-6 left-6 z-50 bg-white dark:bg-card border border-gray-200 dark:border-secondary/30 px-6 py-3 rounded-full shadow-lg"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">
              Продано сегодня: <span className="font-bold text-accent">{soldToday}</span>
            </span>
          </div>
        </motion.div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(0, 136, 204, 0.7);
          }
          50% {
            box-shadow: 0 0 0 15px rgba(0, 136, 204, 0);
          }
        }
      `}</style>
    </>
  );
}
