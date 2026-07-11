-- Добавить поле support_telegram в таблицу settings
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS support_telegram TEXT DEFAULT 'Smartstoretech';

-- Переименовать rating -> stars в таблице reviews (если нужно)
-- Если у вас колонка называется "rating", выполните:
-- ALTER TABLE reviews RENAME COLUMN rating TO stars;

-- Если колонка stars уже существует, пропустите этот шаг

-- Вставить начальные настройки (если таблица пуста)
INSERT INTO settings (
  whatsapp_number, 
  telegram_chat_id, 
  telegram_bot_token, 
  support_telegram,
  sold_today, 
  pickup_address, 
  hero_badge_text
)
SELECT 
  '',
  '6926683059',
  '8773562578:AAHT_CC-9Ag8l6GDKVP061c0AhuleI6NCi0',
  'Smartstoretech',
  5,
  'г. Новороссийск',
  'Premium Quality'
WHERE NOT EXISTS (SELECT 1 FROM settings LIMIT 1);

-- Готово! Теперь все поля настроены корректно.
