import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - публичный доступ
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    if (!user_id) {
      return NextResponse.json({ error: 'Не указан user_id' }, { status: 400 });
    }

    const { data: favorites, error } = await supabaseAdmin
      .from('favorites')
      .select('*, products(*)')
      .eq('user_id', user_id);

    if (error) {
      return NextResponse.json({ error: 'Ошибка при загрузке избранного' }, { status: 500 });
    }

    return NextResponse.json({ favorites });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// POST - публичный доступ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user_id, product_id } = body;

    if (!user_id || !product_id) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('favorites')
      .insert({ user_id, product_id })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Ошибка при добавлении в избранное' }, { status: 500 });
    }

    return NextResponse.json({ favorite: data });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// DELETE - публичный доступ
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    const product_id = searchParams.get('product_id');

    if (!user_id || !product_id) {
      return NextResponse.json({ error: 'Не указаны user_id или product_id' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('favorites')
      .delete()
      .eq('user_id', user_id)
      .eq('product_id', product_id);

    if (error) {
      return NextResponse.json({ error: 'Ошибка при удалении из избранного' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
