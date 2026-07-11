import bcrypt from 'bcryptjs';
import { supabase } from './supabase';

// Хеширование пароля
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Проверка пароля
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Регистрация пользователя
export async function registerUser(email: string, password: string, name: string, phone?: string) {
  const hashedPassword = await hashPassword(password);
  
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        email,
        password_hash: hashedPassword,
        name,
        phone: phone || null,
        role: 'customer',
      },
    ])
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      throw new Error('Пользователь с таким email уже существует');
    }
    throw new Error('Ошибка при регистрации');
  }

  return data;
}

// Авторизация пользователя
export async function loginUser(email: string, password: string) {
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !user) {
    throw new Error('Неверный email или пароль');
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    throw new Error('Неверный email или пароль');
  }

  // Убираем хеш пароля из ответа
  const { password_hash, ...userData } = user;
  return userData;
}

// Проверка роли
export function hasRole(user: any, requiredRole: 'admin' | 'seller' | 'customer'): boolean {
  if (!user || !user.role) return false;
  
  const roleHierarchy = {
    customer: 1,
    seller: 2,
    admin: 3,
  };
  
  const userLevel = roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
  const requiredLevel = roleHierarchy[requiredRole];
  
  return userLevel >= requiredLevel;
}

// Проверка авторизации
export function requireAuth(session: any, requiredRole?: 'admin' | 'seller' | 'customer') {
  if (!session || !session.user) {
    throw new Error('Необходима авторизация');
  }
  
  if (requiredRole && !hasRole(session.user, requiredRole)) {
    throw new Error('Недостаточно прав');
  }
  
  return session.user;
}

// Получение пользователя по ID
export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, name, phone, address, role, created_at')
    .eq('id', userId)
    .single();

  if (error) throw new Error('Пользователь не найден');
  return data;
}

// Обновление профиля
export async function updateUserProfile(
  userId: string,
  updates: { name?: string; phone?: string; address?: string }
) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select('id, email, name, phone, address, role, created_at')
    .single();

  if (error) throw new Error('Ошибка при обновлении профиля');
  return data;
}

// Admin функции
export async function verifyAdminPassword(password: string): Promise<boolean> {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error('ADMIN_PASSWORD not configured');
  }
  return password === adminPassword;
}

export async function isAdminAuthenticated(session?: any): Promise<boolean> {
  return session?.isAdmin === true || session?.user?.role === 'admin';
}

export async function requireAdmin(session?: any) {
  const isAdmin = await isAdminAuthenticated(session);
  if (!isAdmin) {
    return { error: 'Требуются права администратора', status: 401 };
  }
  return null;
}