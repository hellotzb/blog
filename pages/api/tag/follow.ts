import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { Tag, User } from 'db/entity/index';
import { EXCEPTION_USER, EXCEPTION_TAG } from 'config';
import { AppDataSource } from '@/db/data-source';

export default withIronSessionApiRoute(follow, ironOptions);

async function follow(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session;
  const userId = session?.user?.id || 0;
  const { tagId, type } = req?.body || {};
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const tagRepo = AppDataSource.getRepository(Tag);
  const userRepo = AppDataSource.getRepository(User);

  const user = await userRepo.findOne({
    where: {
      id: userId,
    },
  });

  const tag = await tagRepo.findOne({
    relations: {
      users: true,
    },
    where: {
      id: tagId,
    },
  });

  if (!user) {
    res?.status(200).json({
      ...EXCEPTION_USER?.NOT_LOGIN,
    });
    return;
  }

  if (tag?.users) {
    if (type === 'follow') {
      tag.users = tag?.users?.concat([user]);
      tag.follow_count = tag?.follow_count + 1;
    } else if (type === 'unfollow') {
      tag.users = tag?.users?.filter((user) => user.id !== userId);
      tag.follow_count = tag?.follow_count - 1;
    }
  }

  if (tag) {
    const resTag = await tagRepo?.save(tag);
    res?.status(200)?.json({
      code: 0,
      msg: '',
      data: resTag,
    });
  } else {
    res?.status(200)?.json({
      ...EXCEPTION_TAG?.FOLLOW_FAILED,
    });
  }
}
