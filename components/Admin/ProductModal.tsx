'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/supabase';
import { X, Plus, Trash2 } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductModal({ product, onClose }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    old_price: 0,
    description: '',
    image_url: '',
    active: true,
  });
  const [features, setFeatures] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price,
        old_price: product.old_price,
        description: product.description,
        image_url: product.image_url,
        active: product.active,
      });
      setFeatures(product.features.length > 0 ? product.features : ['']);
    }
  }, [product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const filteredFeatures = features.filter(f => f.trim() !== '');

      const payload = {
        ...formData,
        features: filteredFeatures,
      };

      const url = '/api/products';
      const method = product ? 'PATCH' : 'POST';
      const body = product ? { id: product.id, ...payload } : payload;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onClose();
      } else {
        alert('Ошибка при сохранении товара');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Ошибка при сохранении товара');
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    setFeatures([...features, '']);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 py-8 overflow-y-auto">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      <div className="relative bg-card rounded-card-lg max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card p-6 border-b border-secondary/20 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {product ? 'Редактировать товар' : 'Добавить товар'}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center hover:bg-background rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-text mb-2 font-medium">Название</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none"
              placeholder="AirPods Pro 2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-text mb-2 font-medium">Цена (₽)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none"
                placeholder="2000"
              />
            </div>

            <div>
              <label className="block text-text mb-2 font-medium">Старая цена (₽)</label>
              <input
                type="number"
                required
                value={formData.old_price}
                onChange={(e) => setFormData({ ...formData, old_price: parseInt(e.target.value) })}
                className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none"
                placeholder="24990"
              />
            </div>
          </div>

          <div>
            <label className="block text-text mb-2 font-medium">Описание</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none min-h-[100px]"
              placeholder="Характеристики товара..."
            />
          </div>

          <div>
            <label className="block text-text mb-2 font-medium">Ссылка на изображение</label>
            <input
              type="url"
              required
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-4 py-3 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none"
              placeholder="https://example.com/image.png"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-text font-medium">Характеристики</label>
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center gap-2 px-3 py-1 bg-success/20 hover:bg-success/30 text-success rounded-lg text-sm transition-colors"
              >
                <Plus className="w-4 h-4" />
                Добавить
              </button>
            </div>

            <div className="space-y-2">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 px-4 py-2 bg-background border border-secondary/30 rounded-xl text-text focus:border-accent focus:outline-none"
                    placeholder={`Характеристика ${index + 1}`}
                  />
                  {features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="w-10 h-10 flex items-center justify-center bg-accent/20 hover:bg-accent/30 rounded-xl transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-accent" />
                    </button>
                  )}
                </div>
              ))}
            </div>
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
