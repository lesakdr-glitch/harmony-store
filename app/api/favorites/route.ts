import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { getSession } from '@/lib/session';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        product:products(
          id,
          name,
          slug,
          price,
          old_price,
          image_url,
          in_stock,
          category:categories(name)
        )
      `)
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { product_id } = await request.json();

    const { data, error } = await supabase
      .from('favorites')
      .insert([{
        user_id: session.user.id,
        product_id,
      }])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Already in favorites' },
          { status: 400 }
        );
      }
      throw error;
    }

    return NextResponse.json({ success: true, favorite: data });
  } catch (error: any) {
    console.error('Error adding to favorites:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add to favorites' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    
    if (!session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', session.user.id)
      .eq('product_id', productId);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error removing from favorites:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove from favorites' },
      { status: 500 }
    );
  }
}