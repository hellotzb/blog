import { cookieExpires } from 'config';
import { Cookie } from 'next-cookie';

interface ICookiesInfo {
  user: {
    id: number;
    nickname: string;
    avatar: string;
  };
}

export const setCookies = (cookies: Cookie, { user }: ICookiesInfo) => {
  // 登录时效
  const expires = new Date(Date.now() + cookieExpires);
  const path = '/';
  try {
    cookies.set('blogUser', JSON.stringify(user), {
      path,
      expires,
    });
  } catch (error) {
    console.log(error);
  }
};
