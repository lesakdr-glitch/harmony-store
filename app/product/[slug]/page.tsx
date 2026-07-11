'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Heart, ShoppingBag, Star, ExternalLink, Share2, Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  old_price: number | null;
  image_url: string;
  ozon_url: string | null;
  wb_url: string | null;
  yandex_url: string | null;
  in_stock: boolean;
  category: {
    name: string;
    slug: string;
  };
}

export default function ProductPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error('Товар не найден');
        const data = await res.json();
        setProduct(data.product);
        setSimilarProducts(data.similar || []);
      } catch (error) {
        console.error('Ошибка загрузки товара:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  const addToCart = async () => {
    if (!product) return;
    
    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          name: product.name,
          price: product.price,
          quantity,
          image_url: product.image_url,
        }),
      });

      if (res.ok) {
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
      }
    } catch (error) {
      console.error('Ошибка добавления в корзину:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!product) return;
    
    try {
      const res = await fetch('/api/favorites', {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id }),
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
      }
    } catch (error) {
      console.error('Ошибка работы с избранным:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <div className="text-text-secondary">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-cream">
        <Navbar />
        <div className="container mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Товар не найден</h1>
          <a href="/catalog" className="text-olive hover:underline">
            Вернуться в каталог
          </a>
        </div>
      </div>
    );
  }

  const discount = product.old_price 
    ? Math.round(((product.old_price - product.price) / product.old_price) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-cream">
      <Navbar />

      {/* Хлебные крошки */}
      <div className="container mx-auto px-4 py-6 mt-20">
        <div className="flex items-center space-x-2 text-sm text-text-secondary">
          <a href="/" className="hover:text-olive transition-colors">Главная</a>
          <span>/</span>
          <a href="/catalog" className="hover:text-olive transition-colors">Каталог</a>
          <span>/</span>
          <a href={`/catalog?category=${product.category.slug}`} className="hover:text-olive transition-colors">
            {product.category.name}
          </a>
          <span>/</span>
          <span className="text-text-primary">{product.name}</span>
        </div>
      </div>

      {/* Основной контент */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Изображение */}
          <div className="relative">
            {discount > 0 && (
              <div className="absolute top-4 left-4 z-10 bg-olive text-white px-3 py-1.5 rounded-xl text-sm font-bold">
                -{discount}%
              </div>
            )}
            
            <div className="aspect-square bg-white rounded-3xl overflow-hidden card-shadow">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Информация */}
          <div className="space-y-6">
            {/* Категория */}
            <div className="text-sm text-olive font-medium">{product.category.name}</div>

            {/* Название */}
            <h1 className="text-4xl font-bold text-text-primary leading-tight">
              {product.name}
            </h1>

            {/* Рейтинг */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 fill-olive text-olive" />
                ))}
              </div>
              <span className="text-text-secondary">4.8 (47 отзывов)</span>
            </div>

            {/* Цена */}
            <div className="flex items-baseline space-x-4">
              <div className="text-4xl font-bold text-brown">
                {product.price.toLocaleString('ru-RU')} ₽
              </div>
              {product.old_price && (
                <div className="text-xl text-text-secondary line-through">
                  {product.old_price.toLocaleString('ru-RU')} ₽
                </div>
              )}
            </div>

            {/* Описание */}
            <p className="text-lg text-text-secondary leading-relaxed">
              {product.description}
            </p>

            {/* Количество */}
            <div className="flex items-center space-x-4">
              <span className="text-text-secondary">Количество:</span>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-white rounded-xl border border-brown/20 hover:border-olive transition-colors flex items-center justify-center"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-white rounded-xl border border-brown/20 hover:border-olive transition-colors flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex space-x-4">
              <button
                onClick={addToCart}
                disabled={!product.in_stock || addedToCart}
                className="flex-1 bg-olive hover:bg-olive-dark text-white py-4 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Добавлено</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>{product.in_stock ? 'В корзину' : 'Нет в наличии'}</span>
                  </>
                )}
              </button>

              <button
                onClick={toggleFavorite}
                className={`w-14 h-14 rounded-xl border transition-colors flex items-center justify-center ${
                  isFavorite
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-brown/20 hover:border-olive'
                }`}
                aria-label="Избранное"
              >
                <Heart
                  className={`w-5 h-5 transition-colors ${
                    isFavorite ? 'fill-red-500 text-red-500' : 'text-text-secondary'
                  }`}
                />
              </button>

              <button
                className="w-14 h-14 bg-white rounded-xl border border-brown/20 hover:border-olive transition-colors flex items-center justify-center"
                aria-label="Поделиться"
              >
                <Share2 className="w-5 h-5 text-text-secondary" />
              </button>
            </div>

            {/* Где купить */}
            {(product.ozon_url || product.wb_url || product.yandex_url) && (
              <div className="bg-white p-6 rounded-2xl space-y-4">
                <h3 className="font-bold text-text-primary">Где купить:</h3>
                <div className="flex flex-wrap gap-3">
                  {product.ozon_url && (
                    <a
                      href={product.ozon_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[120px] px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Ozon</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {product.wb_url && (
                    <a
                      href={product.wb_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[120px] px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Wildberries</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {product.yandex_url && (
                    <a
                      href={product.yandex_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[120px] px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Яндекс Маркет</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Похожие товары */}
        {similarProducts.length > 0 && (
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-text-primary mb-8">Похожие товары</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.slice(0, 4).map((product: any) => (
                <ProductCard
                  key={product.id}
                  product={{
                    id: product.id,
                    name: product.name,
                    description: product.description || '',
                    price: product.price,
                    oldPrice: product.old_price,
                    image: product.image_url,
                    category: product.category?.name || 'Товары',
                    inStock: product.in_stock,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
