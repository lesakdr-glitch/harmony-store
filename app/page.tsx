import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';
import AboutVilavi from '@/components/AboutVilavi';
import Features from '@/components/Features';
import Comparison from '@/components/Comparison';
import Reviews from '@/components/Reviews';
import FAQ from '@/components/FAQ';

export default async function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero с параллаксом */}
      <Hero />
      
      {/* Популярные товары */}
      <FeaturedProducts />
      
      {/* О Vilavi */}
      <AboutVilavi />
      
      {/* Преимущества */}
      <Features />
      
      {/* Сравнение */}
      <Comparison />
      
      {/* Отзывы */}
      <Reviews />
      
      {/* FAQ */}
      <FAQ />
    </div>
  );
}