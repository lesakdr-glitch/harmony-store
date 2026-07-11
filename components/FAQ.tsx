'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: 'Что такое митохондриальное здоровье?',
      answer:
        'Митохондрии — это "энергетические станции" клеток. Митохондриальное здоровье означает, что клетки эффективно производят энергию, что важно для общего самочувствия, работы органов и замедления процессов старения.',
    },
    {
      question: 'Для кого предназначена продукция Vilavi?',
      answer:
        'Продукция Vilavi особенно рекомендуется людям старше 40 лет, когда естественная функция митохондрий начинает снижаться. Также подходит всем, кто заботится о профилактике возрастных изменений и поддержании энергии.',
    },
    {
      question: 'Как принимать БАДы Vilavi?',
      answer:
        'Рекомендации по приёму указаны на упаковке каждого продукта. Обычно курс составляет 1-3 месяца. Для получения индивидуальных рекомендаций проконсультируйтесь с нашим специалистом.',
    },
    {
      question: 'Есть ли противопоказания?',
      answer:
        'Продукция Vilavi изготовлена из натуральных компонентов, но перед применением рекомендуем проконсультироваться с врачом, особенно если у вас есть хронические заболевания или аллергия.',
    },
    {
      question: 'Какие способы доставки доступны?',
      answer:
        'Мы осуществляем доставку через СДЭК (3-7 дней) по всей России. Также доступен самовывоз из Новороссийска. Стоимость доставки рассчитывается при оформлении заказа.',
    },
    {
      question: 'Как оплатить заказ?',
      answer:
        'Вы можете оплатить заказ онлайн через СБП (Систему Быстрых Платежей) по QR-коду или наложенным платежом при получении.',
    },
    {
      question: 'Можно ли вернуть товар?',
      answer:
        'Да, возврат возможен в течение 14 дней с момента получения, если товар не был вскрыт и сохранён товарный вид. Подробности в разделе "Возврат и обмен".',
    },
    {
      question: 'Где можно купить продукцию Vilavi?',
      answer:
        'Вы можете купить на нашем сайте или на маркетплейсах: Ozon, Wildberries, Яндекс Маркет. Ссылки указаны на странице каждого товара.',
    },
  ];

  return (
    <section className="py-20 bg-cream">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-text-primary mb-4">
            Частые вопросы
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Ответы на популярные вопросы о продукции Vilavi
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl card-shadow overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-cream-light transition-colors"
              >
                <span className="font-medium text-text-primary pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-text-secondary flex-shrink-0 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-text-secondary leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-text-secondary mb-4">Не нашли ответ на свой вопрос?</p>
          <a
            href="https://t.me/HarmonySupport"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 border-2 border-olive text-olive hover:bg-olive hover:text-white px-8 py-3 rounded-xl font-medium transition-colors"
          >
            <span>Напишите нам</span>
          </a>
        </div>
      </div>
    </section>
  );
}
