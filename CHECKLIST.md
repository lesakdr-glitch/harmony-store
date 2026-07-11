# Чеклист готовности Harmony Store

Используйте этот чеклист для проверки полноты проекта перед запуском.

## ✅ Файлы проекта

### Конфигурация
- [x] `package.json` — зависимости
- [x] `tsconfig.json` — TypeScript конфиг
- [x] `tailwind.config.ts` — кастомные цвета и шрифты
- [x] `postcss.config.js` — PostCSS
- [x] `next.config.js` — Next.js конфиг
- [x] `.env.example` — пример переменных окружения
- [ ] `.env.local` — ваши переменные (создайте сами)

### База данных
- [x] `supabase_schema.sql` — схема таблиц
- [x] `supabase_rls.sql` — политики безопасности

### App Router (страницы)
- [x] `app/layout.tsx` — главный layout
- [x] `app/globals.css` — глобальные стили
- [x] `app/page.tsx` — главная страница
- [x] `app/catalog/page.tsx` — каталог товаров
- [x] `app/product/[slug]/page.tsx` — страница товара
- [x] `app/cart/page.tsx` — корзина
- [x] `app/checkout/page.tsx` — оформление заказа
- [x] `app/account/page.tsx` — личный кабинет
- [x] `app/track/page.tsx` — отслеживание заказов
- [x] `app/admin/page.tsx` — админ-панель
- [x] `app/login/page.tsx` — вход
- [x] `app/register/page.tsx` — регистрация
- [x] `app/privacy/page.tsx` — политика конфиденциальности
- [x] `app/terms/page.tsx` — пользовательское соглашение

### API Routes
- [x] `app/api/auth/login/route.ts` — авторизация
- [x] `app/api/auth/register/route.ts` — регистрация
- [x] `app/api/auth/logout/route.ts` — выход
- [x] `app/api/auth/session/route.ts` — получение сессии
- [x] `app/api/products/route.ts` — CRUD товаров
- [x] `app/api/products/[slug]/route.ts` — товар по slug
- [x] `app/api/categories/route.ts` — CRUD категорий
- [x] `app/api/orders/route.ts` — CRUD заказов
- [x] `app/api/cart/route.ts` — управление корзиной
- [x] `app/api/favorites/route.ts` — управление избранным
- [x] `app/api/reviews/route.ts` — CRUD отзывов
- [x] `app/api/users/route.ts` — управление пользователями
- [x] `app/api/settings/route.ts` — настройки сайта
- [x] `app/api/bot/route.ts` — Telegram webhook

### Компоненты
- [x] `components/Navbar.tsx` — навигация
- [x] `components/Footer.tsx` — подвал
- [x] `components/Hero.tsx` — главный баннер
- [x] `components/ProductCard.tsx` — карточка товара
- [x] `components/FeaturedProducts.tsx` — популярные товары
- [x] `components/AboutVilavi.tsx` — о компании
- [x] `components/Features.tsx` — преимущества
- [x] `components/Comparison.tsx` — сравнение
- [x] `components/Reviews.tsx` — отзывы
- [x] `components/FAQ.tsx` — частые вопросы
- [x] `components/FloatingSupport.tsx` — плавающая кнопка
- [x] `components/OrderForm.tsx` — форма заказа (legacy, можно удалить)

### Админка
- [x] `components/Admin/OrdersTab.tsx` — вкладка заказов
- [x] `components/Admin/ProductsTab.tsx` — вкладка товаров
- [x] `components/Admin/ProductModal.tsx` — модалка товара
- [x] `components/Admin/CategoriesTab.tsx` — вкладка категорий
- [x] `components/Admin/UsersTab.tsx` — вкладка пользователей
- [x] `components/Admin/ReviewsTab.tsx` — вкладка отзывов
- [x] `components/Admin/SettingsTab.tsx` — вкладка настроек

### Библиотеки
- [x] `lib/supabase.ts` — Supabase клиент + типы
- [x] `lib/supabase-admin.ts` — admin клиент
- [x] `lib/session.ts` — iron-session управление
- [x] `lib/auth.ts` — авторизация и хеширование
- [x] `lib/telegram.ts` — Telegram уведомления
- [x] `lib/phone.ts` — нормализация телефонов
- [x] `lib/utils.ts` — общие утилиты
- [x] `lib/validation.ts` — валидация форм

### Типы
- [x] `types/index.ts` — TypeScript типы для всех сущностей

### Документация
- [x] `README.md` — основная документация
- [x] `SETUP.md` — инструкция по настройке
- [x] `CHECKLIST.md` — этот чеклист

## ✅ Функционал

### Для гостей
- [x] Просмотр каталога
- [x] Просмотр товаров
- [x] Добавление в корзину (сессия)
- [x] Оформление заказа
- [x] Отслеживание заказов по телефону

