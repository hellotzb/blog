import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { cookieExpires, ironOptions } from 'config';
import { ISession } from '..';
import { Cookie } from 'next-cookie';

async function logout(req: NextApiRequest, res: NextApiResponse) {
  // logout需要清除session和cookie
  const session: ISession = req.session;
  const cookies = Cookie.fromApiRoute(req, res);
  const expires = new Date(Date.now() + cookieExpires);

  await session.destroy();
  try {
    cookies.set('blogUser', JSON.stringify({}), { path: '/', expires });
  } catch (error) {
    console.log(error);
  }

  res.status(200).json({
    code: 0,
    msg: '退出登录成功',
    data: {},
  });
}

export default withIronSessionApiRoute(logout, ironOptions);
