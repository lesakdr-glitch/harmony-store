# 🔐 Анализ безопасности Harmony Store

## Оценка: **7/10** — Хорошо, но есть уязвимости

---

## ✅ Что защищено ХОРОШО

### 1. Пароли ⭐⭐⭐⭐⭐
```typescript
// bcryptjs + salt 10 раундов
const hash = await bcrypt.hash(password, 10);
```
**Взлом**: Практически невозможен. Перебор 1 пароля = ~1 секунда на мощном ПК.

### 2. RLS (Row Level Security) ⭐⭐⭐⭐⭐
```sql
-- Пользователь видит только свои заказы
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);
```
**Защита**: Даже если взломают API, база не отдаст чужие данные. Postgres блокирует на уровне БД.

### 3. HTTP-Only Cookies ⭐⭐⭐⭐
```typescript
cookieOptions: {
  httpOnly: true, // JavaScript не может украсть
  secure: true,   // Только HTTPS
  sameSite: 'lax' // Защита от CSRF
}
```
**Защита от**: XSS атаки не смогут украсть сессию.

### 4. iron-session (зашифрованные сессии) ⭐⭐⭐⭐⭐
Сессии зашифрованы AES-256. Без `SESSION_SECRET` невозможно подделать.

### 5. Проверка ролей на API ⭐⭐⭐⭐
```typescript
if (session.user?.role !== 'admin') {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
```

---

## ⚠️ Уязвимости и как исправить

### 1. 🚨 Rate Limiting — НЕТ (КРИТИЧНО)

**Проблема**: Можно перебирать пароли бесконечно.

**Риск**: Bruteforce атака на `/api/auth/login`

**Как взломать**:
```bash
# Скрипт перебора паролей
for password in $(cat passwords.txt); do
  curl -X POST /api/auth/login \
    -d "email=admin@site.com&password=$password"
done
```

**Исправление**: Добавьте rate limiting

```typescript
// lib/rate-limit.ts
const rateLimit = new Map<string, number[]>();

export function checkRateLimit(ip: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const requests = rateLimit.get(ip) || [];
  
  // Удаляем старые запросы
  const recentRequests = requests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return false; // Лимит превышен
  }
  
  recentRequests.push(now);
  rateLimit.set(ip, recentRequests);
  return true;
}

// В app/api/auth/login/route.ts
const ip = request.headers.get('x-forwarded-for') || 'unknown';
if (!checkRateLimit(ip, 5, 60000)) {
  return NextResponse.json({ error: 'Слишком много попыток' }, { status: 429 });
}
```

