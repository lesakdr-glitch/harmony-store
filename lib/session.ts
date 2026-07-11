import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { User } from './supabase';

export interface SessionData {
  user?: User;
  isAdmin?: boolean;
  cart?: Array<{
    product_id: string;
    name: string;
    price: number;
    quantity: number;
    image_url: string;
  }>;
}

export const sessionOptions = {
  password: process.env.SESSION_SECRET!,
  cookieName: 'harmony-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 дней
  },
};

export async function getSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  return session;
}

export async function createSession(user: User) {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  session.user = user;
  await session.save();
}

export async function saveSession(session: any) {
  const cookieStore = await cookies();
  return session.save();
}

export async function clearSession() {
  const cookieStore = await cookies();
  const session = await getIronSession<SessionData>(cookieStore, sessionOptions);
  session.destroy();
}

// Управление корзиной в сессии
export async function getCart() {
  const session = await getSession();
  return session.cart || [];
}

export async function addToCart(item: {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}) {
  const session = await getSession();
  let cart = session.cart || [];
  
  const existingItemIndex = cart.findIndex(
    cartItem => cartItem.product_id === item.product_id
  );
  
  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += item.quantity;
  } else {
    cart.push(item);
  }
  
  session.cart = cart;
  await saveSession(session);
  return cart;
}

export async function updateCartItem(productId: string, quantity: number) {
  const session = await getSession();
  let cart = session.cart || [];
  
  const itemIndex = cart.findIndex(item => item.product_id === productId);
  
  if (itemIndex >= 0) {
    if (quantity <= 0) {
      cart.splice(itemIndex, 1);
    } else {
      cart[itemIndex].quantity = quantity;
    }
  }
  
  session.cart = cart;
  await saveSession(session);
  return cart;
}

export async function removeFromCart(productId: string) {
  const session = await getSession();
  let cart = session.cart || [];
  
  cart = cart.filter(item => item.product_id !== productId);
  session.cart = cart;
  await saveSession(session);
  return cart;
}

export async function clearCart() {
  const session = await getSession();
  session.cart = [];
  await saveSession(session);
}

// Расчет суммы корзины
export function calculateCartTotal(cart: any[]): number {
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}