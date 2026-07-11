import { isValidPhone, normalizePhone } from './phone';

export interface OrderInput {
  name: string;
  phone: string;
  city: string;
  delivery: string;
  product_name: string;
  price: number;
}

export function validateOrderInput(body: Partial<OrderInput>): {
  valid: boolean;
  error?: string;
  data?: OrderInput;
} {
  const name = body.name?.trim();
  const city = body.city?.trim();
  const delivery = body.delivery?.trim();
  const product_name = body.product_name?.trim();
  const price = Number(body.price);

  if (!name || name.length < 2) {
    return { valid: false, error: 'Укажите имя (минимум 2 символа)' };
  }

  if (!body.phone || !isValidPhone(body.phone)) {
    return { valid: false, error: 'Укажите телефон в формате +7XXXXXXXXXX' };
  }

  if (!city || city.length < 2) {
    return { valid: false, error: 'Укажите город' };
  }

  if (!delivery) {
    return { valid: false, error: 'Выберите способ доставки' };
  }

  if (!product_name) {
    return { valid: false, error: 'Товар не указан' };
  }

  if (!price || price <= 0) {
    return { valid: false, error: 'Некорректная цена' };
  }

  return {
    valid: true,
    data: {
      name,
      phone: normalizePhone(body.phone),
      city,
      delivery,
      product_name,
      price,
    },
  };
}
