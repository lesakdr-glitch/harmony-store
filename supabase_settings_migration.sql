-- Миграция: добавление полей в таблицу settings
-- Запустить в Supabase SQL Editor

ALTER TABLE settings ADD COLUMN IF NOT EXISTS about_text TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS delivery_text TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS return_text TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS privacy_text TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS terms_text TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS support_telegram TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS contact_email TEXT;
ALTER TABLE settings ADD COLUMN IF NOT EXISTS inn_ogrn TEXT;
