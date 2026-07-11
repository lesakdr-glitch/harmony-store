import { supabase } from './supabase';

export async function sendTelegramNotification(
  botToken: string,
  chatId: string,
  message: string
) {
  try {
    if (!botToken || !chatId) {
      console.error('Missing Telegram credentials');
      return false;
    }

    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );

    if (!response.ok) {
      const error = await response.json();
      console.error('Telegram API error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Failed to send Telegram notification:', error);
    return false;
  }
}

export async function sendOrderNotification(order: any) {
  try {
    const { data: settings } = await supabase
      .from('settings')
      .select('telegram_bot_token, telegram_chat_id, support_telegram')
      .single();

    const botToken = settings?.telegram_bot_token || process.env.TELEGRAM_BOT_TOKEN;
    const chatId = settings?.telegram_chat_id || process.env.TELEGRAM_CHAT_ID;

    if (!botToken || !chatId) {
      console.warn('Telegram credentials not configured');
      return false;
    }

    const message = formatOrderMessage(order);
    const success = await sendTelegramNotification(botToken, chatId, message);

    // Если у заказа есть seller_id, отправляем уведомление продавцу
    if (order.seller_id) {
      const { data: seller } = await supabase
        .from('users')
        .select('phone')
        .eq('id', order.seller_id)
        .single();

      // Можно добавить логику отправки продавцу (SMS, email, другой Telegram)
    }

    return success;
  } catch (error) {
    console.error('Error sending order notification:', error);
    return false;
  }
}

export function formatOrderMessage(order: any): string {
  const itemsText = order.items
    .map((item: any, index: number) => 
      `${index + 1}. ${item.name}\n   Кол-во: ${item.quantity} × ${item.price}₽`
    )
    .join('\n');

  return `
🆕 <b>Новый заказ #${order.id.slice(0, 8)}</b>

👤 <b>Покупатель:</b> ${order.user_name || 'Гость'}
📱 <b>Телефон:</b> ${order.phone}
📧 <b>Email:</b> ${order.email || 'Не указан'}

📦 <b>Товары:</b>
${itemsText}

💰 <b>Итого:</b> ${order.total_price}₽
🚚 <b>Доставка:</b> ${order.delivery_method === 'sdek' ? 'СДЭК' : 'Самовывоз'}
📍 <b>Адрес:</b> ${order.delivery_address || 'Не указан'}
💳 <b>Оплата:</b> ${order.payment_method === 'sbp' ? 'СБП' : 'Наложенный платёж'}

📅 ${new Date(order.created_at).toLocaleString('ru-RU')}
  `.trim();
}

// Форматирование статуса заказа
export function formatStatusEmoji(status: string): string {
  switch (status) {
    case 'Новый':
      return '🆕';
    case 'В обработке':
      return '🔄';
    case 'Отправлен':
      return '📦';
    case 'Доставлен':
      return '✅';
    case 'Отменён':
      return '❌';
    default:
      return '📋';
  }
}

// Форматирование заказов для бота
export function formatOrdersForBot(orders: any[]): string {
  if (orders.length === 0) {
    return '📭 <b>Заказов нет</b>';
  }

  let message = `📦 <b>Последние ${orders.length} заказов:</b>\n\n`;

  orders.forEach((order, index) => {
    message += `<b>${index + 1}. Заказ #${order.id.slice(0, 8)}</b>\n`;
    message += `👤 ${order.user_name || 'Гость'}\n`;
    message += `📱 ${order.phone}\n`;
    message += `🎧 ${order.items[0]?.name || 'Товары'}...\n`;
    message += `💰 ${order.total_price}₽\n`;
    message += `📊 ${formatStatusEmoji(order.status)} ${order.status}\n\n`;
  });

  return message.trim();
}