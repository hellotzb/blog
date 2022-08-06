import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { EXCEPTION_USER, ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { User } from 'db/entity/index';
import { AppDataSource } from '@/db/data-source';

export default withIronSessionApiRoute(detail, ironOptions);

async function detail(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const { userId } = session;
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOne({
    where: {
      id: Number(userId),
    },
  });

  if (user) {
    res?.status(200)?.json({
      code: 0,
      msg: '',
      data: {
        userInfo: user,
      },
    });
  } else {
    res?.status(200)?.json({
      ...EXCEPTION_USER.NOT_FOUND,
    });
  }
}
