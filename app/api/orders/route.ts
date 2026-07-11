import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';
import { sendOrderNotification } from '@/lib/telegram';
import { normalizePhone } from '@/lib/supabase';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');

    // Публичный доступ по номеру телефона (для /track)
    if (phone) {
      const normalizedPhone = normalizePhone(phone);
      
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .or(`delivery_address.ilike.%${normalizedPhone}%,items->>phone.eq.${normalizedPhone}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return NextResponse.json(data || []);
    }

    // Авторизованный доступ
    const session = await getSession();
    
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    // Фильтрация по роли
    if (session.user.role === 'customer') {
      query = query.eq('user_id', session.user.id);
    } else if (session.user.role === 'seller') {
      query = query.eq('seller_id', session.user.id);
    }
    // admin видит все

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getSession();

    const orderData = {
      user_id: session.user?.id || null,
      items: body.items,
      total_price: body.total_price,
      delivery_method: body.delivery_method,
      delivery_address: body.delivery_address,
      payment_method: body.payment_method,
      status: 'Новый',
      seller_id: body.items[0]?.seller_id || null,
    };

    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select()
      .single();

    if (error) throw error;

    // Отправить уведомление в Telegram
    await sendOrderNotification({
      ...data,
      user_name: session.user?.name || body.name || 'Гость',
      phone: body.phone,
      email: body.email,
    });

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    
    if (!session.user || !['admin', 'seller'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status, track_number } = await request.json();

    // Проверка прав для продавца
    if (session.user.role === 'seller') {
      const { data: order } = await supabase
        .from('orders')
        .select('seller_id')
        .eq('id', id)
        .single();

      if (order?.seller_id !== session.user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    const updates: any = {};
    if (status) updates.status = status;
    if (track_number !== undefined) updates.track_number = track_number;

    const { data, error } = await supabase
      .from('orders')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, order: data });
  } catch (error: any) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update order' },
      { status: 500 }
    );
  }
}