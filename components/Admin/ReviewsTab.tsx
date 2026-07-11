'use client';

import { useEffect, useState } from 'react';
import { Review } from '@/lib/supabase';
import { Star, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

export default function ReviewsTab({ user }: { user?: any }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews', { credentials: 'include' });
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, active: !currentActive }),
      });
      fetchReviews();
    } catch (error) {
      console.error('Error toggling review:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить этот отзыв?')) return;

    try {
      await fetch(`/api/reviews?id=${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleEdit = (review: Review) => {
    setEditingReview(review);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingReview(null);
    setShowModal(true);
  };

  if (loading) {
    return <div className="text-center py-8 text-secondary">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Отзывы</h2>
        <button
          onClick={handleAddNew}
          className="px-6 py-3 bg-accent hover:bg-accent/90 text-white font-medium rounded-lg transition-colors"
        >
          Добавить отзыв
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-card rounded-card p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={review.avatar_url}
                alt={review.name}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <div className="font-semibold text-text">{review.name}</div>
                <div className="text-sm text-secondary">{review.city}</div>
              </div>
            </div>

            <div className="flex gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating
                      ? 'fill-accent text-accent'
                      : 'text-secondary'
                  }`}
                />
              ))}
            </div>

            <p className="text-secondary text-sm mb-4 line-clamp-3">{review.text}</p>

            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${review.active ? 'bg-success' : 'bg-secondary'}`} />
              <span className="text-sm text-secondary">
                {review.active ? 'Активен' : 'Скрыт'}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(review)}
                className="flex-1 py-2 bg-background hover:bg-accent/20 text-text rounded-lg transition-colors text-sm flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Редактировать
              </button>
              <button
                onClick={() => handleToggleActive(review.id, review.active)}
                className="px-4 py-2 bg-background hover:bg-success/20 text-text rounded-lg transition-colors text-sm"
              >
                {review.active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleDelete(review.id)}
                className="px-4 py-2 bg-background hover:bg-accent text-text rounded-lg transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <ReviewModal
          review={editingReview}
          onClose={() => {
            setShowModal(false);
            setEditingReview(null);
            fetchReviews();
          }}
        />
      )}
    </div>
  );
}

function ReviewModal({ review, onClose }: { review: Review | null; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: review?.name || '',
    city: review?.city || '',
    text: review?.text || '',
    rating: review?.rating || 5,
    avatar_url: review?.avatar_url || '',
    active: review?.active ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = '/api/reviews';
      const method = review ? 'PATCH' : 'POST';
      const body = review ? { id: review.id, ...formData } : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onClose();
      } else {
        alert('Ошибка при сохранении отзыва');
      }
    } catch (error) {
      console.error('Error saving review:', error);
      alert('Ошибка при сохранении отзыва');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div className="relative bg-card rounded-card-lg max-w-2xl w-full p-8">
        <h2 className="text-2xl font-bold mb-6">
          {review ? 'Редактировать отзыв' : 'Добавить отзыв'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text mb-2 font-medium">Имя</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-text mb-2 font-medium">Город</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-text mb-2 font-medium">Текст отзыва</label>
            <textarea
              required
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none min-h-[100px]"
            />
          </div>

          <div>
            <label className="block text-text mb-2 font-medium">Рейтинг (1-5)</label>
            <input
              type="number"
              min="1"
              max="5"
              required
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-text mb-2 font-medium">Аватарка (URL)</label>
            <input
              type="url"
              required
              value={formData.avatar_url}
              onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
              className="w-full px-4 py-2 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none"
              placeholder="https://i.pravatar.cc/150?img=12"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="active"
              checked={formData.active}
              onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              className="w-5 h-5 accent-accent"
            />
            <label htmlFor="active" className="text-text font-medium">
              Показывать на сайте
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-background hover:bg-secondary/20 text-text font-medium rounded-full transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-accent hover:bg-accent/90 text-white font-semibold rounded-full transition-colors disabled:opacity-50"
            >
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
