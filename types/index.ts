// Harmony Store - TypeScript типы

// Пользователь
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  address: string | null;
  role: 'admin' | 'seller' | 'customer';
  created_at: string;
}

// Категория
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  seller_id: string | null;
  created_at: string;
}

// Товар
export interface Product {
  id: string;
  category_id: string | null;
  seller_id: string | null;
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

// Элемент заказа
export interface OrderItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
}

// Заказ
export interface Order {
  id: string;
  user_id: string | null;
  items: OrderItem[];
  total_price: number;
  delivery_method: 'sdek' | 'pickup';
  delivery_address: string | null;
  payment_method: 'sbp' | 'cod';
  status: 'Новый' | 'В обработке' | 'Отправлен' | 'Доставлен' | 'Отменён';
  track_number: string | null;
  seller_id: string | null;
  created_at: string;
}

// Избранное
export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

// Отзыв
export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  text: string;
  stars: number;
  active: boolean;
  created_at: string;
  user?: Pick<User, 'name'>;
  product?: Pick<Product, 'name' | 'slug'>;
}

// Настройки
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

// Корзина (сессия)
export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url: string;
}

// API ответы
export interface ApiResponse<T = any> {
  success?: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ProductsResponse {
  products: Product[];
  total?: number;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface OrdersResponse {
  orders: Order[];
}

export interface FavoritesResponse {
  favorites: Favorite[];
}

export interface ReviewsResponse {
  reviews: Review[];
}

export interface CartResponse {
  cart: CartItem[];
  total: number;
}

export interface SessionData {
  user?: User;
  cart?: CartItem[];
}
