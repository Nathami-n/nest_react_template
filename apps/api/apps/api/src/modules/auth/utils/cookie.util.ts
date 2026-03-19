import { Response } from 'express';
import { COOKIE_NAMES } from '@app/common';

const isProduction = process.env.NODE_ENV === 'production';

export const setAuthCookies = (
  res: Response,
  accessToken: string,
  refreshToken: string,
) => {
  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? ('strict' as const) : ('lax' as const),
    path: '/',
  };

  res.cookie(COOKIE_NAMES.ACCESS_TOKEN, accessToken, {
    ...cookieOptions,
    maxAge: 3600 * 1000, // 1 hour
  });

  res.cookie(COOKIE_NAMES.REFRESH_TOKEN, refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 3600 * 1000, // 7 days
  });
};

export const clearAuthCookies = (res: Response) => {
  res.clearCookie(COOKIE_NAMES.ACCESS_TOKEN, { path: '/' });
  res.clearCookie(COOKIE_NAMES.REFRESH_TOKEN, { path: '/' });
};
