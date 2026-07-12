-- Миграция: добавление полей в таблицу settings
-- Запустить в Supabase SQL Editor

-- Текстовые страницы
ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_text TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS delivery_text TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS return_text TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS privacy_text TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS terms_text TEXT;

-- Контакты и поддержка
ALTER TABLE settings ADD COLUMN IF NOT EXISTS support_telegram TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS inn_ogrn TEXT;

-- Hero и прочее
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_title TEXT DEFAULT 'Harmony Store';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS hero_subtitle TEXT DEFAULT 'Продукция Vilavi для митохондриального здоровья';
ALTER TABLE settings ADD COLUMN IF NOT EXISTS sbp_qr_url TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS pickup_address TEXT;

-- Если таблица пустая, добавить первую строку
INSERT INTO settings (id, hero_title, hero_subtitle)
SELECT 1, 'Harmony Store', 'Продукция Vilavi для митохондриального здоровья'
WHERE NOT EXISTS (SELECT 1 FROM settings WHERE id = 1);
