import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    // Не отдаём токены публично
    if (data) {
      const { telegram_bot_token, telegram_chat_id, ...publicData } = data;
      return NextResponse.json(publicData);
    }

    // Возвращаем дефолты
    return NextResponse.json({
      support_telegram: 'HarmonySupport',
      pickup_address: 'г. Новороссийск',
      hero_title: 'Harmony Store — здоровье начинается с митохондрий',
      hero_subtitle: 'Продукция Vilavi для митохондриального здоровья',
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session.user || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updates = await request.json();

    const { data, error } = await supabase
      .from('settings')
      .update(updates)
      .eq('id', 1)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, settings: data });
  } catch (error: any) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update settings' },
      { status: 500 }
    );
  }
}