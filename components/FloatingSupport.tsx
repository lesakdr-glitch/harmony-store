'use client';

import { useEffect, useState } from 'react';

export default function FloatingSupport() {
  const [telegramHandle, setTelegramHandle] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        const handle = data.support_telegram?.trim();
        setTelegramHandle(handle || null);
      })
      .catch(() => {});
  }, []);

  if (!telegramHandle) return null;

  return (
    <a
      href={`https://t.me/${telegramHandle}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-accent-olive text-white p-4 rounded-full shadow-lg hover:scale-110 transition-transform z-40 flex items-center justify-center"
      aria-label="Поддержка в Telegram"
      title="Написать в поддержку"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
      </svg>
    </a>
  );
}
