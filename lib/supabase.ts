import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Типы данных
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  role: 'admin' | 'seller' | 'customer';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  seller_id: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  category_id: string;
  seller_id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  old_price: number | null;
  image_url: string;
  ozon_url: string | null;
  wb_url: string | null;
  yandex_url: string | null;
  is_featured: boolean;
  in_stock: boolean;
  active: boolean;
  created_at: string;
  category?: Category;
}

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

export interface Order {
  id: string;
  user_id: string | null;
  items: CartItem[];
  total_price: number;
  delivery_method: 'sdek' | 'pickup';
  delivery_address: string | null;
  payment_method: 'sbp' | 'cod';
  status: 'Новый' | 'В обработке' | 'Отправлен' | 'Доставлен' | 'Отменён';
  track_number: string | null;
  seller_id: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  text: string;
  stars: number;
  active: boolean;
  created_at: string;
  user?: User;
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Settings {
  id: number;
  support_telegram: string;
  telegram_bot_token: string | null;
  telegram_chat_id: string | null;
  sbp_qr_url: string | null;
  pickup_address: string;
  hero_title: string;
  hero_subtitle: string;
  about_vilavi: string | null;
  privacy_text: string | null;
  terms_text: string | null;
  default_ozon_url: string | null;
  default_wb_url: string | null;
  default_yandex_url: string | null;
  created_at: string;
  updated_at: string;
}

// Вспомогательные функции
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU').format(price) + ' ₽';
}

export function getDiscountPercentage(oldPrice: number, newPrice: number): number {
  if (!oldPrice || oldPrice <= newPrice) return 0;
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
}

export function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  
  if (digits.startsWith('8')) {
    return '+7' + digits.slice(1);
  }
  
  if (digits.startsWith('7')) {
    return '+' + digits;
  }
  
  if (digits.length === 10) {
    return '+7' + digits;
  }
  
  if (digits.length === 11) {
    return '+' + digits;
  }
  
  return '+7' + digits;
}