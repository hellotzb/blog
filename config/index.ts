/**
 * API code
 * success: 0
 * error: -1
 */

export const ironOptions = {
  cookieName: process.env.SESSION_COOKIE_NAME as string,
  password: process.env.SESSION_PASSWORD as string,
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
};

export const cookieExpires = 1000 * 60 * 60 * 24; // 24 hours

export const verifyCodeExpires = '5'; // 单位：分钟

export const defaultUserAvatar =
  'https://img.51miz.com/Element/00/88/82/33/f95ce822_E888233_91015ccc.png';