### Для покупателей (Customer)
- [x] Регистрация и вход
- [x] Корзина (сохраняется в БД)
- [x] Личный кабинет (профиль, заказы, избранное)
- [x] Избранное
- [x] Отзывы на товары
- [x] История заказов

### Для продавцов (Seller)
- [x] Управление своими категориями
- [x] Управление своими товарами
- [x] Просмотр заказов своих товаров
- [x] Изменение статусов заказов
- [x] Добавление трек-номеров

### Для администраторов (Admin)
- [x] Полный доступ ко всем заказам
- [x] Полный доступ ко всем товарам и категориям
- [x] Управление пользователями (изменение ролей)
- [x] Модерация отзывов
- [x] Настройки сайта (Telegram, тексты, адреса)

### Telegram
- [x] Уведомления о новых заказах
- [x] Команда /start с меню
- [x] Поиск заказов по телефону
- [x] Mini App (кнопка "Каталог")
- [x] Автоматическая установка webhook

## ✅ Настройка

### Переменные окружения
- [ ] `NEXT_PUBLIC_SITE_URL` — URL сайта
- [ ] `NEXT_PUBLIC_SUPABASE_URL` — Supabase URL
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon ключ
- [ ] `SUPABASE_SERVICE_ROLE_KEY` — service role ключ
- [ ] `SESSION_SECRET` — секрет сессии (32+ символа)
- [ ] `TELEGRAM_BOT_TOKEN` — токен бота
- [ ] `TELEGRAM_CHAT_ID` — ID чата для уведомлений

### Supabase
- [ ] Проект создан
- [ ] `supabase_schema.sql` выполнен
- [ ] `supabase_rls.sql` выполнен
- [ ] 7 таблиц созданы (users, categories, products, orders, favorites, reviews, settings)
- [ ] RLS политики включены
- [ ] Первый админ создан

### Telegram
- [ ] Бот создан через @BotFather
- [ ] Токен получен
- [ ] Chat ID получен
- [ ] Команды настроены (опционально)

## ✅ Тестирование

### Базовые проверки
- [ ] Сайт открывается на localhost:3000
- [ ] Главная страница загружается
- [ ] Каталог показывает товары
- [ ] Регистрация работает
- [ ] Вход работает

### Функционал покупателя
- [ ] Добавление товара в корзину
- [ ] Изменение количества в корзине
- [ ] Удаление из корзины
- [ ] Оформление заказа
- [ ] Получение уведомления в Telegram
- [ ] Отслеживание заказа на /track
- [ ] Просмотр заказа в личном кабинете

### Функционал продавца
- [ ] Вход под продавцом
- [ ] Создание категории
- [ ] Создание товара
- [ ] Редактирование товара
- [ ] Просмотр заказа
- [ ] Изменение статуса заказа
- [ ] Добавление трек-номера

### Функционал администратора
- [ ] Вход под админом
- [ ] Просмотр всех заказов
- [ ] Управление всеми товарами
- [ ] Изменение роли пользователя
- [ ] Модерация отзывов
- [ ] Изменение настроек сайта

### Telegram бот
- [ ] /start отправляет приветствие
- [ ] Кнопка "Каталог" открывает сайт
- [ ] Поиск заказов по телефону работает
- [ ] Уведомления приходят при новом заказе

### Безопасность
- [ ] RLS блокирует доступ к чужим данным
- [ ] Продавец не видит чужие товары
- [ ] Покупатель не видит чужие заказы
- [ ] Пароли хешируются
- [ ] Сессии безопасны (httpOnly cookies)

## ✅ Production

### Перед деплоем
- [ ] `.env.local` переименован в `.env` (для локальной разработки)
- [ ] Все переменные окружения добавлены в Vercel
- [ ] `NEXT_PUBLIC_SITE_URL` изменён на production URL
- [ ] SESSION_SECRET изменён на production секрет
- [ ] RLS включен для всех таблиц

### После деплоя
- [ ] Сайт открывается по production URL
- [ ] Telegram webhook обновлён
- [ ] Тестовый заказ оформлен
- [ ] Уведомления приходят
- [ ] SSL работает (автоматически в Vercel)

### SEO и производительность
- [ ] Метатеги добавлены
- [ ] Open Graph теги добавлены
- [ ] Sitemap создан (опционально)
- [ ] Google Analytics подключён (опционально)
- [ ] Изображения оптимизированы

## 🎉 Готово!

Если все пункты отмечены — ваш магазин Harmony Store полностью готов к работе!

### Что дальше?

1. **Добавьте контент**: реальные товары, категории, изображения
2. **Настройте дизайн**: измените цвета, шрифты под бренд
3. **Подключите аналитику**: Яндекс.Метрика, Google Analytics
4. **Оптимизируйте SEO**: метатеги, структурированные данные
5. **Соберите отзывы**: попросите первых покупателей оставить отзывы
6. **Продвигайте**: социальные сети, контекстная реклама

---

**Удачи с запуском! 🚀**
