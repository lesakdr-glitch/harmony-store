'use client';

import { useEffect, useState } from 'react';

export default function FloatingSupport() {
  const [supportTelegram, setSupportTelegram] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setSupportTelegram(data.support_telegram || ''))
      .catch(console.error);
  }, []);

  return (
    <a
      href={supportTelegram || 'https://t.me/harmonystore'}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-accent-olive text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40"
      aria-label="Поддержка"
    >
      💬
    </a>
  );
}
