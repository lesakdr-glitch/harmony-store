# Инструкция по настройке Harmony Store

Пошаговая инструкция для запуска проекта с нуля.

## Шаг 1: Установка зависимостей

```bash
npm install
```

Будут установлены:
- Next.js 14.2.18
- React 18
- TypeScript
- Tailwind CSS
- Supabase client
- iron-session
- bcryptjs
- lucide-react (иконки)

## Шаг 2: Настройка Supabase

### 2.1 Создание проекта

1. Перейдите на [supabase.com](https://supabase.com)
2. Войдите или зарегистрируйтесь через GitHub
3. Создайте новый проект:
   - **Name**: harmony-store (или любое название)
   - **Database Password**: надёжный пароль (сохраните!)
   - **Region**: выберите ближайший регион (Europe/Frankfurt)
4. Дождитесь создания проекта (~2 минуты)

### 2.2 Получение ключей доступа

1. В боковом меню: **Settings → API**
2. Скопируйте:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** (в API Keys) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (в API Keys, нажмите "Reveal") → `SUPABASE_SERVICE_ROLE_KEY`

### 2.3 Создание таблиц

1. В боковом меню: **SQL Editor**
2. Откройте файл `supabase_schema.sql` из проекта
3. Скопируйте весь SQL код и вставьте в редактор
4. Нажмите **Run** (или F5)
5. Проверьте, что все таблицы созданы: **Table Editor** → должны быть 7 таблиц

### 2.4 Настройка RLS (Row Level Security)

1. Снова в **SQL Editor**
2. Откройте файл `supabase_rls.sql`
3. Скопируйте и выполните SQL
4. Проверьте политики: **Authentication → Policies** (должны быть созданы политики для всех таблиц)

### 2.5 Создание первого администратора (опционально)

```sql
-- Выполните в SQL Editor
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@harmony.store', '$2a$10$abcdefghijklmnopqrstuvwxyz123456', 'Администратор', 'admin');
```

**Важно**: Замените `password_hash` на реальный хеш. Или создайте админа через форму регистрации, а затем измените роль:

```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## Шаг 3: Настройка переменных окружения

### 3.1 Создание .env.local

```bash
cp .env.example .env.local
```

### 3.2 Заполнение значений

Откройте `.env.local` и заполните:

```env
# URL сайта (для локальной разработки)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase (из Шага 2.2)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Секрет для сессий (минимум 32 символа, используйте генератор)
# Генератор: https://generate-secret.vercel.app/32
SESSION_SECRET=your-super-secret-session-key-min-32-chars

# Telegram бот (из Шага 4)
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

## Шаг 4: Настройка Telegram бота

### 4.1 Создание бота

1. Откройте Telegram и найдите [@BotFather](https://t.me/botfather)
2. Отправьте команду `/newbot`
3. Введите имя бота: `Harmony Store`
4. Введите username бота: `harmony_store_bot` (должен быть уникальным)
5. Скопируйте токен → `TELEGRAM_BOT_TOKEN` в `.env.local`

### 4.2 Получение Chat ID

**Способ 1 (через бота):**
1. Найдите бота [@userinfobot](https://t.me/userinfobot)
2. Нажмите `/start`
3. Скопируйте ваш ID → `TELEGRAM_CHAT_ID`

**Способ 2 (через API):**
1. Отправьте любое сообщение вашему боту
2. Откройте в браузере:
```
https://api.telegram.org/bot<ВАШ_ТОКЕН>/getUpdates
```
3. Найдите `"chat":{"id":123456789}` → это ваш Chat ID

### 4.3 Настройка команд бота (опционально)

1. В @BotFather отправьте `/mybots`
2. Выберите вашего бота → **Edit Bot** → **Edit Commands**
3. Вставьте:
```
start - Главное меню
orders - Мои заказы
```

## Шаг 5: Запуск проекта

### 5.1 Development mode

```bash
npm run dev
```

Сайт откроется на `http://localhost:3000`

### 5.2 Первый запуск

1. Откройте `http://localhost:3000`
2. Перейдите в **Регистрация**
3. Зарегистрируйтесь (будет создан аккаунт с ролью `customer`)
4. Измените роль на `admin` в Supabase:
   - **Table Editor → users** → найдите свою запись → измените `role` на `admin`
5. Обновите страницу — теперь у вас полный доступ

## Шаг 6: Настройка через админку

### 6.1 Вход в админку

1. Войдите с аккаунтом администратора
2. Перейдите на `/admin` или нажмите кнопку "Админка" в навигации

### 6.2 Настройки сайта

Вкладка **Настройки**:
- **Telegram поддержки**: username для кнопки поддержки
- **Адрес самовывоза**: полный адрес (город, улица, дом)
- **URL QR-кода СБП**: ссылка на изображение QR для оплаты
- **Заголовок Hero**: текст главного баннера
- **О Vilavi**: текст блока "О компании"
- **Политика конфиденциальности**: текст для страницы `/privacy`
- **Пользовательское соглашение**: текст для страницы `/terms`

### 6.3 Добавление категорий

Вкладка **Категории** → **Добавить категорию**:
- **Название**: БАДы и концентраты
- **Slug**: bady-i-koncentraty (автозаполняется)
- **Описание**: Биологически активные добавки
- **URL изображения**: https://example.com/image.jpg

### 6.4 Добавление товаров

Вкладка **Товары** → **Добавить товар**:
- **Название**: Митохондриальный комплекс Vilavi
- **Slug**: mitohondrialnyj-kompleks (автозаполняется)
- **Категория**: выберите из списка
- **Описание**: полное описание товара
- **Цена**: 3500
- **Старая цена**: 4200 (опционально, для скидки)
- **URL изображения**: ссылка на фото
- **Ссылки**: Ozon, Wildberries, Яндекс Маркет (опционально)
- **Флаги**:
  - ✅ В наличии
  - ✅ Активен (виден на сайте)
  - ✅ Популярный (показывается на главной)

## Шаг 7: Тестирование

### 7.1 Тест заказа

1. Откройте сайт в режиме инкогнито (как гость)
2. Перейдите в каталог → добавьте товар в корзину
3. Оформите заказ (заполните форму с тестовым телефоном)
4. Проверьте:
   - Заказ появился в админке (Вкладка "Заказы")
   - Пришло уведомление в Telegram
5. Измените статус заказа на "Отправлен" и добавьте трек-номер
6. Проверьте отслеживание на `/track` по номеру телефона

### 7.2 Тест Telegram бота

1. Найдите вашего бота в Telegram
2. Отправьте `/start` — должно прийти приветствие с кнопками
3. Нажмите "Каталог" — откроется сайт внутри Telegram
4. Нажмите "Мои заказы" → введите номер телефона → должны показаться заказы

### 7.3 Тест ролей

**Seller:**
1. Создайте нового пользователя через регистрацию
2. В админке измените его роль на `seller`
3. Войдите под этим пользователем
4. Проверьте, что видны только свои товары/категории

**Customer:**
1. Обычная регистрация
2. Должен видеть: каталог, корзину, личный кабинет
3. Не должен видеть: админку, чужие заказы

## Шаг 8: Деплой на Vercel

### 8.1 Подготовка

1. Зарегистрируйтесь на [vercel.com](https://vercel.com)
2. Подключите GitHub репозиторий
3. Импортируйте проект

### 8.2 Настройка переменных окружения

В настройках проекта Vercel → **Environment Variables** добавьте все из `.env.local`:

```
NEXT_PUBLIC_SITE_URL=https://your-site.vercel.app
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
SESSION_SECRET=...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_CHAT_ID=...
```

### 8.3 Deploy

1. Нажмите **Deploy**
2. Дождитесь завершения (~2 минуты)
3. Откройте сайт по ссылке `https://your-project.vercel.app`

### 8.4 Обновление Telegram webhook

После деплоя обновите webhook:

```bash
curl https://api.telegram.org/bot<ВАШ_ТОКЕН>/setWebhook?url=https://your-site.vercel.app/api/bot
```

Или просто отправьте любое сообщение боту — webhook обновится автоматически.

## Шаг 9: Production настройки

### 9.1 Безопасность

- [ ] Смените SESSION_SECRET на production секрет
- [ ] Проверьте RLS политики в Supabase
- [ ] Включите SSL (Vercel делает автоматически)
- [ ] Настройте custom domain (опционально)

### 9.2 SEO

- [ ] Добавьте метатеги в `app/layout.tsx`
- [ ] Создайте `sitemap.xml`
- [ ] Настройте Яндекс.Метрику или Google Analytics
- [ ] Добавьте Open Graph теги для соцсетей

### 9.3 Производительность

- [ ] Оптимизируйте изображения (используйте next/image)
- [ ] Включите кеширование в Vercel
- [ ] Настройте CDN для статики

## Troubleshooting

### Ошибка подключения к Supabase

**Проблема**: `Error: Invalid Supabase URL`

**Решение**:
1. Проверьте формат URL: должен быть `https://xxx.supabase.co`
2. Убедитесь, что проект Supabase активен
3. Проверьте, что ключи правильно скопированы

### Telegram бот не отвечает

**Проблема**: Бот не реагирует на команды

**Решение**:
1. Проверьте токен: `https://api.telegram.org/bot<ТОКЕН>/getMe`
2. Проверьте webhook: `https://api.telegram.org/bot<ТОКЕН>/getWebhookInfo`
3. Убедитесь, что сайт доступен по HTTPS (для webhook)
4. Проверьте логи в Vercel

### Ошибка сессии

**Проблема**: `Error: Session secret must be at least 32 characters`

**Решение**:
Используйте генератор для SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### RLS блокирует запросы

**Проблема**: `403 Forbidden` или `Row level security policy`

**Решение**:
1. Проверьте, что все политики из `supabase_rls.sql` выполнены
2. В Supabase Studio: **Authentication → Policies** → убедитесь, что политики включены
3. Для тестирования временно отключите RLS:
```sql
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
```
(Не забудьте включить обратно перед production!)

## Контакты

При возникновении проблем:
- GitHub Issues: [создайте issue](https://github.com/your-repo/issues)
- Telegram: [@your_support](https://t.me/your_support)

---

**Готово!** Теперь ваш магазин Harmony Store полностью настроен и готов к использованию.
