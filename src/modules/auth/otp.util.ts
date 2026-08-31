import { createHash } from 'crypto';

export const OTP_LENGTH = 6;

export const OTP_EXPIRY_MINUTES = 3;

export const MAX_VERIFY_ATTEMPTS = 3;

export const MAX_REQUESTS_PER_WINDOW = 3;

export const REQUEST_WINDOW_MINUTES = 15;

export function generateOtpCode(): string {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;

  return Math.floor(min + Math.random() * (max - min)).toString();
}

export function hashOtpCode(code: string): string {
  return createHash('sha256').update(code).digest('hex');
}
