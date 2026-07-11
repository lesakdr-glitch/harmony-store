-- Harmony Store - Supabase Schema
-- Продукция Vilavi для митохондриального здоровья

-- Пользователи
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'seller', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Категории
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Товары
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL CHECK (price > 0),
  old_price INTEGER,
  image_url TEXT NOT NULL,
  ozon_url TEXT,
  wb_url TEXT,
  yandex_url TEXT,
  is_featured BOOLEAN DEFAULT false,
  in_stock BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Заказы
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_price INTEGER NOT NULL,
  delivery_method TEXT NOT NULL CHECK (delivery_method IN ('sdek', 'pickup')),
  delivery_address TEXT,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('sbp', 'cod')),
  status TEXT NOT NULL DEFAULT 'Новый' CHECK (status IN ('Новый', 'В обработке', 'Отправлен', 'Доставлен', 'Отменён')),
  track_number TEXT,
  seller_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Избранное
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Отзывы
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Настройки
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  support_telegram TEXT NOT NULL DEFAULT 'HarmonySupport',
  telegram_bot_token TEXT,
  telegram_chat_id TEXT,
  sbp_qr_url TEXT,
  pickup_address TEXT NOT NULL DEFAULT 'г. Новороссийск',
  hero_title TEXT NOT NULL DEFAULT 'Harmony Store — здоровье начинается с митохондрий',
  hero_subtitle TEXT NOT NULL DEFAULT 'Продукция Vilavi для митохондриального здоровья',
  about_vilavi TEXT,
  privacy_text TEXT,
  terms_text TEXT,
  default_ozon_url TEXT,
  default_wb_url TEXT,
  default_yandex_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Индексы для производительности
CREATE INDEX idx_products_category_id ON products(category_id);
CREATE INDEX idx_products_seller_id ON products(seller_id);
CREATE INDEX idx_products_is_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_seller_id ON orders(seller_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id) WHERE active = true;

-- Триггер для обновления updated_at в settings
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Вставить начальные настройки
INSERT INTO settings (
  support_telegram,
  hero_title,
  hero_subtitle,
  pickup_address,
  about_vilavi,
  privacy_text,
  terms_text
) VALUES (
  'HarmonySupport',
  'Harmony Store — здоровье начинается с митохондрий',
  'Продукция Vilavi для митохондриального здоровья',
  'г. Новороссийск',
  'Vilavi — это линейка продуктов для митохондриального здоровья, созданная на основе современных научных исследований. Наши БАДы, концентраты, масла и витаминные комплексы помогают поддерживать энергетический обмен на клеточном уровне.',
  'Политика конфиденциальности Harmony Store...',
  'Пользовательское соглашение Harmony Store...'
) ON CONFLICT (id) DO NOTHING;

-- Создать тестовые данные (опционально)
DO $$
DECLARE
  seller_id UUID;
  category_id UUID;
BEGIN
  -- Создать тестового продавца
  INSERT INTO users (email, password_hash, name, role) VALUES
  ('seller@harmony.store', '$2b$10$...', 'Мама Виталия', 'seller')
  ON CONFLICT DO NOTHING RETURNING id INTO seller_id;
  
  -- Создать тестовую категорию
  INSERT INTO categories (name, slug, description, seller_id) VALUES
  ('БАДы и концентраты', 'bady-i-koncentraty', 'Биологически активные добавки и концентраты Vilavi', seller_id)
  ON CONFLICT DO NOTHING RETURNING id INTO category_id;
  
  -- Создать тестовый товар
  INSERT INTO products (category_id, seller_id, name, slug, description, price, old_price, image_url) VALUES
  (
    category_id,
    seller_id,
    'Митохондриальный комплекс Vilavi Premium',
    'mitohondrialnyj-kompleks-vilavi-premium',
    'Комплекс для поддержки митохондриального здоровья с усиленной формулой',
    3500,
    4200,
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
  ) ON CONFLICT DO NOTHING;
END $$;