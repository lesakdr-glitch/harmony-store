import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyAdminPassword } from '@/lib/auth';
import { sendTelegramNotification, formatOrderMessage } from '@/lib/telegram';

// POST - публичный доступ для создания заказа
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { data: order, error } = await supabaseAdmin
      .from('orders')
      .insert(body)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Ошибка при создании заказа' }, { status: 500 });
    }

    // Отправка уведомления в Telegram
    await sendTelegramNotification(formatOrderMessage(order));

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// GET - для админов и публичный поиск по телефону
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const email = searchParams.get('email');

    // Публичный поиск по телефону
    if (phone) {
      const { data: orders, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('customer_phone', phone)
        .order('created_at', { ascending: false });

      if (error) {
        return NextResponse.json({ error: 'Ошибка при поиске заказов' }, { status: 500 });
      }

      return NextResponse.json({ orders });
    }

    // Для админов - все заказы
    const adminPassword = request.headers.get('x-admin-password');
    if (!verifyAdminPassword(adminPassword || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: orders, error } = await supabaseAdmin
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Ошибка при загрузке заказов' }, { status: 500 });
    }

    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// PATCH - только для админов
export async function PATCH(request: NextRequest) {
  try {
    const adminPassword = request.headers.get('x-admin-password');
    if (!verifyAdminPassword(adminPassword || '')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    const { data, error } = await supabaseAdmin
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Ошибка при обновлении заказа' }, { status: 500 });
    }

    return NextResponse.json({ order: data });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
