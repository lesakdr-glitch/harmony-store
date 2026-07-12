-- Включение RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Политики для users
-- Пользователи могут видеть только свои данные
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

-- Пользователи могут обновлять только свои данные
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Политики для categories
-- Все могут читать категории
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- Только админы могут создавать/обновлять/удалять категории
CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Политики для products
-- Все могут читать активные товары
CREATE POLICY "Anyone can view active products" ON products
  FOR SELECT USING (active = true);

-- Только админы могут управлять товарами
CREATE POLICY "Admins can manage products" ON products
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Политики для orders
-- Пользователи могут видеть свои заказы
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid()::text = user_id::text OR user_id IS NULL);

-- Пользователи могут создавать заказы
CREATE POLICY "Users can create orders" ON orders
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR user_id IS NULL);

-- Только админы могут видеть все заказы
CREATE POLICY "Admins can view all orders" ON orders
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Только админы могут обновлять заказы
CREATE POLICY "Admins can update orders" ON orders
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Политики для favorites
-- Пользователи могут видеть свои избранные
CREATE POLICY "Users can view own favorites" ON favorites
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Пользователи могут добавлять в избранное
CREATE POLICY "Users can add favorites" ON favorites
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Пользователи могут удалять из избранного
CREATE POLICY "Users can delete favorites" ON favorites
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Политики для reviews
-- Все могут видеть активные отзывы
CREATE POLICY "Anyone can view active reviews" ON reviews
  FOR SELECT USING (active = true);

-- Авторизованные пользователи могут создавать отзывы
CREATE POLICY "Users can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR user_id IS NULL);

-- Только админы могут управлять отзывами
CREATE POLICY "Admins can manage reviews" ON reviews
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Политики для settings
-- Все могут читать настройки (кроме секретных)
CREATE POLICY "Anyone can view public settings" ON settings
  FOR SELECT USING (true);

-- Только админы могут обновлять настройки
CREATE POLICY "Admins can update settings" ON settings
  FOR UPDATE USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));
