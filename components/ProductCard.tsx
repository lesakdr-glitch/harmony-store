'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { formatPrice, getDiscountPercent } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    old_price?: number;
    image_url: string;
    badge?: string;
    rating?: number;
  };
  onQuickView?: (product: any) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const discount = getDiscountPercent(product.price, product.old_price || 0);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    
    // Сохранение в localStorage
    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== product.id);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
    } else {
      favorites.push(product.id);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  };

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    
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
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-card rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden"
    >
      <Link href={`/product/${product.slug}`}>
        {/* Изображение */}
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
          
          {/* Бейдж */}
          {product.badge && (
            <span className="absolute top-4 left-4 bg-accent-olive text-white px-3 py-1 rounded-full text-sm">
              {product.badge}
            </span>
          )}

          {/* Скидка */}
          {discount > 0 && (
            <span className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm">
              -{discount}%
            </span>
          )}

          {/* Кнопки */}
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button
              onClick={toggleFavorite}
              className="bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
            {onQuickView && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onQuickView(product);
                }}
                className="bg-white p-2 rounded-full shadow-md hover:scale-110 transition-transform"
              >
                👁️
              </button>
            )}
          </div>
        </div>

        {/* Информация */}
        <div className="p-4">
          <h3 className="font-semibold text-text-primary mb-2 line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-accent-olive">
                {formatPrice(product.price)}
              </span>
              {product.old_price && (
                <span className="text-sm text-text-secondary line-through">
                  {formatPrice(product.old_price)}
                </span>
              )}
            </div>

            <button
              onClick={addToCart}
              className="bg-accent-olive text-white px-4 py-2 rounded-xl hover:bg-opacity-90 transition-colors text-sm"
            >
              В корзину
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
