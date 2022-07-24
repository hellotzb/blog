import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { EXCEPTION_COMMENT, ironOptions } from 'config';
import { ISession } from '..';
import { AppDataSource } from '@/db/data-source';
import { Article, User, Comment } from '@/db/entity';

async function publish(req: NextApiRequest, res: NextApiResponse) {
  const session: ISession = req.session; // 被withIronSessionApiRoute包括会生成一个session对象
  const { articleId = 0, content = '' } = req.body;
  await AppDataSource.initialize();
  const userRepo = AppDataSource.getRepository(User);
  const articleRepo = AppDataSource.getRepository(Article);
  const commentRepo = AppDataSource.getRepository(Comment);

  const user = await userRepo.findOne({
    where: {
      id: session?.user?.id,
    },
  });

  const article = await articleRepo.findOne({
    where: {
      id: articleId,
    },
  });

  const comment = new Comment();
  comment.content = content;
  comment.create_time = new Date();
  comment.update_time = new Date();

  if (user) {
    comment.user = user;
  }
  if (article) {
    comment.article = article;
  }
  try {
    const resComment = await commentRepo.save(comment);
    if (resComment) {
      res.status(200).json({
        code: 0,
        msg: '发布成功',
        data: resComment,
      });
    } else {
      res.status(200).json({
        ...EXCEPTION_COMMENT.PUBLISH_FAIL,
      });
    }
  } catch (error) {
    res.status(500).json({
      ...EXCEPTION_COMMENT.PUBLISH_FAIL,
    });
  }
}
export default withIronSessionApiRoute(publish, ironOptions);
