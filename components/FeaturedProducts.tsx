'use client';

import { useState } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const featuredProducts = [
  {
    id: '1',
    name: 'Митохондриальный комплекс Premium',
    description: 'Усиленная формула для поддержки клеточного здоровья',
    price: 3500,
    oldPrice: 4200,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Комплексы',
    inStock: true,
  },
  {
    id: '2',
    name: 'Концентрат антиоксидантов',
    description: 'Защита от окислительного стресса',
    price: 2800,
    oldPrice: 3200,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Концентраты',
    inStock: true,
  },
  {
    id: '3',
    name: 'Витаминный комплекс для энергии',
    description: 'Поддержка энергетического обмена',
    price: 4200,
    oldPrice: 4900,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Витамины',
    inStock: true,
  },
  {
    id: '4',
    name: 'Масло для массажа с CBD',
    description: 'Расслабление и восстановление мышц',
    price: 1800,
    oldPrice: 2200,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Масла',
    inStock: true,
  },
  {
    id: '5',
    name: 'Клетчатка с пребиотиками',
    description: 'Поддержка пищеварения и микробиома',
    price: 2400,
    oldPrice: null,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Пищевые добавки',
    inStock: true,
  },
  {
    id: '6',
    name: 'Смузи для иммунитета',
    description: 'Укрепление защитных функций организма',
    price: 3200,
    oldPrice: 3800,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'Смузи',
    inStock: true,
  },
];

export default function FeaturedProducts() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = typeof window !== 'undefined' 
    ? window.innerWidth >= 1280 ? 4 
    : window.innerWidth >= 768 ? 3 
    : 1 
    : 1;

  const handleNext = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView < featuredProducts.length ? prev + 1 : 0
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => 
      prev > 0 ? prev - 1 : featuredProducts.length - itemsPerView
    );
  };

  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold font-raleway">
              Популярные товары
            </h2>
            <p className="text-text-secondary mt-2">
              Самые востребованные продукты Vilavi
            </p>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 bg-white border border-brown/20 rounded-full flex items-center justify-center hover:bg-cream-light transition-colors"
              aria-label="Предыдущие товары"
            >
              <ChevronLeft className="w-5 h-5 text-brown" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 bg-white border border-brown/20 rounded-full flex items-center justify-center hover:bg-cream-light transition-colors"
              aria-label="Следующие товары"
            >
              <ChevronRight className="w-5 h-5 text-brown" />
            </button>
          </div>
        </div>

        {/* Горизонтальный скролл на мобильных */}
        <div className="lg:hidden overflow-x-auto pb-4">
          <div className="flex space-x-4 min-w-max">
            {featuredProducts.map((product) => (
              <div key={product.id} className="w-64 flex-shrink-0">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        {/* Сетка на десктопе */}
        <div className="hidden lg:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Индикаторы */}
        <div className="flex justify-center space-x-2 mt-8 lg:hidden">
          {Array.from({ length: Math.ceil(featuredProducts.length / itemsPerView) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * itemsPerView)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentIndex >= index * itemsPerView && currentIndex < (index + 1) * itemsPerView
                  ? 'bg-olive'
                  : 'bg-brown/30'
              }`}
              aria-label={`Перейти к слайду ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}