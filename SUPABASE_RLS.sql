-- Harmony Store - RLS (Row Level Security) Policies

-- Включить RLS на всех таблицах
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Пользователи (users)
-- Все видят публичные данные пользователей
CREATE POLICY "users_select_public" ON users FOR SELECT USING (true);
-- Только админы могут изменять роли и блокировать
CREATE POLICY "users_update_admin" ON users FOR UPDATE USING (
  current_setting('app.role', true) = 'admin'
);
-- Пользователи могут обновлять свой профиль
CREATE POLICY "users_update_self" ON users FOR UPDATE USING (
  id::text = current_setting('app.user_id', true)
) WITH CHECK (
  id::text = current_setting('app.user_id', true)
);

-- Категории (categories)
-- Все видят активные категории
CREATE POLICY "categories_select_public" ON categories FOR SELECT USING (true);
-- Продавцы и админы могут создавать/обновлять свои категории
CREATE POLICY "categories_insert_seller_admin" ON categories FOR INSERT WITH CHECK (
  current_setting('app.role', true) IN ('seller', 'admin') AND
  (current_setting('app.role', true) = 'admin' OR seller_id::text = current_setting('app.user_id', true))
);
CREATE POLICY "categories_update_seller_admin" ON categories FOR UPDATE USING (
  current_setting('app.role', true) IN ('seller', 'admin') AND
  (current_setting('app.role', true) = 'admin' OR seller_id::text = current_setting('app.user_id', true))
);
CREATE POLICY "categories_delete_seller_admin" ON categories FOR DELETE USING (
  current_setting('app.role', true) IN ('seller', 'admin') AND
  (current_setting('app.role', true) = 'admin' OR seller_id::text = current_setting('app.user_id', true))
);

-- Товары (products)
-- Все видят активные товары
CREATE POLICY "products_select_public" ON products FOR SELECT USING (active = true);
-- Продавцы и админы видят все свои товары (даже неактивные)
CREATE POLICY "products_select_seller_admin" ON products FOR SELECT USING (
  current_setting('app.role', true) IN ('seller', 'admin') AND
  (current_setting('app.role', true) = 'admin' OR seller_id::text = current_setting('app.user_id', true))
);
-- Продавцы и админы могут создавать/обновлять свои товары
CREATE POLICY "products_insert_seller_admin" ON products FOR INSERT WITH CHECK (
  current_setting('app.role', true) IN ('seller', 'admin') AND
  (current_setting('app.role', true) = 'admin' OR seller_id::text = current_setting('app.user_id', true))
);
CREATE POLICY "products_update_seller_admin" ON products FOR UPDATE USING (
  current_setting('app.role', true) IN ('seller', 'admin') AND
  (current_setting('app.role', true) = 'admin' OR seller_id::text = current_setting('app.user_id', true))
);
CREATE POLICY "products_delete_seller_admin" ON products FOR DELETE USING (
  current_setting('app.role', true) IN ('seller', 'admin') AND
  (current_setting('app.role', true) = 'admin' OR seller_id::text = current_setting('app.user_id', true))
);

-- Заказы (orders)
-- Пользователи видят свои заказы
CREATE POLICY "orders_select_own" ON orders FOR SELECT USING (
  user_id::text = current_setting('app.user_id', true)
);
-- Продавцы видят заказы со своими товарами
CREATE POLICY "orders_select_seller" ON orders FOR SELECT USING (
  current_setting('app.role', true) IN ('seller', 'admin') AND
  (current_setting('app.role', true) = 'admin' OR seller_id::text = current_setting('app.user_id', true))
);
-- Все могут создавать заказы
CREATE POLICY "orders_insert_public" ON orders FOR INSERT WITH CHECK (true);
-- Продавцы и админы могут обновлять статус и трек
CREATE POLICY "orders_update_seller_admin" ON orders FOR UPDATE USING (
  current_setting('app.role', true) IN ('seller', 'admin') AND
  (current_setting('app.role', true) = 'admin' OR seller_id::text = current_setting('app.user_id', true))
);
-- Публичный доступ для отслеживания по телефону (специальная функция)

-- Избранное (favorites)
-- Пользователи видят своё избранное
CREATE POLICY "favorites_select_own" ON favorites FOR SELECT USING (
  user_id::text = current_setting('app.user_id', true)
);
-- Пользователи могут управлять своим избранным
CREATE POLICY "favorites_insert_own" ON favorites FOR INSERT WITH CHECK (
  user_id::text = current_setting('app.user_id', true)
);
CREATE POLICY "favorites_delete_own" ON favorites FOR DELETE USING (
  user_id::text = current_setting('app.user_id', true)
);

-- Отзывы (reviews)
-- Все видят активные отзывы
CREATE POLICY "reviews_select_public" ON reviews FOR SELECT USING (active = true);
-- Пользователи видят все свои отзывы
CREATE POLICY "reviews_select_own" ON reviews FOR SELECT USING (
  user_id::text = current_setting('app.user_id', true)
);
-- Пользователи могут создавать отзывы
CREATE POLICY "reviews_insert_authenticated" ON reviews FOR INSERT WITH CHECK (
  current_setting('app.user_id', true) IS NOT NULL
);
-- Админы могут обновлять/удалять все отзывы
CREATE POLICY "reviews_update_admin" ON reviews FOR UPDATE USING (
  current_setting('app.role', true) = 'admin'
);
CREATE POLICY "reviews_delete_admin" ON reviews FOR DELETE USING (
  current_setting('app.role', true) = 'admin'
);

-- Настройки (settings)
-- Все видят публичные настройки
CREATE POLICY "settings_select_public" ON settings FOR SELECT USING (true);
-- Только админы могут обновлять настройки
CREATE POLICY "settings_update_admin" ON settings FOR UPDATE USING (
  current_setting('app.role', true) = 'admin'
);

-- Функции для работы с JWT
CREATE OR REPLACE FUNCTION app.set_current_user_id(user_id UUID)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.user_id', user_id::text, false);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION app.set_current_user_role(user_role TEXT)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.role', user_role, false);
END;
$$ LANGUAGE plpgsql;

-- Создать роль для анонимного доступа
CREATE ROLE anon;
GRANT anon TO postgres;

-- Создать роль для аутентифицированных пользователей
CREATE ROLE authenticated;
GRANT authenticated TO postgres;

-- Предоставить права на чтение всем
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;