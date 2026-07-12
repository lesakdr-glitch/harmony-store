'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { formatPrice } from '@/lib/utils';

interface ProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  if (!product) return null;

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
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="grid md:grid-cols-2 gap-8 p-6">
              {/* Изображение */}
              <div className="aspect-square rounded-xl overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Информация */}
              <div className="flex flex-col">
                <button
                  onClick={onClose}
                  className="self-end text-2xl hover:scale-110 transition-transform mb-4"
                >
                  ✕
                </button>

                <h2 className="font-raleway text-2xl font-bold text-text-primary mb-4">
                  {product.name}
                </h2>

                <div className="flex items-center space-x-4 mb-4">
                  <span className="text-2xl font-bold text-accent-olive">
                    {formatPrice(product.price)}
                  </span>
                  {product.old_price && (
                    <span className="text-lg text-text-secondary line-through">
                      {formatPrice(product.old_price)}
                    </span>
                  )}
                </div>

                <p className="text-text-secondary mb-6 flex-grow">
                  {product.description}
                </p>

                <button
                  onClick={addToCart}
                  className="w-full bg-accent-olive text-white py-4 rounded-xl font-semibold hover:bg-opacity-90 transition-colors"
                >
                  В корзину
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
