'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductModal from '@/components/ProductModal';
import SearchBar from '@/components/SearchBar';
import PriceFilter from '@/components/PriceFilter';
import FloatingSupport from '@/components/FloatingSupport';

export default function Catalog() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sort, setSort] = useState('newest');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(Infinity);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Загрузка категорий
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data.categories || []))
      .catch(console.error);

    loadProducts();
  }, [selectedCategory, searchQuery, sort, minPrice, maxPrice]);

  useEffect(() => {
    if (loading) return;

    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prev => prev + 1);
      }
    });

    if (lastElementRef.current) {
      observerRef.current.observe(lastElementRef.current);
    }

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [loading, hasMore]);

  const loadProducts = async () => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(page),
      limit: '12',
      sort,
    });

    if (selectedCategory) params.append('category_id', selectedCategory);
    if (searchQuery) params.append('search', searchQuery);
    if (minPrice > 0) params.append('min_price', String(minPrice));
    if (maxPrice < Infinity) params.append('max_price', String(maxPrice));

    const response = await fetch(`/api/products?${params}`);
    const data = await response.json();

    if (page === 1) {
      setProducts(data.products || []);
    } else {
      setProducts(prev => [...prev, ...(data.products || [])]);
    }

    setHasMore((data.products || []).length === 12);
    setLoading(false);
  };

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-raleway text-3xl font-bold text-text-primary mb-8">
            Каталог
          </h1>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Фильтры (слева на десктопе) */}
            <aside className="lg:w-64 space-y-6">
              <SearchBar onSearch={setSearchQuery} />
              
              <div>
                <h3 className="font-semibold mb-4">Категории</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      !selectedCategory ? 'bg-accent-olive text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    Все категории
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === cat.id ? 'bg-accent-olive text-white' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <PriceFilter onFilter={(min, max) => { setMinPrice(min); setMaxPrice(max); setPage(1); }} />

              <div>
                <h3 className="font-semibold mb-4">Сортировка</h3>
                <select
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-olive"
                >
                  <option value="newest">По новизне</option>
                  <option value="price_asc">Цена по возрастанию</option>
                  <option value="price_desc">Цена по убыванию</option>
                  <option value="popular">По популярности</option>
                </select>
              </div>
            </aside>

            {/* Сетка товаров */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    ref={index === products.length - 1 ? lastElementRef : null}
                  >
                    <ProductCard product={product} onQuickView={handleQuickView} />
                  </div>
                ))}
              </div>

              {loading && (
                <div className="text-center py-8">
                  <p className="text-text-secondary">Загрузка...</p>
                </div>
              )}

              {!hasMore && products.length > 0 && (
                <div className="text-center py-8">
                  <p className="text-text-secondary">Все товары загружены</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <FloatingSupport />

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
