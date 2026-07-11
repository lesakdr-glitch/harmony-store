'use client';

import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    oldPrice?: number | null;
    image: string;
    category: string;
    inStock: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const discount = product.oldPrice 
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const formatPrice = (price: number) => {
    return price.toLocaleString('ru-RU') + ' ₽';
  };

  return (
    <div
      className="group relative bg-white rounded-2xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Скидка */}
      {discount > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-olive text-white px-2 py-1 rounded-lg text-xs font-bold">
          -{discount}%
        </div>
      )}

      {/* Избранное */}
      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors hover:bg-white"
        aria-label={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
      >
        <Heart
          className={`w-4 h-4 transition-colors ${
            isFavorite ? 'fill-red-500 text-red-500' : 'text-text-secondary'
          }`}
        />
      </button>

      {/* Изображение */}
      <div className="relative aspect-square overflow-hidden bg-cream-light">
        {/* Стилизованное изображение (замените на реальное) */}
        <div 
          className="w-full h-full bg-gradient-to-br from-cream-light to-brown/20"
          style={{
            backgroundImage: `url(${product.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.5s ease',
          }}
        />
        
        {/* Наложение при наведении */}
        {isHovered && (
          <div className="absolute inset-0 bg-olive/10 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg">
              <span className="text-sm font-medium text-brown">Быстрый просмотр</span>
            </div>
          </div>
        )}
      </div>

      {/* Контент */}
      <div className="p-4">
        {/* Категория */}
        <div className="text-xs text-olive font-medium mb-2">{product.category}</div>

        {/* Название */}
        <h3 className="font-bold text-text-primary mb-2 line-clamp-2 min-h-[48px]">
          {product.name}
        </h3>

        {/* Описание */}
        <p className="text-sm text-text-secondary mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Цена */}
        <div className="flex items-baseline justify-between mb-4">
          <div className="space-y-1">
            <div className="text-xl font-bold text-brown">{formatPrice(product.price)}</div>
            {product.oldPrice && (
              <div className="text-sm text-text-secondary line-through">
                {formatPrice(product.oldPrice)}
              </div>
            )}
          </div>

          {/* Рейтинг */}
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-olive text-olive" />
            <span className="text-sm font-medium">4.8</span>
          </div>
        </div>

        {/* Кнопки */}
        <div className="flex space-x-2">
          <button
            className="flex-1 bg-olive hover:bg-olive-dark text-white py-2 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2 group/btn"
            disabled={!product.inStock}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{product.inStock ? 'В корзину' : 'Нет в наличии'}</span>
          </button>
          
          <Link
            href={`/product/${product.id}`}
            className="w-10 h-10 border border-brown/20 rounded-xl flex items-center justify-center hover:bg-cream-light transition-colors group/link"
            aria-label="Подробнее"
          >
            <div className="w-5 h-5 border-t-2 border-r-2 border-brown transform rotate-45 group-hover/link:translate-x-0.5 group-hover/link:translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}