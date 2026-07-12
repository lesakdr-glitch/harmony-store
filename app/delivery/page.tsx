'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingSupport from '@/components/FloatingSupport';

export default function Delivery() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setText(data.delivery_text || ''))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#FAF7F2' }}>
      <Navbar />
      <main className="flex-grow py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-raleway text-5xl font-bold text-accent-brown mb-10">Доставка и оплата</h1>
          <div className="bg-white rounded-3xl shadow-sm p-10">
            {loading ? (
              <p className="text-text-secondary text-lg">Загрузка...</p>
            ) : (
              <p className="text-text-secondary text-lg leading-relaxed whitespace-pre-wrap font-inter">
                {text || 'Скоро появится'}
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <FloatingSupport />
    </div>
  );
}
