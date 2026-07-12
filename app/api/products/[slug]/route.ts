import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Увеличение счётчика просмотров
    await supabaseAdmin
      .from('products')
      .update({ views_count: (await supabaseAdmin.from('products').select('views_count').eq('slug', slug).single()).data?.views_count || 0 + 1 })
      .eq('slug', slug);

    // Получение товара
    const { data: product, error } = await supabaseAdmin
      .from('products')
      .select('*, categories(name)')
      .eq('slug', slug)
      .eq('active', true)
      .single();

    if (error || !product) {
      return NextResponse.json({ error: 'Товар не найден' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 });
  }
}
