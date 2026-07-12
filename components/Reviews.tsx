'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ReviewsProps {
  productId: string;
}

export default function Reviews({ productId }: ReviewsProps) {
  const [reviews, setReviews] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    author_name: '',
    author_city: '',
    text: '',
    stars: 5,
  });

  useEffect(() => {
    fetch(`/api/reviews?product_id=${productId}`)
      .then(res => res.json())
      .then(data => setReviews(data.reviews || []))
      .catch(console.error);
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        product_id: productId,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setReviews([...reviews, data.review]);
      setShowForm(false);
      setFormData({ author_name: '', author_city: '', text: '', stars: 5 });
    }
  };

  return (
    <div className="mt-12">
      <h3 className="font-raleway text-2xl font-bold text-text-primary mb-6">
        Отзывы ({reviews.length})
      </h3>

      <div className="space-y-6 mb-8">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-6 rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-semibold">{review.author_name}</h4>
                <p className="text-sm text-text-secondary">{review.author_city}</p>
              </div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < review.stars ? '⭐' : '☆'}>
                    {i < review.stars ? '⭐' : '☆'}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-text-secondary">{review.text}</p>
          </motion.div>
        ))}
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="bg-accent-olive text-white px-6 py-3 rounded-xl hover:bg-opacity-90 transition-colors"
        >
          Оставить отзыв
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-card p-6 rounded-2xl shadow-sm space-y-4">
          <input
            type="text"
            value={formData.author_name}
            onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
            placeholder="Ваше имя"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
          />
          <input
            type="text"
            value={formData.author_city}
            onChange={(e) => setFormData({ ...formData, author_city: e.target.value })}
            placeholder="Ваш город"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
          />
          <textarea
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            placeholder="Ваш отзыв"
            required
            rows={4}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
          />
          <div className="flex items-center space-x-2">
            <span>Оценка:</span>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, stars: star })}
                className={`text-2xl ${star <= formData.stars ? 'text-yellow-400' : 'text-gray-300'}`}
              >
                ⭐
              </button>
            ))}
          </div>
          <div className="flex space-x-4">
            <button
              type="submit"
              className="bg-accent-olive text-white px-6 py-3 rounded-xl hover:bg-opacity-90 transition-colors"
            >
              Отправить
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
