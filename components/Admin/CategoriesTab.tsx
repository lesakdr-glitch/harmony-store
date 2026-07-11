'use client';

import { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, FolderOpen } from 'lucide-react';

export default function CategoriesTab({ user }: { user: any }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', slug: '', description: '', image_url: '' });
    setShowModal(true);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      image_url: category.image_url || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить категорию? Все товары в этой категории останутся без категории.')) return;

    try {
      const res = await fetch('/api/categories', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setCategories(categories.filter((c: any) => c.id !== id));
      } else {
        alert('Ошибка при удалении категории');
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка при удалении категории');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const url = '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';
      const body = editingCategory
        ? { ...formData, id: editingCategory.id }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setShowModal(false);
        loadCategories();
      } else {
        const error = await res.json();
        alert(error.error || 'Ошибка при сохранении категории');
      }
    } catch (error) {
      console.error('Ошибка сохранения:', error);
      alert('Ошибка при сохранении категории');
    }
  };

  const generateSlug = (name: string) => {
    const translitMap: { [key: string]: string } = {
      а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e',
      ж: 'zh', з: 'z', и: 'i', й: 'j', к: 'k', л: 'l', м: 'm',
      н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u',
      ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'shh', ъ: '',
      ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
    };

    return name
      .toLowerCase()
      .split('')
      .map((char) => translitMap[char] || char)
      .join('')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  if (loading) {
    return <div className="text-text-secondary">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Категории</h2>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 bg-olive hover:bg-olive-dark text-white px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить категорию</span>
        </button>
      </div>

      {categories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <FolderOpen className="w-16 h-16 mx-auto mb-4 text-text-secondary" />
          <p className="text-text-secondary mb-4">Нет категорий</p>
          <button
            onClick={handleAdd}
            className="bg-olive hover:bg-olive-dark text-white px-6 py-3 rounded-xl transition-colors"
          >
            Добавить первую категорию
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category: any) => (
            <div
              key={category.id}
              className="bg-white rounded-2xl p-6 card-shadow hover:card-shadow-hover transition-shadow"
            >
              {category.image_url && (
                <div className="w-full h-32 bg-cream-light rounded-xl mb-4 overflow-hidden">
                  <img
                    src={category.image_url}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <h3 className="font-bold text-text-primary mb-1">{category.name}</h3>
              <div className="text-sm text-text-secondary mb-2">/{category.slug}</div>
              
              {category.description && (
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                  {category.description}
                </p>
              )}

              <div className="flex space-x-2 pt-4 border-t border-brown/10">
                <button
                  onClick={() => handleEdit(category)}
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-cream-light hover:bg-cream rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Изменить</span>
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="px-4 py-2 text-text-secondary hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Модальное окно */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-text-primary mb-6">
                {editingCategory ? 'Редактировать категорию' : 'Новая категория'}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Название *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      setFormData({
                        ...formData,
                        name,
                        slug: formData.slug || generateSlug(name),
                      });
                    }}
                    className="w-full px-4 py-3 bg-cream-light rounded-xl border border-transparent focus:border-olive focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Slug (для URL) *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-cream-light rounded-xl border border-transparent focus:border-olive focus:outline-none transition-colors"
                    required
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    URL: /catalog?category={formData.slug}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Описание
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-cream-light rounded-xl border border-transparent focus:border-olive focus:outline-none transition-colors resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    URL изображения
                  </label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) =>
                      setFormData({ ...formData, image_url: e.target.value })
                    }
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-cream-light rounded-xl border border-transparent focus:border-olive focus:outline-none transition-colors"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-olive hover:bg-olive-dark text-white py-3 rounded-xl font-medium transition-colors"
                  >
                    {editingCategory ? 'Сохранить' : 'Создать'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 border border-brown/20 hover:border-brown text-text-primary py-3 rounded-xl font-medium transition-colors"
                  >
                    Отмена
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
