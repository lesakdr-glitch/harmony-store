'use client';

import { useEffect, useState } from 'react';
import { Edit, Trash2, Plus, Image as ImageIcon } from 'lucide-react';
import ProductModal from './ProductModal';

export default function ProductsTab({ user }: { user: any }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories'),
      ]);
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      
      setProducts(productsData.products || []);
      setCategories(categoriesData.categories || []);
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить товар?')) return;

    try {
      const res = await fetch('/api/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setProducts(products.filter((p: any) => p.id !== id));
      } else {
        alert('Ошибка при удалении товара');
      }
    } catch (error) {
      console.error('Ошибка удаления:', error);
      alert('Ошибка при удалении товара');
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setShowModal(true);
  };

  const handleModalClose = (saved: boolean) => {
    setShowModal(false);
    setEditingProduct(null);
    if (saved) {
      loadData();
    }
  };

  if (loading) {
    return <div className="text-text-secondary">Загрузка...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Товары</h2>
        <button
          onClick={handleAdd}
          className="flex items-center space-x-2 bg-olive hover:bg-olive-dark text-white px-4 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Добавить товар</span>
        </button>
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center">
          <ImageIcon className="w-16 h-16 mx-auto mb-4 text-text-secondary" />
          <p className="text-text-secondary mb-4">Нет товаров</p>
          <button
            onClick={handleAdd}
            className="bg-olive hover:bg-olive-dark text-white px-6 py-3 rounded-xl transition-colors"
          >
            Добавить первый товар
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-cream-light">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                    Изображение
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                    Название
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                    Категория
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                    Цена
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-text-secondary">
                    Статус
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-medium text-text-secondary">
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brown/10">
                {products.map((product: any) => (
                  <tr key={product.id} className="hover:bg-cream-light/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-16 h-16 bg-cream-light rounded-lg overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary">{product.name}</div>
                      <div className="text-sm text-text-secondary">/{product.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-text-secondary">
                      {product.category?.name || 'Без категории'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-text-primary">
                        {product.price.toLocaleString('ru-RU')} ₽
                      </div>
                      {product.old_price && (
                        <div className="text-sm text-text-secondary line-through">
                          {product.old_price.toLocaleString('ru-RU')} ₽
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col space-y-1">
                        {product.active && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded w-fit">
                            Активен
                          </span>
                        )}
                        {product.is_featured && (
                          <span className="text-xs bg-olive/20 text-olive px-2 py-1 rounded w-fit">
                            Популярный
                          </span>
                        )}
                        {product.in_stock ? (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded w-fit">
                            В наличии
                          </span>
                        ) : (
                          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded w-fit">
                            Нет в наличии
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="p-2 text-text-secondary hover:text-olive transition-colors"
                          title="Редактировать"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <ProductModal
          product={editingProduct}
          categories={categories}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
}
