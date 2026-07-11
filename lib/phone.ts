const PHONE_REGEX = /^\+7\d{10}$/;

export function normalizePhone(input: string): string {
  let phone = input.replace(/[\s\-()]/g, '');

  if (phone.startsWith('8') && phone.length === 11) {
    phone = '+7' + phone.slice(1);
  }

  return phone;
}

export function isValidPhone(input: string): boolean {
  return PHONE_REGEX.test(normalizePhone(input));
}
