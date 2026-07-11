'use client';

import { useState, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Filter, SortAsc } from 'lucide-react';

export default function CatalogPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('default');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [selectedCategory, sortBy]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Загрузка категорий
      const categoriesRes = await fetch('/api/categories');
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData);

      // Загрузка товаров
      let url = '/api/products?';
      if (selectedCategory) url += `category_id=${selectedCategory}&`;
      if (sortBy !== 'default') url += `sort=${sortBy}`;

      const productsRes = await fetch(url);
      const productsData = await productsRes.json();
      setProducts(productsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold font-raleway mb-4">Каталог продукции Vilavi</h1>
        <p className="text-text-secondary text-lg">
          Широкий выбор продуктов для митохондриального здоровья
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Боковая панель фильтров */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl p-6 card-shadow sticky top-24">
            <div className="flex items-center space-x-2 mb-4">
              <Filter className="w-5 h-5 text-brown" />
              <h3 className="font-bold text-lg">Фильтры</h3>
            </div>

            {/* Категории */}
            <div className="mb-6">
              <h4 className="font-medium mb-3 text-sm text-text-secondary uppercase">Категории</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                    selectedCategory === null
                      ? 'bg-olive text-white'
                      : 'hover:bg-cream-light'
                  }`}
                >
                  Все товары
                </button>
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-olive text-white'
                        : 'hover:bg-cream-light'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Сортировка */}
            <div>
              <h4 className="font-medium mb-3 text-sm text-text-secondary uppercase flex items-center space-x-2">
                <SortAsc className="w-4 h-4" />
                <span>Сортировка</span>
              </h4>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 bg-cream-light border border-brown/20 rounded-lg focus:outline-none focus:border-brown"
              >
                <option value="default">По умолчанию</option>
                <option value="price_asc">Цена: по возрастанию</option>
                <option value="price_desc">Цена: по убыванию</option>
                <option value="newest">Новинки</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Сетка товаров */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 card-shadow animate-pulse">
                  <div className="aspect-square bg-cream-light rounded-xl mb-4" />
                  <div className="h-4 bg-cream-light rounded mb-2" />
                  <div className="h-4 bg-cream-light rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-cream-light rounded-full flex items-center justify-center">
                <Filter className="w-16 h-16 text-brown/30" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Товары не найдены</h3>
              <p className="text-text-secondary">
                Попробуйте изменить фильтры или сбросить их
              </p>
              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSortBy('default');
                }}
                className="mt-6 btn-primary"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 text-text-secondary">
                Найдено товаров: {products.length}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      description: product.description || '',
                      price: product.price,
                      oldPrice: product.old_price,
                      image: product.image_url,
                      category: product.category?.name || 'Без категории',
                      inStock: product.in_stock,
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}