**Альтернатива**: Используйте [Vercel Rate Limiting](https://vercel.com/docs/security/rate-limiting) (платно) или [upstash-redis](https://github.com/upstash/ratelimit)

---

### 2. 🔶 CSRF токены — НЕТ (СРЕДНИЙ РИСК)

**Проблема**: Злоумышленник может отправить форму от вашего имени.

**Риск**: Если вы залогинены, хакер может создать фейковый сайт с формой:
```html
<form action="https://your-site.com/api/orders" method="POST">
  <input name="items" value='[{"product_id":"x","quantity":999}]'>
  <button>Нажми сюда!</button>
</form>
```

**Исправление**: `sameSite: 'lax'` частично защищает, но лучше добавить CSRF токен:

```typescript
// lib/csrf.ts
import crypto from 'crypto';

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export function verifyCsrfToken(token: string, storedToken: string): boolean {
  return crypto.timingSafeEqual(
    Buffer.from(token),
    Buffer.from(storedToken)
  );
}

// В session добавить:
session.csrfToken = generateCsrfToken();

// В формах:
<input type="hidden" name="csrf" value={csrfToken} />

// На API проверять:
if (body.csrf !== session.csrfToken) {
  return NextResponse.json({ error: 'Invalid CSRF' }, { status: 403 });
}
```

---

### 3. 🟡 Telegram Webhook — ОТКРЫТ (СРЕДНИЙ РИСК)

**Проблема**: Любой может отправить фейковый запрос на `/api/bot`

**Риск**: Спам боту, DDoS

**Исправление**: Добавьте Secret Token

```bash
# 1. Генерируем токен
openssl rand -hex 32

# 2. Добавляем в .env
TELEGRAM_SECRET_TOKEN=ваш_сгенерированный_токен

# 3. Устанавливаем webhook с токеном
curl -X POST https://api.telegram.org/bot<TOKEN>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-site.com/api/bot",
    "secret_token": "ваш_сгенерированный_токен"
  }'
```

```typescript
// В app/api/bot/route.ts
export async function POST(request: Request) {
  // Проверка секретного токена
  const secretToken = request.headers.get('x-telegram-bot-api-secret-token');
  if (secretToken !== process.env.TELEGRAM_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  // Остальной код...
}
```

---

### 4. 🟢 SQL Injection — ЗАЩИЩЕНО ✅

Supabase использует параметризованные запросы, но всё равно валидируйте:

```typescript
// ПЛОХО (но Supabase экранирует)
.eq('slug', userInput)

// ХОРОШО (всегда валидируйте)
if (!/^[a-z0-9-]+$/.test(slug)) {
  return NextResponse.json({ error: 'Invalid slug' }, { status: 400 });
}
```

---

### 5. 🟢 XSS атаки — ЗАЩИЩЕНО ✅

React экранирует автоматически. **НО НЕ ДЕЛАЙТЕ**:

```typescript
// ❌ ОПАСНО
<div dangerouslySetInnerHTML={{__html: userInput}} />

// ✅ БЕЗОПАСНО
<div>{userInput}</div>
```

---

### 6. 🟡 Секреты в коде — СРЕДНИЙ РИСК

**Проблема**: `SESSION_SECRET` хранится в `.env`, но может попасть в git.

**Исправление**:
```bash
# .gitignore (уже добавлено)
.env
.env.local
.env.production

# Проверка
git log --all --full-history -- "*env*"
```

---

### 7. 🔶 HTTPS — ЗАВИСИТ ОТ ХОСТИНГА

**На Vercel**: Автоматически включён SSL ✅  
**На своём сервере**: Настройте Let's Encrypt

```nginx
# nginx config
server {
  listen 443 ssl http2;
  ssl_certificate /path/to/cert.pem;
  ssl_certificate_key /path/to/key.pem;
}
```

---

## 📊 Сравнение с другими магазинами

| Функция | Harmony Store | WooCommerce | Shopify |
|---------|---------------|-------------|---------|
| RLS защита | ✅ | ❌ | ✅ |
| Хеширование паролей | ✅ bcrypt | ✅ bcrypt | ✅ |
| Rate Limiting | ❌ | ⚠️ частично | ✅ |
| CSRF защита | ⚠️ частично | ✅ | ✅ |
| HTTPS | ✅ (Vercel) | ⚠️ зависит | ✅ |
| 2FA | ❌ | ✅ плагин | ✅ |
| Webhooks защита | ❌ | ✅ | ✅ |

---

## 🛡️ Финальные рекомендации

### Критично (сделать ОБЯЗАТЕЛЬНО)
1. ✅ Добавить Rate Limiting на `/api/auth/login` и `/api/auth/register`
2. ✅ Защитить Telegram webhook секретным токеном
3. ✅ Проверить, что `.env` в `.gitignore`

### Важно (сделать желательно)
4. ⚠️ Добавить CSRF токены на формы
5. ⚠️ Настроить логирование неудачных попыток входа
6. ⚠️ Добавить капчу на регистрацию (Google reCAPTCHA)

### Дополнительно (опционально)
7. 🔹 2FA (двухфакторная аутентификация)
8. 🔹 Email подтверждение регистрации
9. 🔹 Аудит логов через Sentry или LogRocket
10. 🔹 Content Security Policy (CSP) headers

---

## 🎯 Итоговая оценка

### Для обычного магазина: **ДОСТАТОЧНО БЕЗОПАСЕН** ✅

**Можно взломать?**  
- Bruteforce пароли: ❌ НЕТ (если добавить Rate Limiting)  
- SQL инъекции: ❌ НЕТ (Supabase защищён)  
- XSS атаки: ❌ НЕТ (React экранирует)  
- Украсть сессию: ❌ НЕТ (HttpOnly cookies)  
- CSRF: ⚠️ ДА (если не добавить токены)  
- Спам боту: ⚠️ ДА (если не защитить webhook)

### Для банка или криптобиржи: **НЕДОСТАТОЧНО** ❌
Нужно: WAF, 2FA, аудит кода, penetration testing, SOC 2 compliance

### Для интернет-магазина БАДов: **ОТЛИЧНО** ✅
Уровень безопасности выше среднего по рынку.

---

## 📚 Полезные ссылки

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Next.js Security](https://nextjs.org/docs/app/building-your-application/configuring/security-headers)
- [Supabase RLS Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Vercel Security Best Practices](https://vercel.com/docs/security)

---

**Вывод**: Добавьте Rate Limiting + защитите Telegram webhook → безопасность будет 9/10. Для магазина этого БОЛЕЕ чем достаточно.
