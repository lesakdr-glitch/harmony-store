'use client';

import { Check, X } from 'lucide-react';

export default function Comparison() {
  const features = [
    {
      feature: 'Митохондриальная поддержка',
      vilavi: true,
      others: false,
    },
    {
      feature: 'Натуральный состав',
      vilavi: true,
      others: 'Частично',
    },
    {
      feature: 'Научно обоснованная формула',
      vilavi: true,
      others: false,
    },
    {
      feature: 'Сертификация',
      vilavi: true,
      others: true,
    },
    {
      feature: 'Возрастная категория 40+',
      vilavi: true,
      others: false,
    },
    {
      feature: 'Комплексное действие',
      vilavi: true,
      others: 'Ограниченное',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Почему Vilavi?
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Сравнение с обычными БАДами
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-cream rounded-3xl overflow-hidden card-shadow">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-olive text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-medium">Характеристика</th>
                  <th className="px-6 py-4 text-center font-medium">Vilavi</th>
                  <th className="px-6 py-4 text-center font-medium">Другие БАДы</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brown/10">
                {features.map((item, index) => (
                  <tr key={index} className="hover:bg-cream-light transition-colors">
                    <td className="px-6 py-4 text-text-primary font-medium">
                      {item.feature}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.vilavi === true ? (
                        <Check className="w-6 h-6 text-olive mx-auto" />
                      ) : (
                        <span className="text-sm text-text-secondary">{item.vilavi}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.others === true ? (
                        <Check className="w-6 h-6 text-text-secondary mx-auto" />
                      ) : item.others === false ? (
                        <X className="w-6 h-6 text-red-400 mx-auto" />
                      ) : (
                        <span className="text-sm text-text-secondary">{item.others}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="/catalog"
            className="inline-flex items-center space-x-2 bg-olive hover:bg-olive-dark text-white px-8 py-4 rounded-xl font-medium transition-colors"
          >
            <span>Перейти в каталог</span>
          </a>
        </div>
      </div>
    </section>
  );
}
