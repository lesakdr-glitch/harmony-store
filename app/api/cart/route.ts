import { NextResponse } from 'next/server';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '@/lib/session';

export async function GET() {
  try {
    const cart = await getCart();
    return NextResponse.json({ cart });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const item = await request.json();
    const cart = await addToCart(item);
    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    console.error('Error adding to cart:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to add to cart' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { product_id, quantity } = await request.json();
    const cart = await updateCartItem(product_id, quantity);
    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    console.error('Error updating cart:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update cart' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('product_id');
    const clearAll = searchParams.get('clear');

    if (clearAll === 'true') {
      await clearCart();
      return NextResponse.json({ success: true, cart: [] });
    }

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const cart = await removeFromCart(productId);
    return NextResponse.json({ success: true, cart });
  } catch (error: any) {
    console.error('Error removing from cart:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to remove from cart' },
      { status: 500 }
    );
  }
}