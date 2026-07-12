'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingSupport from '@/components/FloatingSupport';

export default function Privacy() {
  const [text, setText] = useState('');

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => setText(data.privacy_text || ''))
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-raleway text-3xl font-bold text-text-primary mb-8">
            Политика конфиденциальности
          </h1>

          <div className="bg-card p-8 rounded-2xl shadow-sm">
            <div className="prose prose-lg max-w-none text-text-secondary whitespace-pre-wrap">
              {text || 'Загрузка...'}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingSupport />
    </div>
  );
}
