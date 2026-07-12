'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import Reviews from '@/components/Reviews';
import FloatingSupport from '@/components/FloatingSupport';
import { formatPrice, getDiscountPercent } from '@/lib/utils';

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    // Загрузка товара
    fetch(`/api/products/${slug}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        
        // Загрузка похожих товаров
        if (data.category_id) {
          fetch(`/api/products?category_id=${data.category_id}&limit=6`)
            .then(res => res.json())
            .then(data => setRelatedProducts(data.products?.filter((p: any) => p.id !== data.id) || []));
        }

        // Сохранение в недавно просмотренные
        const viewed = JSON.parse(localStorage.getItem('recently_viewed') || '[]');
        const newViewed = [data, ...viewed.filter((p: any) => p.id !== data.id)].slice(0, 6);
        localStorage.setItem('recently_viewed', JSON.stringify(newViewed));
        setRecentlyViewed(newViewed);

        // Проверка избранного
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setIsFavorite(favorites.includes(data.id));
      })
      .catch(console.error);
  }, [slug]);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image_url: product.image_url,
        quantity: 1,
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cart-updated'));
    alert('Товар добавлен в корзину');
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    
    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      favorites.push(product.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  };

  const shareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Ссылка скопирована');
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <p>Загрузка...</p>
        </main>
        <Footer />
      </div>
    );
  }

  const discount = getDiscountPercent(product.price, product.old_price || 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: 'Главная', href: '/' },
              { label: 'Каталог', href: '/catalog' },
              { label: product.category_name || 'Категория', href: `/catalog?category=${product.category_id}` },
              { label: product.name },
            ]}
          />

          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Изображение */}
            <div className="aspect-square rounded-2xl overflow-hidden bg-card shadow-sm">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Информация */}
            <div>
              {product.badge && (
                <span className="inline-block bg-accent-olive text-white px-4 py-2 rounded-full text-sm mb-4">
                  {product.badge}
                </span>
              )}

              <h1 className="font-raleway text-3xl md:text-4xl font-bold text-text-primary mb-4">
                {product.name}
              </h1>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-accent-olive">
                  {formatPrice(product.price)}
                </span>
                {product.old_price && (
                  <>
                    <span className="text-xl text-text-secondary line-through">
                      {formatPrice(product.old_price)}
                    </span>
                    {discount > 0 && (
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                        -{discount}%
                      </span>
                    )}
                  </>
                )}
              </div>

              <p className="text-text-secondary mb-8 leading-relaxed">
                {product.description}
              </p>

              <div className="flex space-x-4 mb-8">
                <button
                  onClick={addToCart}
                  className="flex-1 bg-accent-olive text-white py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-colors"
                >
                  В корзину
                </button>
                <button
                  onClick={toggleFavorite}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {isFavorite ? '❤️' : '🤍'}
                </button>
              </div>

              {/* Поделиться */}
              <div className="mb-8">
                <h3 className="font-semibold mb-4">Поделиться</h3>
                <div className="flex space-x-4">
                  <a
                    href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-blue-500 text-white hover:bg-opacity-90 transition-colors"
                  >
                    Telegram
                  </a>
                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-xl bg-green-500 text-white hover:bg-opacity-90 transition-colors"
                  >
                    WhatsApp
                  </a>
                  <button
                    onClick={shareLink}
                    className="p-3 rounded-xl bg-gray-200 dark:bg-gray-700 hover:bg-opacity-90 transition-colors"
                  >
                    📋
                  </button>
                </div>
              </div>

              {/* Где купить */}
              {(product.ozon_url || product.wb_url || product.yandex_url) && (
                <div>
                  <h3 className="font-semibold mb-4">Где купить</h3>
                  <div className="flex space-x-4">
                    {product.ozon_url && (
                      <a
                        href={product.ozon_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-opacity-90 transition-colors"
                      >
                        Ozon
                      </a>
                    )}
                    {product.wb_url && (
                      <a
                        href={product.wb_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-opacity-90 transition-colors"
                      >
                        Wildberries
                      </a>
                    )}
                    {product.yandex_url && (
                      <a
                        href={product.yandex_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-yellow-500 text-white hover:bg-opacity-90 transition-colors"
                      >
                        Яндекс Маркет
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Вкладки */}
          <div className="mb-12">
            <div className="flex space-x-8 border-b border-gray-200 dark:border-gray-700 mb-8">
              <button
                onClick={() => setActiveTab('description')}
                className={`pb-4 font-semibold transition-colors ${
                  activeTab === 'description' ? 'text-accent-olive border-b-2 border-accent-olive' : 'text-text-secondary'
                }`}
              >
                Описание
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 font-semibold transition-colors ${
                  activeTab === 'reviews' ? 'text-accent-olive border-b-2 border-accent-olive' : 'text-text-secondary'
                }`}
              >
                Отзывы
              </button>
            </div>

            {activeTab === 'description' && (
              <div className="text-text-secondary leading-relaxed">
                {product.description}
              </div>
            )}

            {activeTab === 'reviews' && (
              <Reviews productId={product.id} />
            )}
          </div>

          {/* Похожие товары */}
          {relatedProducts.length > 0 && (
            <div className="mb-12">
              <h2 className="font-raleway text-2xl font-bold text-text-primary mb-6">
                Похожие товары
              </h2>
              <div className="flex overflow-x-auto space-x-6 pb-4">
                {relatedProducts.map((p) => (
                  <div key={p.id} className="flex-shrink-0 w-80">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Недавно просмотренные */}
          {recentlyViewed.length > 1 && (
            <div>
              <h2 className="font-raleway text-2xl font-bold text-text-primary mb-6">
                Недавно просмотренные
              </h2>
              <div className="flex overflow-x-auto space-x-6 pb-4">
                {recentlyViewed.filter((p) => p.id !== product.id).map((p) => (
                  <div key={p.id} className="flex-shrink-0 w-80">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <FloatingSupport />
    </div>
  );
}
