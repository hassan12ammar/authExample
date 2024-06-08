import { CookieOptions } from "express";

export function parseExpireDate(exp: string): Date {
  const multiplier = {
    m: 60 * 1000, // Minutes
    h: 60 * 60 * 1000, // Hours
    d: 24 * 60 * 60 * 1000, // Days
  };

  const unit = exp.slice(-1).toLowerCase();
  const value = parseInt(exp.slice(0, -1), 10);

  if (isNaN(value) || !multiplier[unit]) {
    throw new Error(`Invalid expiration format: ${exp}`);
  }

  return new Date(Date.now() + value * multiplier[unit]);
}

export const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
}
