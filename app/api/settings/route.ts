import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - публичный доступ
export async function GET() {
  try {
    const { data: settings, error } = await supabaseAdmin
      .from('settings')
      .select('*')
      .single();

    if (error) {
      console.error('Settings GET error:', error);
      return NextResponse.json({ error: 'Ошибка при загрузке настроек' }, { status: 500 });
    }

    // Исключаем токены из публичного ответа
    const { telegram_bot_token, ...publicSettings } = settings || {};

    return NextResponse.json(publicSettings || {});
  } catch (error) {
    console.error('Settings GET exception:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// PATCH - только для админов
export async function PATCH(request: NextRequest) {
  try {
    const userRole = request.headers.get('x-user-role');
    
    if (userRole !== 'admin') {
      return NextResponse.json({ error: 'Доступ запрещён' }, { status: 403 });
    }

    const body = await request.json();

    // Обновляем только разрешённые поля
    const allowedFields = [
      'hero_title',
      'hero_subtitle',
      'about_text',
      'delivery_text',
      'return_text',
      'privacy_text',
      'terms_text',
      'support_telegram',
      'contact_phone',
      'contact_email',
      'inn_ogrn',
      'sbp_qr_url',
      'pickup_address',
    ];

    const updateData: Record<string, any> = {};
    Object.keys(body).forEach(key => {
      if (allowedFields.includes(key)) {
        updateData[key] = body[key];
      }
    });

    const { data, error } = await supabaseAdmin
      .from('settings')
      .update(updateData)
      .eq('id', 1) // Предполагается одна запись настроек
      .select()
      .single();

    if (error) {
      console.error('Settings PATCH error:', error);
      return NextResponse.json({ 
        error: 'Ошибка при обновлении настроек',
        details: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({ settings: data });
  } catch (error) {
    console.error('Settings PATCH exception:', error);
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
