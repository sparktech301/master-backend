import { createHash, randomBytes } from 'crypto';

export const REFRESH_TOKEN_EXPIRY_DAYS = 30;
export const ACCESS_TOKEN_EXPIRY = '15m';

export function generateRefreshToken(): string {
  return randomBytes(40).toString('hex');
}

export function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}
