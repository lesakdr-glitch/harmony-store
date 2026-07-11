import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { normalizePhone } from '@/lib/phone';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SECRET_TOKEN = process.env.TELEGRAM_SECRET_TOKEN;

// Состояния пользователей
const userStates = new Map<number, 'awaiting_phone'>();

interface TelegramMessage {
  message_id: number;
  from: {
    id: number;
    first_name: string;
    username?: string;
  };
  chat: {
    id: number;
    type: string;
  };
  text?: string;
  web_app_data?: {
    data: string;
  };
}

interface TelegramUpdate {
  update_id: number;
  message?: TelegramMessage;
  callback_query?: any;
}

async function sendTelegramMessage(
  chatId: number,
  text: string,
  replyMarkup?: any
) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      reply_markup: replyMarkup,
    }),
  });
}

function getMainKeyboard() {
  return {
    keyboard: [
      [{ text: '🛍 Каталог', web_app: { url: `${SITE_URL}/catalog` } }],
      [{ text: '📦 Мои заказы' }, { text: '💬 Поддержка' }],
      [{ text: '❓ Частые вопросы' }],
    ],
    resize_keyboard: true,
  };
}

async function handleStart(chatId: number, firstName: string) {
  const text = 
    `👋 Здравствуйте, ${firstName}!\n\n` +
    `Добро пожаловать в <b>Harmony Store</b> — магазин продукции Vilavi для митохондриального здоровья.\n\n` +
    `🌿 Выберите действие:`;

  await sendTelegramMessage(chatId, text, getMainKeyboard());
}

async function handleOrders(chatId: number) {
  userStates.set(chatId, 'awaiting_phone');
  
  const text =
    '📦 <b>Поиск заказов</b>\n\n' +
    'Введите номер телефона, который указывали при оформлении заказа.\n\n' +
    'Формат: +79991234567 или 89991234567';

  await sendTelegramMessage(chatId, text);
}

async function handlePhone(chatId: number, phone: string) {
  userStates.delete(chatId);
  
  const normalizedPhone = normalizePhone(phone);
  
  // Ищем заказы - в orders нет прямого поля phone, ищем в delivery_address
  const { data: orders, error } = await supabaseAdmin
    .from('orders')
    .select('id, items, total_price, status, track_number, created_at, delivery_address')
    .ilike('delivery_address', `%${normalizedPhone}%`)
    .order('created_at', { ascending: false })
    .limit(5);

  if (error || !orders || orders.length === 0) {
    const text =
      '😔 Заказы не найдены.\n\n' +
      'Проверьте номер телефона или оформите новый заказ в каталоге.';
    
    await sendTelegramMessage(chatId, text, getMainKeyboard());
    return;
  }

  let text = `📦 <b>Ваши заказы (${orders.length}):</b>\n\n`;

  for (const order of orders) {
    const date = new Date(order.created_at).toLocaleDateString('ru-RU');
    const items = Array.isArray(order.items) ? order.items : [];
    const itemsList = items.map((item: any) => `• ${item.name} × ${item.quantity}`).join('\n');
    
    text += `<b>Заказ от ${date}</b>\n`;
    text += `${itemsList}\n`;
    text += `💰 Сумма: ${order.total_price.toLocaleString('ru-RU')} ₽\n`;
    text += `📍 Статус: ${order.status}\n`;
    
    if (order.track_number) {
      text += `📦 Трек: ${order.track_number}\n`;
    }
    
    text += '\n';
  }

  await sendTelegramMessage(chatId, text, getMainKeyboard());
}

async function handleSupport(chatId: number) {
  const { data: settings } = await supabaseAdmin
    .from('settings')
    .select('support_telegram')
    .single();

  const supportUsername = settings?.support_telegram || 'HarmonySupport';
  
  const text =
    '💬 <b>Поддержка</b>\n\n' +
    'Напишите нам в Telegram, мы всегда на связи!';

  const keyboard = {
    inline_keyboard: [
      [{ text: '✉️ Написать в поддержку', url: `https://t.me/${supportUsername}` }],
    ],
  };

  await sendTelegramMessage(chatId, text, keyboard);
}

async function handleFAQ(chatId: number) {
  const text =
    '❓ <b>Частые вопросы</b>\n\n' +
    '🚚 <b>Доставка:</b> СДЭК 3-7 дней по всей России\n' +
    '📍 <b>Самовывоз:</b> г. Новороссийск\n' +
    '💳 <b>Оплата:</b> СБП или наложенный платёж\n' +
    '🔄 <b>Возврат:</b> 14 дней с момента получения\n' +
    '🌿 <b>Состав:</b> 100% натуральные компоненты\n' +
    '📦 <b>Гарантия:</b> качество подтверждено сертификатами\n\n' +
    'Есть ещё вопросы? Напишите в поддержку!';

  await sendTelegramMessage(chatId, text, getMainKeyboard());
}

export async function POST(request: Request) {
  try {
    // 🔐 Проверка секретного токена Telegram (защита от фейковых запросов)
    if (SECRET_TOKEN) {
      const secretToken = request.headers.get('x-telegram-bot-api-secret-token');
      if (secretToken !== SECRET_TOKEN) {
        console.error('Invalid Telegram secret token');
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const update: TelegramUpdate = await request.json();

    // Обработка сообщений
    if (update.message) {
      const message = update.message;
      const chatId = message.chat.id;
      const text = message.text || '';
      const firstName = message.from.first_name;

      // Команды
      if (text === '/start') {
        await handleStart(chatId, firstName);
        return NextResponse.json({ ok: true });
      }

      // Кнопки меню
      if (text === '🛍 Каталог') {
        const response = 
          '🛍 <b>Каталог товаров</b>\n\n' +
          'Откройте наш каталог прямо в Telegram!';
        
        const keyboard = {
          inline_keyboard: [
            [{ text: '🛍 Открыть каталог', web_app: { url: `${SITE_URL}/catalog` } }],
          ],
        };
        
        await sendTelegramMessage(chatId, response, keyboard);
        return NextResponse.json({ ok: true });
      }

      if (text === '📦 Мои заказы') {
        await handleOrders(chatId);
        return NextResponse.json({ ok: true });
      }

      if (text === '💬 Поддержка') {
        await handleSupport(chatId);
        return NextResponse.json({ ok: true });
      }

      if (text === '❓ Частые вопросы') {
        await handleFAQ(chatId);
        return NextResponse.json({ ok: true });
      }

      // Ожидание телефона
      if (userStates.get(chatId) === 'awaiting_phone') {
        await handlePhone(chatId, text);
        return NextResponse.json({ ok: true });
      }

      // Неизвестная команда
      const response =
        '🤔 Не понял команду.\n\n' +
        'Используйте меню ниже или отправьте /start';
      
      await sendTelegramMessage(chatId, response, getMainKeyboard());
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram bot error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// Установка webhook при первом запуске
export async function GET() {
  if (!BOT_TOKEN) {
    return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
  }

  try {
    const webhookUrl = `${SITE_URL}/api/bot`;
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`;
    
    const body: any = { url: webhookUrl };
    
    // Добавляем secret_token если указан в .env
    if (SECRET_TOKEN) {
      body.secret_token = SECRET_TOKEN;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      webhook: webhookUrl,
      response: data,
      secret_token_set: !!SECRET_TOKEN,
    });
  } catch (error) {
    console.error('Webhook setup error:', error);
    return NextResponse.json({ error: 'Failed to set webhook' }, { status: 500 });
  }
}
