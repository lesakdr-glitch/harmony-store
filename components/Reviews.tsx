'use client';

import { useEffect, useState } from 'react';
import { Star, Quote } from 'lucide-react';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      setReviews(data.reviews?.slice(0, 6) || []);
    } catch (error) {
      console.error('Ошибка загрузки отзывов:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return null;
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Отзывы покупателей
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Что говорят наши клиенты о продукции Vilavi
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review: any) => (
            <div
              key={review.id}
              className="bg-cream rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-olive/20 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-olive">
                      {review.user?.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-text-primary">
                      {review.user?.name || 'Покупатель'}
                    </div>
                    <div className="text-sm text-text-secondary">
                      {new Date(review.created_at).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                </div>
                
                <Quote className="w-6 h-6 text-olive/30" />
              </div>

              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= review.stars
                        ? 'fill-olive text-olive'
                        : 'text-brown/20'
                    }`}
                  />
                ))}
              </div>

              <p className="text-text-secondary leading-relaxed">{review.text}</p>

              {review.product && (
                <div className="mt-4 pt-4 border-t border-brown/10">
                  <div className="text-sm text-text-secondary">
                    Товар: <span className="font-medium">{review.product.name}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
