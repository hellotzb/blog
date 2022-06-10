import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { ISession } from '..';
import { AppDataSource } from '@/db/data-source';
import { UserAuths, User } from '@/db/entity';

async function login(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session; // 被withIronSessionApiRoute包括会生成一个session对象
  const { phone = '', verify = '', identity_type = 'phone' } = req.body;
  await AppDataSource.initialize();
  const userAuthsRepo = await AppDataSource.getRepository(UserAuths);
  await AppDataSource.getRepository(User);

  if (String(session.verifyCode) === String(verify)) {
    // 验证码校验成功, 在user_auths表中查找identity_type是否有记录
    const userAuth = await userAuthsRepo.findOne({
      where: {
        identity_type,
        identifier: phone,
      },
      relations: {
        user: true, // 返回值关联users表
      },
    });

    if (userAuth) {
      // 查找到记录, 直接登录
      const user = userAuth.user;
      const { id, nickname, avatar } = user;
      session.user = { id, nickname, avatar };
      await session.save();
    } else {
      // 没有查找到记录, 创建一条记录
      const user = new User();
      user.nickname = `用户_${Math.floor(Math.random() * 10000)}`;
      user.avatar =
        'https://img3.doubanio.com/view/richtext/large/public/p206989230.jpg';
      user.job = '暂无';
      user.introduce = '暂无';

      const userAuth = new UserAuths();
      userAuth.identity_type = identity_type;
      userAuth.identifier = phone;
      userAuth.credential = session.verifyCode;
      userAuth.user = user;

      // 设置了cascade: true, 只需要保存userAuth，user会自动保存
      const userAuthResponse = await userAuthsRepo.save(userAuth);
      const {
        user: { id, avatar, nickname },
      } = userAuthResponse;
      session.user = { id, nickname, avatar };
      await session.save();
    }
    // 验证码校验成功
    res.status(200).json({
      code: 0,
      msg: '登录成功',
      data: session.user || {},
    });
  } else {
    // 验证码校验失败
    res.status(200).json({
      code: -1,
      msg: '验证码校验失败',
    });
  }
}

export default withIronSessionApiRoute(login, ironOptions);
