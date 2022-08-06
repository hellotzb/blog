import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { Tag } from 'db/entity/index';
import { AppDataSource } from '@/db/data-source';

async function get(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const userId = session?.user?.id || 0;
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const tagRepo = AppDataSource.getRepository(Tag);

  const followTags = await tagRepo.find({
    relations: {
      users: true,
    },
    where: {
      users: {
        id: Number(userId),
      },
    },
  });

  const allTags = await tagRepo.find({
    relations: {
      users: true,
    },
  });

  res?.status(200)?.json({
    code: 0,
    msg: '获取标签信息成功',
    data: {
      followTags,
      allTags,
    },
  });
}

export default withIronSessionApiRoute(get, ironOptions);
