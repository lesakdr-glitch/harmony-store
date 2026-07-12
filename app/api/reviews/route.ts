import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET - публичный доступ
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const product_id = searchParams.get('product_id');

    if (!product_id) {
      return NextResponse.json({ error: 'Не указан product_id' }, { status: 400 });
    }

    const { data: reviews, error } = await supabaseAdmin
      .from('reviews')
      .select('*')
      .eq('product_id', product_id)
      .eq('approved', true)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Ошибка при загрузке отзывов' }, { status: 500 });
    }

    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}

// POST - публичный доступ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, rating, comment, customer_name } = body;

    if (!product_id || !rating || !comment) {
      return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('reviews')
      .insert({
        product_id,
        rating,
        comment,
        customer_name,
        approved: false, // Требует модерации
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Ошибка при создании отзыва' }, { status: 500 });
    }

    return NextResponse.json({ review: data });
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
