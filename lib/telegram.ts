// Отправка уведомления в Telegram
export async function sendTelegramNotification(message: string): Promise<void> {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    console.error('Telegram credentials not configured');
    return;
  }

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      console.error('Failed to send Telegram notification:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
}

// Формирование сообщения о новом заказе
export function formatOrderMessage(order: any): string {
  const items = order.items.map((item: any) => 
    `• ${item.name} x${item.quantity} — ${item.price * item.quantity} ₽`
  ).join('\n');

  return `
🔔 <b>Новый заказ!</b>

👤 Имя: ${order.customer_name}
📱 Телефон: ${order.customer_phone}
📧 Email: ${order.customer_email || 'Не указан'}

📦 Товары:
${items}

💰 Сумма: ${order.total_price} ₽
🚚 Доставка: ${order.delivery_method === 'sdek' ? 'СДЭК' : 'Самовывоз'}
💳 Оплата: ${order.payment_method === 'sbp' ? 'QR СБП' : 'Наложенный платёж'}
${order.delivery_address ? `📍 Адрес: ${order.delivery_address}` : ''}
  `.trim();
}
