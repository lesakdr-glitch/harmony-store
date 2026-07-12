import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-card border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* О компании */}
          <div>
            <h3 className="font-raleway text-xl font-bold text-accent-brown mb-4">
              Harmony Store
            </h3>
            <p className="text-text-secondary text-sm">
              Продукция Vilavi для митохондриального здоровья
            </p>
          </div>

          {/* Навигация */}
          <div>
            <h4 className="font-semibold mb-4">Навигация</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <Link href="/catalog" className="hover:text-accent-olive transition-colors">
                  Каталог
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-accent-olive transition-colors">
                  Отследить заказ
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-accent-olive transition-colors">
                  Личный кабинет
                </Link>
              </li>
            </ul>
          </div>

          {/* Информация */}
          <div>
            <h4 className="font-semibold mb-4">Информация</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <Link href="/privacy" className="hover:text-accent-olive transition-colors">
                  Политика конфиденциальности
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-accent-olive transition-colors">
                  Условия использования
                </Link>
              </li>
            </ul>
          </div>

          {/* Контакты */}
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>📧 support@harmonystore.ru</li>
              <li>📱 +7 (999) 123-45-67</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-text-secondary">
          © {new Date().getFullYear()} Harmony Store. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
