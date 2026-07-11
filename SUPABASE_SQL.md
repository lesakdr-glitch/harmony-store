# SQL для создания таблиц в Supabase

Выполните эти запросы в **SQL Editor** на Supabase:

## 1. Таблица товаров

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  old_price INTEGER NOT NULL,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  image_url TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  badge_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 2. Таблица заказов

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT NOT NULL,
  delivery TEXT NOT NULL,
  product_name TEXT NOT NULL,
  price INTEGER NOT NULL,
  status TEXT DEFAULT 'Новый',
  track_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 3. Таблица настроек

```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_number TEXT,
  telegram_chat_id TEXT,
  telegram_bot_token TEXT,
  sold_today INTEGER DEFAULT 0,
  pickup_address TEXT,
  hero_badge_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 4. Таблица отзывов

```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  avatar_url TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 5. Добавить тестовый товар

```sql
INSERT INTO products (name, price, old_price, description, features, image_url, active, badge_text)
VALUES (
  'AirPods Pro 2',
  2000,
  24990,
  'Полная копия оригинала с шумоподавлением',
  '["Активное шумоподавление", "Прозрачный режим", "Подключение по имени", "Определяется iOS", "Серийный номер", "Отображение заряда"]',
  'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361',
  true,
  'Premium Quality'
);
```

## 6. Добавить тестовые отзывы

```sql
INSERT INTO reviews (name, city, text, rating, avatar_url, active)
VALUES
  ('Алексей', 'Москва', 'Заказал неделю назад, пришли быстро. Подключились к iPhone без проблем, все функции работают. Даже в настройках показывается как оригинал. За эти деньги — огонь!', 5, 'https://i.pravatar.cc/150?img=12', true),
  ('Мария', 'Санкт-Петербург', 'Долго сомневалась, но решилась. Шумодав работает отлично, звук чистый. Никто не отличит от оригинала. Подруга попросила ссылку, тоже хочет заказать.', 5, 'https://i.pravatar.cc/150?img=47', true),
  ('Дмитрий', 'Казань', 'Сравнивал с оригиналом у друга — разницы ноль. Даже серийник прописан, iOS определяет модель. Кейс такой же премиальный. Рекомендую всем!', 5, 'https://i.pravatar.cc/150?img=33', true),
  ('Анна', 'Екатеринбург', 'Взяла себе и маме в подарок. Обе в восторге! Звук супер, батарея держит долго. За 2000 рублей это просто находка. Спасибо!', 5, 'https://i.pravatar.cc/150?img=25', true),
  ('Игорь', 'Новосибирск', 'Пользуюсь месяц каждый день — полёт нормальный. Шумоподавление реально работает, в метро музыку слушать комфортно. Качество сборки отличное.', 5, 'https://i.pravatar.cc/150?img=51', true);
```

## 7. Добавить начальные настройки (опционально)

```sql
INSERT INTO settings (whatsapp_number, telegram_chat_id, telegram_bot_token, sold_today, pickup_address, hero_badge_text)
VALUES (
  '79001234567',
  '6926683059',
  '8773562578:AAHT_CC-9Ag8l6GDKVP061c0AhuleI6NCi0',
  5,
  'г. Новороссийск, ул. Примерная, 1',
  'Premium Quality'
);
```

## Готово!

После выполнения этих запросов все таблицы будут созданы и заполнены тестовыми данными.
