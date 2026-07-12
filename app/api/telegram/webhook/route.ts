import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Проверка токена бота
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json({ error: 'Bot token not configured' }, { status: 500 });
    }

    const message = body.message;
    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = message.chat.id;
    const text = message.text;

    // Команды бота
    if (text === '/start') {
      await sendTelegramMessage(chatId, '👋 Добро пожаловать в Harmony Store!\n\nДоступные команды:\n/orders - Мои заказы\n/help - Помощь');
    } else if (text === '/orders') {
      // Поиск заказов по chat_id (если сохранён при заказе)
      const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('telegram_chat_id', String(chatId))
        .order('created_at', { ascending: false })
        .limit(5);

      if (orders && orders.length > 0) {
        const orderList = orders.map((order: any) => 
          `Заказ #${order.id.slice(0, 8)}\nСтатус: ${order.status}\nСумма: ${order.total_price} ₽\n`
        ).join('\n');
        await sendTelegramMessage(chatId, `📦 Ваши последние заказы:\n\n${orderList}`);
      } else {
        await sendTelegramMessage(chatId, 'У вас пока нет заказов. Сделайте заказ на сайте!');
      }
    } else if (text === '/help') {
      await sendTelegramMessage(chatId, '🆘 Помощь:\n\n/start - Начать\n/orders - Мои заказы\n\nДля связи с поддержкой используйте кнопку на сайте.');
    } else {
      await sendTelegramMessage(chatId, 'Неизвестная команда. Используйте /help для справки.');
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ ok: true }); // Всегда возвращаем 200, чтобы Telegram не повторял
  }
}

async function sendTelegramMessage(chatId: number, text: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  });
  return response.json();
}
