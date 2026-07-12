-- Включение расширения для UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Таблица пользователей
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  phone TEXT,
  address TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('admin', 'seller', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица категорий
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица товаров
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  old_price INTEGER,
  image_url TEXT,
  ozon_url TEXT,
  wb_url TEXT,
  yandex_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  in_stock BOOLEAN DEFAULT TRUE,
  active BOOLEAN DEFAULT TRUE,
  views_count INTEGER DEFAULT 0,
  badge TEXT CHECK (badge IN ('Новинка', 'Хит', 'Скидка')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица заказов
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  items JSONB NOT NULL,
  total_price INTEGER NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  delivery_address TEXT,
  delivery_method TEXT NOT NULL CHECK (delivery_method IN ('sdek', 'pickup')),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('sbp', 'cod')),
  status TEXT DEFAULT 'Новый' CHECK (status IN ('Новый', 'В обработке', 'Отправлен', 'Доставлен', 'Отменён')),
  track_number TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица избранного
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Таблица отзывов
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_city TEXT,
  text TEXT NOT NULL,
  stars INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
  avatar_url TEXT,
  photos JSONB,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Таблица настроек
CREATE TABLE settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  support_telegram TEXT,
  telegram_bot_token TEXT,
  telegram_chat_id TEXT,
  sbp_qr_url TEXT,
  pickup_address TEXT,
  hero_title TEXT,
  hero_subtitle TEXT,
  about_text TEXT,
  delivery_text TEXT,
  return_text TEXT,
  privacy_text TEXT,
  terms_text TEXT,
  whatsapp_number TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  inn_ogrn TEXT
);

-- Индексы для оптимизации
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_active ON products(active) WHERE active = TRUE;
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_phone ON orders(customer_phone);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_active ON reviews(active) WHERE active = TRUE;

-- Вставка начальных настроек
INSERT INTO settings (hero_title, hero_subtitle, about_text) VALUES (
  'Harmony Store — Продукция Vilavi для митохондриального здоровья',
  'БАДы, концентраты, масла, витаминные комплексы и клетчатка для вашего здоровья',
  'Vilavi — это премиальная продукция для митохондриального здоровья. Наши продукты созданы с использованием новейших научных исследований и натуральных ингредиентов для поддержки вашего организма на клеточном уровне.'
) ON CONFLICT (id) DO NOTHING;

-- Создание админа (пароль: V9kL3mR7xP2qN5wY8cB1)
INSERT INTO users (email, password_hash, name, role) VALUES (
  'admin@harmonystore.ru',
  '$2a$10$LOU3Xm0o1vcAXDn7kVd0lOxtHji2gogWFrj/cTOWWy3X1xnpYxbJS',
  'Admin',
  'admin'
) ON CONFLICT (email) DO NOTHING;
