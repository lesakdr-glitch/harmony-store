# Исправление админских API в Harmony Store

## Что было исправлено

### 1. Авторизация (401)
**Проблема:** Компоненты не отправляли заголовки `x-user-id` и `x-user-role`.

**Решение:** Упрощена авторизация — все админские API теперь проверяют только `x-user-role: admin`.

**Изменённые файлы:**
- `app/api/auth/login/route.ts` — возвращает полные данные пользователя
- `app/api/settings/route.ts` — проверка `x-user-role === 'admin'`
- `app/api/admin/dashboard/route.ts` — проверка `x-user-role === 'admin'`
- `app/api/products/route.ts` — упрощена проверка
- `app/api/orders/route.ts` — упрощена проверка
- `app/api/users/route.ts` — проверка роли + сохранение `x-user-id` для предотвращения смены собственной роли

**Как работает:**
1. После логина `localStorage.setItem('user', JSON.stringify(user))` сохраняет: `id`, `email`, `name`, `role`
2. Компоненты отправляют `x-user-role: user.role` в заголовках
3. API проверяет: `request.headers.get('x-user-role') === 'admin'`

### 2. Настройки (500)
**Проблема:** Таблица `settings` не содержала всех необходимых колонок.

**Решение:** SQL миграция в `supabase_settings_migration.sql`.

**Добавленные поля:**
- `hero_title`, `hero_subtitle` — заголовки Hero
- `about_text`, `delivery_text`, `return_text`, `privacy_text`, `terms_text` — текстовые страницы
- `support_telegram`, `contact_phone`, `contact_email`, `inn_ogrn` — контакты
- `sbp_qr_url`, `pickup_address` — прочее

**Запустить в Supabase SQL Editor:**
```sql
-- См. файл supabase_settings_migration.sql
```

### 3. Обновлённые компоненты
**`components/SettingsPanel.tsx`:**
- Добавлена проверка роли перед сохранением
- Отправляет `x-user-role: admin`
- Логирует ошибки в консоль

**`components/Dashboard.tsx`:**
- Отправляет только `x-user-role`
- Безопасная обработка пустых данных

**`components/UsersPanel.tsx`:**
- Отправляет `x-user-role` + `x-user-id` для PATCH (предотвращение смены собственной роли)

## Как проверить

1. **Выполнить SQL миграцию:**
   - Открыть Supabase Dashboard → SQL Editor
   - Скопировать содержимое `supabase_settings_migration.sql`
   - Выполнить

2. **Войти как админ:**
   - Логин через `/login`
   - Проверить что `localStorage.user.role === 'admin'`

3. **Проверить админку:**
   - `/account` → вкладка "Настройки"
   - Изменить любое поле → "Сохранить"
   - Должно появиться "✅ Сохранено"

4. **Проверить Dashboard:**
   - `/account` → вкладка "Админ-панель"
   - Должна загрузиться статистика

5. **Проверить Пользователи:**
   - `/account` → вкладка "Пользователи"
   - Должен загрузиться список пользователей

## Отладка

**401 Unauthorized:**
- Проверить `localStorage.getItem('user')` — должен быть объект с `role: 'admin'`
- Проверить Network → Headers → Request → должен быть `x-user-role: admin`

**500 Internal Server Error:**
- Открыть консоль браузера — там будут детали ошибки
- Проверить что SQL миграция выполнена
- Проверить логи Supabase

**403 Forbidden:**
- Пользователь не админ — проверить роль в базе данных

## Безопасность

⚠️ **ВАЖНО:** Текущая реализация проверяет роль через заголовок `x-user-role`, который отправляет клиент. Это **не безопасно** для production!

**Для production нужно:**
1. Использовать JWT токены или iron-session
2. Проверять роль на сервере через базу данных
3. Использовать Supabase Auth RLS (Row Level Security)

Текущая реализация подходит для **MVP/прототипа**, но требует доработки для продакшена.
