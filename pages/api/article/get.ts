import { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { Article } from 'db/entity/index';
import { AppDataSource } from '@/db/data-source';

export default withIronSessionApiRoute(get, ironOptions);

async function get(req: NextApiRequest, res: NextApiResponse) {
  const { tag_id = 0 } = req?.query || {};
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  const articleRepo = AppDataSource.getRepository(Article);

  let articles = [];

  if (tag_id) {
    articles = await articleRepo.find({
      relations: {
        user: true, // 返回值关联users表
        tags: true, // 返回值关联tags表
      },
      where: {
        tags: {
          id: Number(tag_id),
        },
      },
    });
  } else {
    articles = await articleRepo.find({
      relations: {
        user: true, // 返回值关联users表
        tags: true, // 返回值关联tags表
      },
    });
  }

  res?.status(200).json({
    code: 0,
    msg: '',
    data: articles || [],
  });
}
