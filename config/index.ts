/**
 * API code
 * success: 0
 * error: -1
 */
export const EXCEPTION_USER = {
  PUBLISH_FAIL: {
    code: 1,
  },
};
export const EXCEPTION_ARTICLE = {
  PUBLISH_FAIL: {
    code: 2001,
    msg: '发布文章失败',
  },
  UPDATE_FAIL: {
    code: 2002,
    msg: '编辑文章失败',
  },
  NOT_FOUND_ARTICLE: {
    code: 2003,
    msg: '未找到文章',
  },
};
export const EXCEPTION_COMMENT = {
  PUBLISH_FAIL: {
    code: 4001,
    msg: '发布文评论失败',
  },
};

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

export const verifyCodeExpires = '5'; // 验证码过期时间，单位：分钟

export const defaultUserAvatar =
  'https://img.51miz.com/Element/00/88/82/33/f95ce822_E888233_91015ccc.png';
