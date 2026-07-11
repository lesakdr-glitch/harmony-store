'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermsPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const res = await fetch('/api/settings');
      const data = await res.json();
      setContent(
        data.terms_text ||
          'Пользовательское соглашение находится в разработке. Пожалуйста, свяжитесь с нами для получения информации.'
      );
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      setContent('Ошибка загрузки пользовательского соглашения');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      <Navbar />

      <div className="flex-grow container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-text-primary mb-8">
            Пользовательское соглашение
          </h1>

          {loading ? (
            <div className="text-text-secondary">Загрузка...</div>
          ) : (
            <div className="bg-white rounded-3xl p-8 card-shadow prose prose-lg max-w-none">
              <div className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                {content}
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
