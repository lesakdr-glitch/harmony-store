'use client';

import { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';

export default function FeaturedProducts() {
  const [products, setProjects] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/api/products?featured=true&limit=6')
      .then(res => res.json())
      .then(data => setProjects(data.products || []))
      .catch(console.error);
  }, []);

  const handleQuickView = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-raleway text-3xl font-bold text-text-primary mb-8 text-center">
          Рекомендуемые товары
        </h2>

        <div className="flex overflow-x-auto space-x-6 pb-4 snap-x">
          {products.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-80 snap-start">
              <ProductCard product={product} onQuickView={handleQuickView} />
            </div>
          ))}
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
