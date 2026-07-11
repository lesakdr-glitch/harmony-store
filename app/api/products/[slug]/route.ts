import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        category:categories(id, name, slug),
        seller:users!products_seller_id_fkey(name)
      `)
      .eq('slug', params.slug)
      .eq('active', true)
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Получить похожие товары из той же категории
    const { data: similar } = await supabase
      .from('products')
      .select('id, name, slug, price, old_price, image_url')
      .eq('category_id', data.category_id)
      .eq('active', true)
      .neq('id', data.id)
      .limit(4);

    return NextResponse.json({
      product: data,
      similar: similar || [],
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}