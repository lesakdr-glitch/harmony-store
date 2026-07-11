'use client';

import { Leaf, Brain, Heart, Shield } from 'lucide-react';

export default function AboutVilavi() {
  return (
    <section className="py-20 px-4 bg-cream-dark">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Изображение */}
          <div className="relative">
            <div className="bg-white rounded-3xl p-8 card-shadow">
              <div className="aspect-square bg-gradient-to-br from-cream-light to-brown/10 rounded-2xl" />
            </div>
            
            {/* Декоративные элементы */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-olive/10 rounded-full blur-xl" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-brown/10 rounded-full blur-xl" />
          </div>

          {/* Текст */}
          <div className="space-y-6">
            <div className="inline-flex items-center space-x-2 bg-white/50 px-4 py-2 rounded-full">
              <Leaf className="w-5 h-5 text-olive" />
              <span className="text-sm font-medium text-olive">О бренде Vilavi</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold font-raleway">
              Vilavi — гармония клеточного здоровья
            </h2>

            <p className="text-lg text-text-secondary">
              Наша продукция создана для поддержки митохондриального здоровья — основы энергетического 
              обмена в каждой клетке организма. Мы объединяем современную науку и силу природы, чтобы 
              предложить решения для поддержания здоровья и жизненной энергии.
            </p>

            <div className="grid grid-cols-2 gap-4 mt-8">
              {[
                {
                  icon: <Brain className="w-6 h-6 text-olive" />,
                  title: 'Научная основа',
                  description: 'Исследования митохондриального здоровья',
                },
                {
                  icon: <Heart className="w-6 h-6 text-olive" />,
                  title: 'Забота о здоровье',
                  description: 'Продукты для поддержки организма',
                },
                {
                  icon: <Shield className="w-6 h-6 text-olive" />,
                  title: 'Качество',
                  description: 'Строгий контроль производства',
                },
                {
                  icon: <Leaf className="w-6 h-6 text-olive" />,
                  title: 'Природные компоненты',
                  description: 'Натуральные ингредиенты',
                },
              ].map((item, index) => (
                <div key={index} className="bg-white p-4 rounded-xl card-shadow">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-cream-light rounded-lg flex items-center justify-center">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-brown">{item.title}</h4>
                      <p className="text-sm text-text-secondary">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-brown/10">
              <p className="text-text-secondary">
                Каждый продукт Vilavi проходит тщательный отбор компонентов и контроль качества, 
                чтобы обеспечить максимальную эффективность и безопасность для вашего здоровья.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}