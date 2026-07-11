'use client';

import { Zap, Shield, Leaf, Heart } from 'lucide-react';

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Энергия клеток',
      description:
        'Поддержка митохондриальной функции для повышения общего тонуса и жизненной энергии',
    },
    {
      icon: Shield,
      title: 'Научная база',
      description:
        'Формулы основаны на последних исследованиях в области митохондриального здоровья',
    },
    {
      icon: Leaf,
      title: 'Натуральный состав',
      description:
        'Только природные компоненты высокого качества без искусственных добавок',
    },
    {
      icon: Heart,
      title: 'Комплексная забота',
      description:
        'БАДы, концентраты, масла и витаминные комплексы для полноценной поддержки здоровья',
    },
  ];

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Преимущества Vilavi
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Научно обоснованный подход к митохондриальному здоровью
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 card-shadow hover:card-shadow-hover transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-olive/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-olive group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-7 h-7 text-olive group-hover:text-white transition-colors" />
                </div>
                
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {feature.title}
                </h3>
                
                <p className="text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
